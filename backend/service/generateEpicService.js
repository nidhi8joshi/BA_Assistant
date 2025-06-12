// import { GoogleGenAI } from '@google/genai';
import { v4 } from 'uuid';
import { getOrCreateChat, genAI , refinementProgressDetails} from './initiateChat.js';
// const genAI = new GoogleGenAI({ apiKey: "AIzaSyAIq7WN9y2Pa4jRNbiHMm33hg0xHB682sc" });

// const activeSessionStorage = new Map(); // In-memory storage for active sessions

// async function getOrCreateChat(sessionId, session) {
//     if (session == "OLD") {
//         const chat = await activeSessionStorage.get(sessionId);
//         return chat;
//     } else {
//         // If no session, create a new chat
//         const newSession = genAI.chats.create({
//             model: "gemini-2.5-flash-preview-05-20"
//         })
//         activeSessionStorage.set(sessionId, newSession)
//         return newSession;
//     }
// }

async function createPrompt(deliverables) {
    return `
You are a senior product manager.

Based on the following **mind map** and **deliverables document**, outline the major **product epics**. Each epic should include:
- Epic Name
- Summary (what the epic achieves)
- List of 2–5 possible features that belong to this epic

--- MIND MAP ---
Added in the chat

--- DELIVERABLES ---
${deliverables}

Take all logical assumptions for generating epics / user stories.
Enlist questions below if you have any which can only be answered by the actual user / business analyst before generating Epic from the mind map and deliverables document.
Respond in structured JSON format as follows:

{
  "epics": [
    {
      "name": "Epic 1: ...",
      "summary": "...",
      "features": ["...", "..."]
    }
  ],
  "questions": [
   "question1 mark with the epic no. example: epic1: question",
    "question2 mark with the epic no. example: epic3: question",
    "Additional question outside of any epic, if any"
    ...
]
}
`;
}

// async function recallLLM(questions) {
//     const prompt = `Based on the context you already have, answer below list of questions.
// --- QUESTIONS ---
// ${questions}
// Enlist questions below if you have any before generating Epic from the mind map and deliverables document.
// Respond in structured JSON format as follows:

// {
//   "epics": [
//     {
//       "name": "...",
//       "summary": "...",
//       "features": ["...", "..."]
//     }
//   ],
//   "Question": [
//     "question1" : "question1",
//     "question2" : "question2"
// ]
// }
// `;

//     const result = await genAI.models.generateContent({
//         model: "gemini-2.5-flash-preview-05-20",
//         contents: prompt
//     });
//     return result.text;
// }

async function recallLLM_chat(chat, questions) {
    console.log(questions);

    const prompt = `Based on the context you already have, answer below list of questions.
--- QUESTIONS ---
${questions.toString()}
Enlist questions below if you have any new / follow-on before generating Epic from the mind map and deliverables document.
Respond in structured JSON format as follows:

{
  "Answer to mentioned questions": "...",
  "epics": [
    {
      "name": "Epic 1: ...",
      "summary": "...",
      "features": ["...", "..."]
    }
  ],
  "questions": [
   "question1 mark with the epic no. example: epic1: question",
    "question2 mark with the epic no. example: epic3: question",
    "Additional question outside of any epic, if any"
    ...
]
}
`;
    const response = await chat.sendMessage({
        message: prompt
    });
    // const finalJson = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
    const finalJson = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
    return finalJson;
}

async function createPromptFollowOnAnswer(followOnAnswer) {
    return `
You are a senior product manager.

Based on the following 
**follow-on answer** 
${followOnAnswer}
generate Epic list in JSON format.
Respond in structured JSON format as follows:
Enlist questions below if you have any new / follow-on before generating Epic from the mind map and deliverables document.
{
  "epics": [
    {
      "name": "Epic 1: ...",
      "summary": "...",
      "features": ["...", "..."]
    }
  ],
  "questions": [
   "question1 mark with the epic no. example: epic1: question",
    "question2 mark with the epic no. example: epic3: question",
    "Additional question outside of any epic, if any"
    ...
]
}`
}


async function analyzeResponse(interimResponse, chat, sessionId, flag, count) {
    console.log("Response iteration : " + count);
    if (Object.entries(interimResponse.questions).length > 0 && count == 1) {
        console.log("Ask questions directly to users");
        return interimResponse;
    }
    else if (Object.entries(interimResponse.questions).length == 0) {
        console.log("No Questions");
        return interimResponse;
    } else {
        count++;
        console.log("started next Iteration");
        return await recallLLM_chat(chat, interimResponse.questions).then(async (midResponse) => {
            console.log("Response iteration : " + count);
            return await analyzeResponse(midResponse, chat, sessionId, flag, count);
        });
    }
}

// export async function generateEpicService(deliverable, mindmapfile) {

//     const prompt = createPrompt(deliverable);

//     // const uploadResult = await genAI.uploadFile({
//     //     filePath: mindmapfilePath,
//     //     mimeType: 'application/pdf',
//     // });
//     // const mindmapFile = uploadResult.file;
//     const result = await genAI.models.generateContent({
//         inlineData: {
//             mimeType: 'application/png',
//             data: mindmapfile,
//         },
//         model: "gemini-2.5-flash-preview-05-20",
//         contents: prompt
//     });
//     console.log(result.text);
//     const finalJson = JSON.parse(result.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
//     let flag = true;
//     let count = 0;
//     while (flag && count < 3) {

//         if (finalJson.Question.length = 0) {
//             flag = false;
//         }
//         else {
//             console.log("Response iteration : " + count + "\n" + finalJson);
//             await recallLLM(finalJson.Question);
//             count++;
//         }
//     }
//     return { message: finalJson };

// }
export async function generateEpicService(deliverable, mindmapfilePath, session, followOnAnswer) {

    if (session == "NEW") {
        const sessionId = v4();
        const chat = await getOrCreateChat(sessionId, session); // Create a new chat session

        let prompt = await createPrompt(deliverable);
        const file = await genAI.files.upload({ file: mindmapfilePath, config: { mimeType: 'application/png' } }); // Upload the mindmap file


        let response = await chat.sendMessage({
            message: prompt
        });
        let interimResponse = '';
        try {
            // interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
            interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        }
        catch (error) {
            console.error("Error parsing response: ", error);
            response = await chat.sendMessage({
                message: prompt
            });
            // interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('\n', '').replaceAll('json', '').replaceAll('`', '').replaceAll('\'', ''));
            interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        }
        console.log("original response : " + response.text);

        return await analyzeResponse(interimResponse, chat, sessionId, true, 0).then(async (finalResponse) => {
            refinementProgressDetails.set(sessionId, {"epics": finalResponse.epics});
            return ({ message: finalResponse, sessionId: sessionId });

        });

    }
    else {
        const chat = await getOrCreateChat(session, "OLD"); // Continue with the existing chat session
        const response = await chat.sendMessage({
            message: await createPromptFollowOnAnswer(followOnAnswer)
        });

        // let interimResponse = JSON.parse(response.text.replaceAll('\\', '').replaceAll('json', '').replaceAll('`', ''));
        // let interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        let interimResponse = JSON.parse(response.text.replaceAll('```json','').replaceAll('```',''));
        console.log("original response : " + response.text);
        return await analyzeResponse(interimResponse, chat, session, true, 0).then(async (finalResponse) => {
            refinementProgressDetails.set(session, {"epics": finalResponse.epics});
            return ({ message: finalResponse, sessionId: session });

        });
    }


}


export async function getEpicListForSession(sessionId) {
    if (!refinementProgressDetails.has(sessionId)) {
        return null; // No epics found for this session
    }
    const epicDetails = refinementProgressDetails.get(sessionId);
    if (!epicDetails || !epicDetails.epics) {
        return null; // No epics found for this session
    }
    return epicDetails;
}

// Not being used
export async function sample(uuid) {
    if (!uuid) {
        const sessionId = v4();
        const chat = await getOrCreateChat(sessionId, "NEW"); // Create a new chat session
        const response = await chat.sendMessage({
            message: "Hello, this is a test message."
        });

        console.log("history----1st-----------------" + sessionId)
        chat.getHistory().forEach(message => {
            console.log(`${message.role}: ${message.parts[0].text}`);
        });
        return ({ message: sessionId });
    }
    else {
        const oldchat = await getOrCreateChat(uuid, "OLD");
        const response2 = await oldchat.sendMessage({
            message: "second message added"
        });
        console.log("history----2nd-----------------" + uuid)

        console.log(oldchat.getHistory().forEach(message => {
            console.log("------");
            console.log(`${message.role}: ${message.parts[0].text}`);
        }
        ));
        return ({ message: uuid + "second round" });
    }
}