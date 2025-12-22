import type { Request, Response } from "express";
import { emailQueue } from "../queues/emailQueue.js";
import { FestiveTriggerModel } from "../models/festiveTrigger.model.js";


export const festiveTriggerController = async (req: Request, res: Response) => {
  try {
    const realtor = req.realtor;
    if (!realtor) {
      return res.status(403).json({ error: "Realtor access required" });
    }

    const { festival, enabled } = req.body;

    if (!festival) {
      return res.status(400).json({ error: "Festival is required" });
    }

    const FESTIVAL_DATES: Record<string, Date> = {
      christmas: new Date("2025-12-25T00:00:00Z"),
      newyear: new Date("2026-01-01T00:00:00Z"),
    };

    const runAt = FESTIVAL_DATES[festival.toLowerCase()];
    if (!runAt) {
      return res.status(400).json({ error: "Unsupported festival" });
    }

    if (enabled === false) {
      await FestiveTriggerModel.updateOne(
        { realtorId: realtor._id, festival },
        { enabled: false }
      );

      return res.json({ success: true, message: "Festive trigger disabled" });
    }

    const trigger = await FestiveTriggerModel.findOneAndUpdate(
      { realtorId: realtor._id, festival },
      {
        realtorId: realtor._id,
        festival,
        enabled: true,
        status: "pending",
        runAt
      },
      { upsert: true, new: true }
    );

    const now = new Date();
    const timeUntilRun = runAt.getTime() - now.getTime();
    const RESEND_MAX_SCHEDULE_MS = 72 * 60 * 60 * 1000;
    const SAFE_WINDOW_MS = 48 * 60 * 60 * 1000;

    let delay = 0;
    if (timeUntilRun > RESEND_MAX_SCHEDULE_MS) {
      delay = timeUntilRun - SAFE_WINDOW_MS;
    }

    await emailQueue.add(
      "festival-trigger",
      {
        triggerId: trigger._id.toString(),
        realtorId: realtor._id,
        festival,
        runAt,
      },
      {
        removeOnComplete: true,
        delay,
        jobId: `festival-trigger:${realtor._id}:${festival}`,
      }
    );

    res.json({
      success: true,
      festival,
      runAt
    });
  } catch (err) {
    console.error("Festive trigger error:", err);
    res.status(500).json({ error: "Failed to configure festive trigger" });
  }
};
