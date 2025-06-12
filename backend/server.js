import express from 'express';
import routes from './routes/router.js';
import epicRouter from './routes/defineEpicsRouter.js';
import cors from 'cors'
import fileUpload from 'express-fileupload';
import storyRouter from './routes/definestoryRouter.js';
import narrativeRouter from './routes/defineNarrativeRouter.js';

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.static('uploads')); // to serve uploaded files

// Modular routes
app.use('/api',routes);
app.use('/api/epics', epicRouter);
app.use('/api/story', storyRouter);
app.use('/api/narrative', narrativeRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));