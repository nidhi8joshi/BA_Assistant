import { getOrCreateChat, genAI, refinementProgressDetails } from './initiateChat.js';
// Define your evaluation metrics and weightage
const evaluationCriteria = [
  { metric: 'Clarity', weight: 0.3 },
  { metric: 'Completeness', weight: 0.25 },
  { metric: 'Testability', weight: 0.2 },
  { metric: 'Ambiguity', weight: 0.15 },
  { metric: 'Feasibility', weight: 0.1 },
];

async function createPrompt() {

    const metricsList = evaluationCriteria.map(m => `- ${m.metric} (Weight: ${m.weight})`).join('\n');
    return `You are a senior product manager. Based on epic and story list generated on this session and all necessary information available, list down all the possible scenarios in spec by example gherkin format that can be created from the given context in current chat session per user story and technical story.
    Include all functional and non-functional requirements / acceptance criteria, and any other relevant information that can help in creating narratives.
    Ask any detailed questions if needed to clarify the requirements before generating Narratives.
    Create all the technical stories narrative as well.
    Make sure that narratives generated should score 100% in below criteria:
    Evaluation Metrics and Weightage:
    ${metricsList}
    Respond in structured JSON format as follows:
 {
    "epics": [
        {
            "name": "Epic 1 ...",
            "summary": "...",
            "features": ["...", "..."],
            "userStories": [
                {
                    "title": "Epic 1 - Story 1...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."],
                    "narratives": "Scenarios in spec by example gherkin format. Make sure to add examples sections under scenario."
                }
            ],
            "technicalStories": [
                {
                    "title": "Epic 1 - Technical Story 1...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."],
                    "narratives": "Scenarios in spec by example gherkin format. Make sure to add examples sections under scenario."
                }
            ]
        }
    ],
    "questions": [
                "question1 mark with the epic no., story no. and narrative no. example: epic1_story1_narrative1: question",
                "question2 mark with the epic no., story no. and narrative no. example: epic3_story2_narrative1: question",
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
                    "acceptanceCriteria": ["...", "..."],
                    "narratives": "Scenarios in spec by example gherkin format"
                }
            ],
            "technicalStories": [
                {
                    "title": "...",
                    "description": "...",
                    "acceptanceCriteria": ["...", "..."],
                    "narratives": "Scenarios in spec by example gherkin format"
                }
            ]
        }
    ],
    "questions": [
               "question1 mark with the epic no., story no. and narrative no. example: epic1_story1_narrative1: question",
                "question2 mark with the epic no., story no. and narrative no. example: epic3_story2_narrative1: question",
            ]
}
`    
}

export async function generateNarrativeService(session, followOnAnswer) {

if (followOnAnswer && followOnAnswer !== '') {
        const chat = await getOrCreateChat(session, "OLD"); // Continue with the existing chat session
        const response = await chat.sendMessage({
            message: await createFollowOnAnswerPrompt(followOnAnswer)
        });
        console.log("Follow on answer sent to chat:", response);
        //  let interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
         let interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        console.log("original response : " + response.text);
        refinementProgressDetails.set(session, { "epics": interimResponse.epics }); 
        return ({message : interimResponse, sessionId: session}); 
    }
    else {
        const chat = await getOrCreateChat(session, "OLD"); // Continue with the existing chat session
        const response = await chat.sendMessage({
            message: await createPrompt()
        });
        //  let interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
         let interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        console.log("original response : " + response.text);
        refinementProgressDetails.set(session, { "epics": interimResponse.epics });
        console.log("Narratives completed")
         return ({message : interimResponse, sessionId: session}); 
    }


}