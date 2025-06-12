import { evaluateStoryFromLLM } from '../service/gemini.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


export async function evaluateStory(req, res) {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const requirementFile = req.files.file;
    const filePath = path.join(uploadDir, Date.now() + '-' + requirementFile.name);

    requirementFile.mv(filePath, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed' });
        }

        fs.readFile(filePath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'File read failed' });
            }
            const requirement = data;
            console.log('File content:', requirement);
            if (!requirement) {
                console.log("400 error")
                return res.status(400).json({ message: 'No requirement provided' });
            }
            try {
                const result = await evaluateStoryFromLLM(requirement);
                res.json(result);
            } catch (error) {
                console.error('Epic generation failed:', error.message);
                res.status(500).json({ error: 'Failed to generate epics' });
            }
        })
    })
}     