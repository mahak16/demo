import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import type { Topic, StudyPlan } from '../../../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function POST(request: Request) {
  try {
    const { topics } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      I have the following study topics with their confidence levels and time spent:
      ${topics.map((t: Topic) => `
        Topic: ${t.name}
        Confidence: ${t.confidence}%
        Time Spent: ${t.timeSpent} hours
      `).join('\n')}

      Based on this information, please:
      1. Analyze each topic and assign a priority (high/medium/low)
      2. Provide 4-5 specific study recommendations
      Format the response as JSON with the following structure:
      {
        "topics": [{ id, name, confidence, timeSpent, priority }],
        "recommendations": ["recommendation1", "recommendation2", ...],
        "totalHours": number
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResult = response.text();
    const jsonResult = JSON.parse(textResult);
    
    return NextResponse.json(jsonResult);
    
  } catch (error) {
    console.error('Error generating study plan:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to generate study plan' },
      { status: 500 }
    );
  }
}