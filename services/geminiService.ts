import { GoogleGenAI, Chat } from "@google/genai";
import { TutorSubject, LearningLevel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function createTutorSession(subject: TutorSubject, level: LearningLevel): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: subject.prompt(level),
    },
  });
  return chat;
}