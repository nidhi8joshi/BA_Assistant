import { Router } from 'express';
const router = Router();
import { evaluateStory } from '../controllers/controller.js';

router.post('/evaluateStory', evaluateStory);
router.get('/evaluateStoryGet', (req, res) => {
    res.json({ message: req.file + 'GET request received' });
});

export default router;