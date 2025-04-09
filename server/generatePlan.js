const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2048,
  }
});

module.exports = async (req, res) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics)) {
    return res.status(400).json({ error: 'Invalid topic data' });
  }

  try {
    const prompt = `Analyze these topics and return ONLY a JSON object (no code blocks or additional text):
    ${JSON.stringify(topics, null, 2)}

    The response must be a valid JSON object with exactly this structure:
    {
      "topics": [{"id": "string", "name": "string", "confidence": number, "timeSpent": number, "priority": "high" | "medium" | "low"}],
      "recommendations": ["string"],
      "totalHours": number
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    if (!result.response) {
      throw new Error('No response from Gemini API');
    }

    const textResult = result.response.text();
    
    // Clean up the response by removing any code block markers or variable declarations
    const cleanedText = textResult
      .replace(/```(?:json)?\s*|\s*```/g, '')  // Remove code block markers
      .replace(/^(?:const|let|var)\s*\{[\s\S]*?\}\s*=\s*/, '')  // Remove variable declarations
      .replace(/^return\s+/, '')  // Remove return statements
      .trim();
    
    try {
      const jsonResult = JSON.parse(cleanedText);
      res.json(jsonResult);
    } catch (parseError) {
      // Use fallback data if parsing fails
      const fallbackData = {
        topics: topics.map(topic => ({
          ...topic,
          priority: topic.confidence < 40 ? 'high' : 
                    topic.confidence < 70 ? 'medium' : 'low'
        })),
        recommendations: [
          "Focus on topics with low confidence scores",
          "Take regular breaks every 45 minutes",
          "Review high-priority topics more frequently",
          "Use active recall techniques for better retention"
        ],
        totalHours: topics.reduce((sum, topic) => sum + topic.timeSpent, 0)
      };
      res.json(fallbackData);
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
