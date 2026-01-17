import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, apiKey } = body;

        // Use provided API key or fallback to server env (optional)
        const finalApiKey = apiKey || process.env.GOOGLE_API_KEY;

        if (!finalApiKey) {
            return NextResponse.json(
                { error: 'API Key is missing. Please configure it in settings.' },
                { status: 401 }
            );
        }

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(finalApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
