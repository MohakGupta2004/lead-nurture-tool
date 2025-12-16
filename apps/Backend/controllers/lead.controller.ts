import type { Request, Response } from 'express';
import { LeadModel } from '../models/lead.model';
import { CampaignModel } from '../models/campaing.model';

export const getAllLeads = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor; 
        console.log('Realtor from middleware:', realtor ? 'Found' : 'Not found');
        
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const leads = await LeadModel.find({ realtorId: realtor._id })
            .populate('campaignId', 'campaignName')
            .sort({ createdAt: -1 });

        res.json({ leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
};

export const getLeadsByCampaign = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor; 
        const { campaignId } = req.query;
        
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        if (!campaignId || campaignId === 'undefined') {
            console.log('Invalid campaign ID provided:', campaignId);
            return res.status(400).json({ error: 'Valid campaign ID is required' });
        }

        const campaign = await CampaignModel.findOne({ 
            _id: campaignId, 
            realtorId: realtor._id 
        }).populate({
            path: 'leads',
            options: { sort: { createdAt: -1 } }
        });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const campaignLeads = await CampaignModel.findOne({ _id: campaignId }).populate('leads');
        const leadData = (campaignLeads?.leads || []).map((lead: any) => ({
            id: lead._id,
            name: lead.name,
            email: lead.email,
            phNo: lead.phNo,
        }));    

        res.json({ leads: leadData });
    } catch (error) {
        console.error('Error fetching campaign leads:', error);
        res.status(500).json({ error: 'Failed to fetch campaign leads' });
    }
};

export const createSingleLead = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor; 
        
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { name, email, phone, address, campaignId } = req.body;

        const checkExistingLead = await LeadModel.findOne({ email: email, realtorId: realtor._id, campaignId: campaignId });
        
        if(checkExistingLead){
            return res.status(400).json({ error: 'Lead with this email already exists for the selected campaign' });
        }

        if (!name || !email || !campaignId) {
            return res.status(400).json({ 
                error: 'Name, email, and campaign are required' 
            });
        }

        // if (!campaignId.match(/^[0-9a-fA-F]{24}$/)) {
        //     return res.status(400).json({ 
        //         error: 'Invalid campaign ID format' 
        //     });
        // }

        const campaign = await CampaignModel.findOne({ 
            _id: campaignId, 
            realtorId: realtor._id 
        });
        
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const leadData: any = {
            name,
            email,
            realtorId: realtor._id,
            campaignId: campaignId
        };

        if (phone) leadData.phNo = phone;
        if (address) leadData.address = address;

        const lead = new LeadModel(leadData);
        await lead.save();

        campaign.leads.push(lead._id as any);
        await campaign.save();

        res.status(201).json({ success: true });
    } catch (error: any) {
        console.error('Error creating lead:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create lead' });
    }
};

export const createMultipleLeads = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor; 
        
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { leads, campaignId } = req.body;

        const campaign = await CampaignModel.findOne({ 
            _id: campaignId, 
            realtorId: realtor._id 
        });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const leadsToCreate = leads.map((lead: any) => ({
            name: lead.name,
            email: lead.email,
            phNo: lead.phone,
            address: lead.address,
            realtorId: realtor._id,
            campaignId
        }));

        const createdLeads = await LeadModel.insertMany(leadsToCreate);

        const leadIds = createdLeads.map(lead => lead._id);
        campaign.leads.push(...leadIds as any);
        await campaign.save();

        res.status(201).json({ success: true, createdCount: createdLeads.length });
    } catch (error) {
        console.error('Error creating multiple leads:', error);
        res.status(500).json({ error: 'Failed to create leads' });
    }
};

