import { GoogleGenAI } from '@google/genai';
 const genAI = new GoogleGenAI({ apiKey: "AIzaSyAb7wYHGIk9HS67aOMtO0N4mdASiYs07zM" });
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });


// Define your evaluation metrics and weightage
const evaluationCriteria = [
  { metric: 'Clarity', weight: 0.3 },
  { metric: 'Completeness', weight: 0.25 },
  { metric: 'Testability', weight: 0.2 },
  { metric: 'Ambiguity', weight: 0.15 },
  { metric: 'Feasibility', weight: 0.1 },
];


function createPrompt(requirement) {
const metricsList = evaluationCriteria.map(m => `- ${m.metric} (Weight: ${m.weight})`).join('\n');
  return `
You are a requirements analyst. Evaluate the following software requirement on a scale of 0 to 10 for each of the defined metrics. Provide a score and a short justification for each along with suggestions to improve the score.

Requirement:
"${requirement}"

Evaluation Metrics and Weightage:
${metricsList}

Respond in the following format:
Metric: <name>
Score: <0-10>
Justification: <one-liner reason>
Suggested changes: <any changes to improve the score>

... (repeat for each metric)

At the end, calculate the weighted average score based on the provided weights.
Final Weighted Score: <calculated score out of 10>
Summary: <1-2 sentence summary of the requirement quality>
Give this in tabular format with the following columns: Metric, Score, Justification, Suggested changes.
`;
}

export async function evaluateStoryFromLLM(requirement) {
  const prompt = createPrompt(requirement);
  const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      console.log(result.text)
  // const raw = result.text();

//   const jsonMatch = raw.match(/\[.*\]/s);
//   if (!jsonMatch) throw new Error('Failed to extract epics JSON');
//   return { epics: JSON.parse(jsonMatch[0]) };
return {message : result.text};
}
