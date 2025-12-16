import express from 'express';
import { 
    getAllLeads, 
    getLeadsByCampaign, 
    createSingleLead, 
    createMultipleLeads
} from '../controllers/lead.controller';

const router = express.Router();

router.get('/all', getAllLeads);

router.get('/getLeadbyCampaign', getLeadsByCampaign);

router.post('/create', createSingleLead);

router.post('/create/batch', createMultipleLeads);

export default router;