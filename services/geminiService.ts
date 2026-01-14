import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BBH_SYSTEM_PROMPT } from "../constants";
import { GeneratedSoapResponse } from "../types";

// Define the schema for the output
const soapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hospital: { type: Type.STRING },
    patient_summary: { type: Type.STRING },
    soap_details: {
      type: Type.OBJECT,
      properties: {
        subjective: { type: Type.STRING, description: "Detailed HPI and symptoms extracted from transcript." },
        objective: { type: Type.STRING, description: "Vitals and exam findings extracted from transcript." },
        assessment: { type: Type.STRING, description: "ALWAYS return an empty string." },
        plan: { type: Type.STRING, description: "ALWAYS return an empty string." },
      },
      required: ["subjective", "objective", "assessment", "plan"],
    },
    raw_transcript_reference: { type: Type.STRING },
  },
  required: ["hospital", "patient_summary", "soap_details", "raw_transcript_reference"],
};

export const generateSoapNote = async (transcript: string, selectedLanguage: string): Promise<GeneratedSoapResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Here is the Raw Transcript (Language context: ${selectedLanguage}):\n\n${transcript}` }],
        },
      ],
      config: {
        systemInstruction: BBH_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: soapSchema,
        temperature: 0.1, // Low temperature for clinical accuracy
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini.");
    }

    const data = JSON.parse(text) as GeneratedSoapResponse;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};