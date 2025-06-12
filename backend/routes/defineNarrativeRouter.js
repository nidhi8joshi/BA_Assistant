import { Router } from 'express';
const narrativeRouter = Router();
import { generateNarrativeController } from '../controllers/generateNarrativeController.js';


narrativeRouter.post('/generateNarratives', generateNarrativeController);
narrativeRouter.get('/generateNarrativesGet', (req, res) => {
    res.json({ message: 'GET request received for story generation' });
});


export default narrativeRouter;