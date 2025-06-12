import { generateNarrativeService } from '../service/generateNarrativeService.js';

export async function generateNarrativeController(req, res) {
    const followOnAnswer = req.body.followOnAnswer;
    const sessionId = req.body.sessionId;  
     try {
            
        const result = await generateNarrativeService(sessionId, followOnAnswer);
        res.json(result);
    
        } catch (error) {
            console.error('Narrative generation failed:', error.message);
            res.status(500).json({ error: 'Failed to generate narrative\n' + error.message });
        }

}