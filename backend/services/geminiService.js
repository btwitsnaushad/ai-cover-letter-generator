import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure API Key exists before initializing
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ CRITICAL ERROR: GEMINI_API_KEY is missing in your .env file!');
    process.exit(1);
}

// Initializing the latest Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateCoverLetterService = async (prompt) => {
    try {
        // Using the industry-standard highly efficient model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (!response || !response.text) {
            throw new Error('Invalid or empty response structure received from Gemini API.');
        }

        return response.text;

    } catch (error) {
        console.error('📡 Gemini Core Service Error:', error.message);
        throw new Error(`Gemini API Failed: ${error.message}`);
    }
};