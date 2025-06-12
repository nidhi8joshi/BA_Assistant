import { Router } from 'express';
const epicRouter = Router();
import { generateEpicController, sampleController, getEpicList } from '../controllers/generateEpicController.js';



epicRouter.post('/generateEpicList', generateEpicController);
epicRouter.post('/getEpicList', getEpicList);
epicRouter.post('/sample', sampleController);


export default epicRouter;