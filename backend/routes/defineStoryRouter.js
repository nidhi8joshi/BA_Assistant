import { Router } from 'express';
const storyRouter = Router();
import { generateStoryController } from '../controllers/generateStoryController.js';



storyRouter.post('/generateStoryList', generateStoryController);
storyRouter.get('/generateStoryListGet', (req, res) => {
    res.json({ message: 'GET request received for story generation' });
});


export default storyRouter;