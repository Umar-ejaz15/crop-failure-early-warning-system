import { NextRequest, NextResponse } from 'next/server';

// Replace with your Gemini API key and endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function POST(req: NextRequest) {
  try {
    const { cropType, currentStage, responses, weatherData } = await req.json();
    // Compose a prompt for Gemini
    const prompt = `You are an expert agronomist. Given the following:
Crop: ${cropType}
Stage: ${currentStage}
Responses: ${JSON.stringify(responses)}
Weather: ${JSON.stringify(weatherData)}

Give 3 real, actionable suggestions for the farmer in clear English.`;

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { stopSequences: ['\n'], temperature: 0.7, maxOutputTokens: 256 },
      }),
    });
    const geminiData = await geminiRes.json();
    const suggestions = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
