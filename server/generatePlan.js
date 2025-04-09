const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics)) {
    return res.status(400).json({ error: 'Invalid topic data' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze these study topics and provide recommendations:
      ${JSON.stringify(topics, null, 2)}
      
      Return a JSON response with this structure:
      {
        "topics": [{ id, name, confidence, timeSpent, priority }],
        "recommendations": ["recommendation1", "recommendation2", ...],
        "totalHours": number
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResult = response.text();
    
    // Parse the JSON response from Gemini
    const jsonResult = JSON.parse(textResult);

    res.json(jsonResult);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
