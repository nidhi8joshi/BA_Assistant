// server.js
import express, { json } from 'express';
import cors from 'cors';
import formidable from 'formidable';
import { mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';

// --- Gemini specific imports ---
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
// For agent creation, you can often still use createReactAgent or createOpenAIToolsAgent
// as LangChain abstracts the LLM provider for these agent types.
import { AgentExecutor, createReactAgent } from 'langchain/agents';
// import { pull } from 'langchain/hub';
import { DynamicTool } from '@langchain/core/tools';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const uploadDir = join(__dirname, 'uploads');
mkdir(uploadDir, { recursive: true }).catch(console.error);

// --- 1. Initialize LLM (Gemini specific) ---
// Note: Gemini models might not have a direct 'temperature' param in all LangChain integrations,
// but you can often pass model-specific config. Here, we use GoogleGenerativeAI.
const llm = new GoogleGenAI({
  modelName: "gemini-2.0-flash", // Or "gemini-1.5-pro", etc. (Check available models)
  apiKey: "AIzaSyAb7wYHGIk9HS67aOMtO0N4mdASiYs07zM", // Ensure this is in your .env
  temperature: 0.1, // Set creativity level
  maxOutputTokens: 2048, // Important for longer responses
});

// --- 2. Define Tools for the Agent ---
const tools = [
  new DynamicTool({
    name: "read_document_content",
    description: "Reads the content of a document from a given file path. Input should be the full file path.",
    func: async (filePath) => {
      try {
        const content = await readFile(filePath, 'utf8');
        return content;
      } catch (error) {
        return `Error reading file at ${filePath}: ${error.message}`;
      }
    },
  }),
  // Add other tools as needed, e.g., external API calls, database lookups
];

// --- 3. Define the Prompt Template ---
// This template is LLM-agnostic, focusing on the task instructions.
const FEAT_EVAL_TEMPLATE = `
You are an expert Software Requirements Engineer and a highly skilled Gherkin syntax validator.
Your task is to evaluate and enhance a given feature file or requirement document.

**Evaluation Criteria:**
-   **Clarity:** Is the language precise and unambiguous? Are there any vague terms?
-   **Completeness:** Are all necessary details present (e.g., actors, actions, expected outcomes, edge cases)?
-   **Consistency:** Does it align with common software development practices and patterns?
-   **Testability:** Can clear and concise test cases be derived from this requirement?
-   **Gherkin Syntax (if applicable):** Is the 'Given-When-Then' structure correctly applied? Are keywords used appropriately?
-   **Conciseness:** Can any parts be simplified without losing meaning?

**Task:**
1.  **Analyze the provided "Requirement Document Content".**
2.  **Provide a "Summary of Evaluation"**: A concise overview of the document's quality based on the criteria above.
3.  **List "Identified Issues"**: For each issue, clearly state:
    * The issue type (e.g., "Ambiguity", "Incompleteness", "Syntax Error").
    * The specific problematic text or section.
    * A brief explanation of why it's an issue.
    * A suggestion for improvement.
4.  **Provide an "Enhanced Document"**: A revised version of the original document incorporating your suggestions, improving clarity, completeness, and adherence to best practices/Gherkin syntax. The enhanced document should be the full, corrected version.

**Output Format (MUST BE MARKDOWN):**
Your response must be structured using Markdown. Use headings, bullet points, and code blocks for clarity.
Ensure the "Enhanced Document" is provided as a complete, ready-to-use block of text, ideally within a Markdown code block if it's a feature file.

---
**Requirement Document Content to Evaluate:**
{document_content}
---
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", FEAT_EVAL_TEMPLATE],
  new MessagesPlaceholder("chat_history"), // For conversational memory (optional here)
  ["human", "{input}"], // User's message to trigger the agent
  new MessagesPlaceholder("agent_scratchpad"), // For agent's internal thoughts/tool use
]);

// --- 4. Create the Agent ---
// Using createReactAgent is a good general-purpose agent type.
// For Gemini, you might specifically use `createToolsAgent` if you want to use
// Gemini's native function calling capabilities more directly, but ReAct is also effective.
const agent = await createReactAgent({
  llm,
  tools,
  prompt,
});

// --- 5. Create the Agent Executor ---
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true, // See agent's thought process in console
  maxIterations: 15, // Increase iterations if tasks are complex
  earlyStoppingMethod: "force", // Force stops if maxIterations reached
});


// --- API Endpoint for Document Evaluation ---
app.post('/api/evaluateStory', async (req, res) => {
    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Formidable parse error:', err);
            return res.status(500).json({ error: 'Failed to parse form data.' });
        }

        const documentFile = files.file ? files.file[0] : null;
        const directTextInput = Array.isArray(fields.directInput) ? fields.directInput[0] : fields.directInput;

        let documentContent = '';
        let originalFilePath = '';

        if (documentFile && documentFile.filepath) {
            originalFilePath = documentFile.filepath;
            try {
                // Use the read_document_content tool to get the content
                documentContent = await tools[0].func(originalFilePath);
            } catch (readErr) {
                console.error('Error reading uploaded file:', readErr);
                await unlink(originalFilePath).catch(console.error);
                return res.status(500).json({ error: 'Failed to read content of the uploaded document.' });
            }
        } else if (directTextInput && typeof directTextInput === 'string') {
            documentContent = directTextInput;
        } else {
            return res.status(400).json({ error: 'No document file uploaded or text provided.' });
        }

        if (!documentContent.trim()) {
            return res.status(400).json({ error: 'Document content is empty.' });
        }

        try {
            console.log('Evaluating document with content length:', documentContent.length);

            // The agent's 'input' should be the actual request, the document_content is a template variable
            // Ensure the input clearly states the task to the agent given the system prompt.
            const agentInput = `Please carefully evaluate the provided requirement document based on the detailed criteria in your system prompt. Generate a "Summary of Evaluation", "Identified Issues" with suggestions, and an "Enhanced Document" following the exact Markdown format specified.`;

            const result = await agentExecutor.invoke({
                input: agentInput,
                document_content: documentContent, // Pass the content to the template
                chat_history: [], // For a fresh evaluation each time
            });

            if (originalFilePath) {
                await unlink(originalFilePath).catch(console.error);
            }

            res.json({ evaluationReport: result.output });

        } catch (error) {
            console.error('Error during agent evaluation:', error);
            if (originalFilePath) {
                await unlink(originalFilePath).catch(console.error);
            }
            res.status(500).json({ error: 'Failed to evaluate document. ' + error.message });
        }
    });
});

app.listen(port, () => {
  console.log(`Backend server for LLM Agent listening at http://localhost:${port}`);
});