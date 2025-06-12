import { generateStoryService } from "../service/generateStoryService.js";


export async function generateStoryController(req, res) {
    const followOnAnswer = req.body.followOnAnswer;
    const sessionId = req.body.sessionId;  
     try {
            
        const result = await generateStoryService(sessionId, followOnAnswer);
        res.json(result);
    
        } catch (error) {
            console.error('Story generation failed:', error.message);
            res.status(500).json({ error: 'Failed to generate story\n' + error.message });
        }

}

