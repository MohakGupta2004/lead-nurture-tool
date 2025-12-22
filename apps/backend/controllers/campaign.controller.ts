import { CampaignModel } from '../models/campaing.model';
import { RealtorModel } from '../models/realtor.model';
import { LeadModel } from '../models/lead.model';
import type { Request, Response } from 'express';

export const getAllCampaigns = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;

        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const populatedRealtor = await RealtorModel.findById(realtor._id).populate('campaignsId');

        if (!populatedRealtor) {
            return res.status(404).json({ error: 'Realtor profile not found' });
        }

        const campaignData = (populatedRealtor.campaignsId as any[]).map((campaign) => {

            const totalLeads = campaign.leads ? campaign.leads.length : 0;

            return {
                id: campaign._id,
                name: campaign.campaignName,
                totalLeads: totalLeads,
                createdAt: campaign.createdAt,
                status: campaign.status.toLowerCase(),
                objective: campaign.objective,
                targetPersona: campaign.targetPersona,
                description: campaign.description
            };
        });

        res.json(campaignData);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
};

export const createCampaign = async (req: Request, res: Response) => {

    console.log('Realtor from middleware:', req.realtor ? { id: req.realtor._id, name: req.realtor.brokerageName } : 'null');

    try {
        const realtor = req.realtor;

        if (!realtor) {
            console.log('ERROR: No realtor found in request');
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { name, objective, targetPersona, description, city } = req.body;

        console.log('Campaign creation request:', { name, objective, targetPersona, description });

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Campaign name is required' });
        }
        if (!objective || !objective.trim()) {
            return res.status(400).json({ error: 'Campaign objective is required' });
        }
        if (!targetPersona || !targetPersona.trim()) {
            return res.status(400).json({ error: 'Target persona is required' });
        }

        // Create new campaign
        const campaign = new CampaignModel({
            campaignName: name.trim(),
            objective: objective.trim(),
            targetPersona: targetPersona.trim(),
            description: description?.trim() || '',
            status: 'Paused',
            city: city,
            realtorId: realtor._id
        });

        await campaign.save();
        console.log('Campaign saved successfully:', campaign._id);

        console.log('Realtor before update:', { id: realtor._id, campaignsCount: realtor.campaignsId.length });
        realtor.campaignsId.push(campaign._id as any);
        console.log('Added campaign to realtor, saving...');
        await realtor.save();
        console.log('Realtor updated successfully');

        res.json({ success: true, campaign: { id: campaign._id, name: campaign.campaignName } });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
};

export const updateCampaignStatus = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;

        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { campaignId, status } = req.body;

        const campaign = await CampaignModel.findOneAndUpdate(
            { _id: campaignId, realtorId: realtor._id },
            { status },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating campaign status:', error);
        res.status(500).json({ error: 'Failed to update campaign status' });
    }
};

export const updateCampaign = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;

        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { name, objective, targetPersona, description, campaignId } = req.body;

        const campaign = await CampaignModel.findOneAndUpdate(
            { _id: campaignId, realtorId: realtor._id },
            {
                campaignName: name,
                objective,
                targetPersona,
                description
            },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ error: 'Failed to update campaign' });
    }
};

export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;

        if (!realtor) {
            console.log('ERROR: No realtor found in request');
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { campaignId } = req.body;
        console.log('Campaign ID to delete:', campaignId);

        const campaign = await CampaignModel.findOneAndDelete({
            _id: campaignId,
            realtorId: realtor._id
        });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        realtor.campaignsId = realtor.campaignsId.filter(
            (cId: any) => cId.toString() !== campaignId
        );
        await realtor.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
};