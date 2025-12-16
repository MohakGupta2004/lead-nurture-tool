import express from 'express';
import { 
    getAllCampaigns, 
    createCampaign, 
    updateCampaignStatus,
    updateCampaign, 
    deleteCampaign 
} from '../controllers/campaign.controller';

const router = express.Router();

router.get('/all', getAllCampaigns);

router.post('/create', createCampaign);

router.patch('/update-status', updateCampaignStatus);

router.patch('/update', updateCampaign);

router.delete('/delete', deleteCampaign);

export default router;