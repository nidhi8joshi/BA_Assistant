import e from 'express';
import { getOrCreateChat, genAI, refinementProgressDetails } from './initiateChat.js';

async function createPrompt() {
    return `You are a senior product manager. Based on epic list generated on this session and all necessary information available, list down all the possible user stories that can be created from the given context in current chat session per epic.
    Include all functional and non-functional requirements / acceptance criteria, and any other relevant information that can help in creating story.
    Ask any detailed questions if needed to clarify the requirements before generating user stories.
    Create all the technical stories as well.
    Respond in structured JSON format as follows:
 {
    "epics": [
        {
            "name": "Epic 1...",
            "summary": "...",
            "features": ["...", "..."],
            "userStories": [
                {
                    "title": "Epic 1 - Story 1...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."]
                }
            ],
            "technicalStories": [
                {
                    "title": "...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."]
                }
            ]
        }
    ],
    "questions": [
                "question1 mark with the epic no., story no. example: epic1_story1: question",
                "question2 mark with the epic no., story no. example: epic3_story2: question",
                ...
            ]
}
    `;
}

async function createFollowOnAnswerPrompt(followOnAnswer) {
    return `You are a senior product manager.

Based on the following 
**follow-on answer** 
${followOnAnswer}
and all necessary information available, list down all the possible user stories that can be created from the given context in current chat session per epic.
Include all functional and non-functional requirements / acceptance criteria, and any other relevant information that can help in creating narratives.
Ask any detailed questions if needed to clarify the requirements before generating user stories.
Create all the technical stories as well per epic.
Respond in structured JSON format as follows:
{
    "epics": [
        {
            "name": "...",
            "summary": "...",
            "features": ["...", "..."],
            "userStories": [
                {
                    "title": "...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."]
                }
            ],
            "technicalStories": [
                {
                    "title": "...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."]
                }
            ]
        }
    ],
    "questions": [
                "question1 mark with the epic no., story no. example: epic1_story1 : question",
                "question2 mark with the epic no., story no. example: epic3_story2 : question",
            ]
}
`

}

export async function generateStoryService(session, followOnAnswer) {

    if (followOnAnswer && followOnAnswer !== '') {
        const chat = await getOrCreateChat(session, "OLD"); // Continue with the existing chat session
        const response = await chat.sendMessage({
            message: await createFollowOnAnswerPrompt(followOnAnswer)
        });
        console.log("Follow on answer sent to chat:", response);
        // let interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
        let interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        console.log("original response : " + response.text);
        refinementProgressDetails.set(session, { "epics": interimResponse.epics });
        return ({ message: interimResponse, sessionId: session });
    }
    else {
        const chat = await getOrCreateChat(session, "OLD"); // Continue with the existing chat session
        const response = await chat.sendMessage({
            message: await createPrompt()
        });
        // let interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
        let interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        console.log("original response : " + response.text);
        refinementProgressDetails.set(session, { "epics": interimResponse.epics });
        console.log("Story generation completed")
        return ({ message: interimResponse, sessionId: session });
    }
}