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

    // Add safety settings
    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    if (!result.response) {
      throw new Error('No response from Gemini API');
    }

    const textResult = result.response.text();
    const jsonResult = JSON.parse(textResult);

    res.json(jsonResult);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: err.message 
    });
  }
};
