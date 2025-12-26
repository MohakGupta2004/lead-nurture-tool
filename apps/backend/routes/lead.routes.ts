import express from "express";
import {
  getAllLeads,
  getLeadsByCampaign,
  createSingleLead,
  createMultipleLeads,
  editLead,
  deleteLead
} from "../controllers/lead.controller";

const router = express.Router();

router.get("/all", getAllLeads);

router.get("/getLeadbyCampaign", getLeadsByCampaign);

router.post("/create", createSingleLead);

router.post("/create/batch", createMultipleLeads);

router.post('/update', editLead)
router.post('/delete', deleteLead)

export default router;
