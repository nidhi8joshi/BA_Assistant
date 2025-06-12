
import { generateEpicService, getEpicListForSession, sample } from '../service/generateEpicService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure deliverable uploads folder exists
const uploadDirDel = path.join(__dirname, 'uploads/deliverables');
if (!fs.existsSync(uploadDirDel)) {
    fs.mkdirSync(uploadDirDel);
}
// Ensure mindmap uploads folder exists
const uploadDirMm = path.join(__dirname, 'uploads/mindmap');
if (!fs.existsSync(uploadDirMm)) {
    fs.mkdirSync(uploadDirMm);
}

export async function generateEpicController(req, res) {
    if (!req.files || !req.files.file || !req.files.mindmap ) 
        return res.status(400).json({ message: 'No file uploaded' });
    
    const deliverableFile = req.files.file;
    const mindmapfile = req.files.mindmap;
    const followOnAnswer = req.body.followOnAnswer;
    const sessionId = req.body.sessionId;  

    const deliverablefilePath = path.join(uploadDirDel, Date.now() + '-' + deliverableFile.name);
    const mindmapfilePath = path.join(uploadDirMm, Date.now() + '-' + mindmapfile.name);

    deliverableFile.mv(deliverablefilePath, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed' });
        }
        mindmapfile.mv(mindmapfilePath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'File upload failed' });
            }

            fs.readFile(deliverablefilePath, 'utf8', async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'File read failed' });
                }
                const deliverable = data;
                console.log('Deliverable read complete');

                fs.readFile(mindmapfilePath, 'utf8', async (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'File read failed' });
                    }
                    const mindmap = data.toString('base64');
                    console.log('Mindmap read complete');
                    if (!deliverable) {
                        console.log("400 error")
                        return res.status(400).json({ message: 'No deliverable provided' });
                    }
                    if (!mindmap) {
                        console.log("400 error")
                        return res.status(400).json({ message: 'No mindmap provided' });
                    }
                    try {
                        // if (followOnAnswer == '') {
                            const result = await generateEpicService(deliverable, mindmapfilePath, sessionId, followOnAnswer);
                            res.json(result);
                        // }
                        // else{
                        //     const result = await generateEpicService(deliverable, mindmapfilePath, sessionId, followOnAnswer);
                        //     res.json(result);
                        // }
                    } catch (error) {
                        console.error('Epic generation failed:', error.message);
                        res.status(500).json({ error: 'Failed to generate epics\n' + error.message });
                    }
                })
            });
        })
    })
}


export async function getEpicList(req, res) {

    const sessionId = req.body.sessionId;
    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
    }
    const refinementProgress = await getEpicListForSession(sessionId);
    // res.json(result);

                            
    if (!refinementProgress || refinementProgress === null) {
        return res.status(404).json({ message: 'No epics found for this session' });
    }
    
    res.json({ epics: refinementProgress , sessionId: sessionId  });
}


export async function sampleController(req, res) {
    const uuid = req.body.uuid ;
    if(uuid){
        const result = await sample(uuid);
        res.json(result);
    }
    else{
        const result = await sample(null);
        res.json(result);
    }

}