const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const busboy = require('busboy');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const app = express();
const PORT = 5000;
// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.static('uploads')); // to serve uploaded files

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.post('/upload', (req, res) => {

  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadedFile = req.files.file;
  const filePath = path.join(uploadDir, Date.now() + '-' + uploadedFile.name);

  uploadedFile.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'File upload failed' });
    }

    res.status(200).json({
      message: 'File uploaded successfully sample message added',
      filePath: `/uploads/${path.basename(filePath)}`
    });
  });
});

// Routes get score from GPT
app.post('/getScore', async (req, res) => {
  let fileContent = '';
  const uploadedFile = req.files.file;
  const filePath = path.join(uploadDir, Date.now() + '-' + uploadedFile.name);

  uploadedFile.mv(filePath, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'File upload failed' });
    }

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'File read failed' });
      }
      fileContent = data;
      console.log('File content:', fileContent);
      // const message = 'Act as a seasoned product Owner / Business Analyst to review and evaluate the feature file by Bysiness analyst team members on below metrics:'
      //   + 'Metric	Explanation	Weightage'
      //   + 'Scenario Coverage	Assesses whether all possible scenarios, including edge cases, are covered. Ensures comprehensive addressing of user stories and bsusiness requirement.	20%'
      //   + 'Clarity and Readability	Scenarios should be written in clear, understandable language, easy to read and interpret by all stakeholders, including non-technical team members.	15%'
      //   + 'Consistency	Maintains consistent terminology and structure across all scenarios, including consistent use of Given-When-Then syntax and terminology.	15%'
      //   + 'Testability	Scenarios should be easily translatable into automated tests with clear acceptance criteria that can be objectively tested.	15%'
      //   + 'Relevance and Prioritization	Scenarios should be relevant to business objectives and prioritised based on importance and impact, ensuring critical scenarios are addressed first.	10%'
      //   + 'Traceability	Each scenario should be traceable back to specific user stories or business requirements, ensuring alignment with stakeholder needs.	10%'
      //   + 'Edge Case Handling	Includes scenarios that address potential edge cases and exceptions, ensuring robustness and reliability if the system	10%'
      //   + 'Stakeholder Review and Approval	Feature file should have evidence of review and approval by relevant stakeholder, ensuring alignment with stakeholder expectations and requirements	5%'

      //   + 'Based on these metrics review below feature file provided and rate the same.'
      //   + 'Mention the score in tabular format and in consolidated view. Re-Write feature files marking the additional scenarios to achieve 100%.'
      //   + 'Feature File:'
      //   + fileContent
      //   + 'End of Feature File'
      //   ;

      const message = 'Act as a seasoned product Owner / Business Analyst to review and evaluate the feature file by Bysiness analyst team members on below metrics:'
        + 'Metric	Explanation	Weightage'
        + 'Scenario Coverage	Assesses whether all possible scenarios, including edge cases, are covered. Ensures comprehensive addressing of user stories and bsusiness requirement.	20%'
        + 'Clarity and Readability	Scenarios should be written in clear, understandable language, easy to read and interpret by all stakeholders, including non-technical team members.	15%'
        + 'Consistency	Maintains consistent terminology and structure across all scenarios, including consistent use of Given-When-Then syntax and terminology.	15%'
        + 'Testability	Scenarios should be easily translatable into automated tests with clear acceptance criteria that can be objectively tested.	15%'
        + 'Relevance and Prioritization	Scenarios should be relevant to business objectives and prioritised based on importance and impact, ensuring critical scenarios are addressed first.	10%'
        + 'Traceability	Each scenario should be traceable back to specific user stories or business requirements, ensuring alignment with stakeholder needs.	10%'
        + 'Edge Case Handling	Includes scenarios that address potential edge cases and exceptions, ensuring robustness and reliability if the system	10%'
        + 'Stakeholder Review and Approval	Feature file should have evidence of review and approval by relevant stakeholder, ensuring alignment with stakeholder expectations and requirements	5%'
        + 'Based on these metrics review below feature file provided and rate the same.'
        + 'Give only 1 one score output in format:'
        + 'Final score: 90%'
        + 'Metric 1 : 70%'
        + 'Metric 2 : 60%'
        + 'Metric 3 : 70%'
        + 'Metric 4 : 90%'
        + 'Feature File:'
        + fileContent
        + 'End of Feature File'
        ;

      // console.log(message);


      const ai = new GoogleGenAI({ apiKey: "AIzaSyAb7wYHGIk9HS67aOMtO0N4mdASiYs07zM" });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: message,
      });

      // const scoreresponse = await ai.models.generateContent({
      //   model: "gemini-2.0-flash",
      //   contents: fileContent,
      // });
      res.status(200).json({ message: response.text })
    });
  });




});


// Define your evaluation metrics and weightage
const evaluationCriteria = [
  { metric: 'Clarity', weight: 0.3 },
  { metric: 'Completeness', weight: 0.25 },
  { metric: 'Testability', weight: 0.2 },
  { metric: 'Ambiguity', weight: 0.15 },
  { metric: 'Feasibility', weight: 0.1 },
];

async function generatePrompt(requirement) {
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
`;
}
 function parseEvaluation(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const result = { metrics: [], finalScore: null, summary: '' };
  
    let currentMetric = {};
  
    for (const line of lines) {
      if (line.startsWith('Metric:')) {
        if (currentMetric.metric) result.metrics.push(currentMetric);
        currentMetric = { metric: line.replace('Metric:', '').trim() };
      } else if (line.startsWith('Score:')) {
        currentMetric.score = parseFloat(line.replace('Score:', '').trim());
      } else if (line.startsWith('Justification:')) {
        currentMetric.justification = line.replace('Justification:', '').trim();
      } else if (line.startsWith('Final Weighted Score:')) {
        result.finalScore = parseFloat(line.replace('Final Weighted Score:', '').trim());
      } else if (line.startsWith('Summary:')) {
        result.summary = line.replace('Summary:', '').trim();
      }
    }
  
    // Push last metric if not already added
    if (currentMetric.metric) result.metrics.push(currentMetric);
  
    return result;
  }
  

// New Route
app.post('/evaluate', async (req, res) => {

  const uploadedFile = req.files.file;
  const filePath = path.join(uploadDir, Date.now() + '-' + uploadedFile.name);

  uploadedFile.mv(filePath, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'File upload failed' });
    }

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'File read failed' });
      }
      requirement = data;
      console.log('File content:', requirement);
      if (!requirement) {
        console.log("400 error")
        return res.status(400).json({ message: 'No requirement provided' });
      }
      try {
        const ai = new GoogleGenAI({ apiKey: "AIzaSyAb7wYHGIk9HS67aOMtO0N4mdASiYs07zM" });
        const prompt = await  generatePrompt(requirement);
        console.log("prompt generated")

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        console.log("response received \n " + response.text)
        //  const parsedEvaluation = parseEvaluation(response.text);
        res.json({ message: parseEvaluation(response.text) });

        res.status(200);
      } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ error: 'Evaluation failed.' });
      }
    })

  })
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
