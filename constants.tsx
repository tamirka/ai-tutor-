import React from 'react';
import { TutorSubject, LearningLevel } from './types';

const MathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-8 8m0-8l8 8" />
  </svg>
);

const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GeographyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 15.25a2.5 2.5 0 010-5.5M16.2 15.25a2.5 2.5 0 000-5.5m-8.4 5.5a2.5 2.5 0 000-5.5m8.4 0a2.5 2.5 0 010 5.5M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

const ScienceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.048-.53l-.84-.28a2 2 0 01-1.488-2.618l.28-.84a2 2 0 00-.53-1.048l-.42-.42a2 2 0 00-2.828 0l-.42.42a2 2 0 00-1.048.53l-.84.28a2 2 0 01-2.618-1.488l-.28-.84a2 2 0 00-1.048-.53l-.42-.42a2 2 0 00-2.828 0l-.42.42a2 2 0 00-.53 1.048l-.28.84a2 2 0 01-2.618 1.488l-.84-.28a2 2 0 00-1.048.53l-.42.42a2 2 0 000 2.828l.42.42a2 2 0 00.53 1.048l.28.84a2 2 0 011.488 2.618l-.28.84a2 2 0 00.53 1.048l.42.42a2 2 0 002.828 0l.42-.42a2 2 0 001.048-.53l.84-.28a2 2 0 012.618 1.488l.28.84a2 2 0 001.048.53l.42.42a2 2 0 002.828 0l.42-.42a2 2 0 00.53-1.048l.28-.84a2 2 0 011.488-2.618l.84.28a2 2 0 001.048-.53l.42-.42a2 2 0 000-2.828l-.42-.42z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

const basePrompt = (subject: string, level: LearningLevel, details: string) => `You are a friendly and encouraging ${subject} tutor. Your student is at a ${level} level. Your goal is to help them understand concepts thoroughly.
- Adapt your explanations to be appropriate for a ${level} student. ${details}
- Provide short, clear mini-lessons on topics when asked.
- Encourage a Q&A style interaction. After explaining something, ask if they have any follow-up questions.
- Keep your answers concise and conversational.
- If the user asks for a quiz (e.g., "quiz me"), generate a 3-question multiple-choice quiz based on the conversation so far.
- When generating a quiz, your *entire response* must be a single JSON string, and nothing else. Do not wrap it in markdown or any other text.
- The JSON must be an array of objects, where each object has the following structure: { "question": "...", "choices": ["...", "...", "..."], "answer": "...", "explanation": "..." }.`;


export const SUBJECTS: TutorSubject[] = [
  {
    name: 'Math',
    Icon: MathIcon,
    prompt: (level) => basePrompt('math', level, 'Explain concepts clearly with step-by-step examples.'),
    primaryColor: 'bg-blue-500',
    secondaryColor: 'bg-blue-100',
  },
  {
    name: 'History',
    Icon: HistoryIcon,
    prompt: (level) => basePrompt('history', level, 'Tell compelling stories about historical events and figures to make the past come alive.'),
    primaryColor: 'bg-amber-500',
    secondaryColor: 'bg-amber-100',
  },
  {
    name: 'Geography',
    Icon: GeographyIcon,
    prompt: (level) => basePrompt('geography', level, 'Describe places, cultures, and geographical phenomena with vivid detail.'),
    primaryColor: 'bg-green-500',
    secondaryColor: 'bg-green-100',
  },
  {
    name: 'Science',
    Icon: ScienceIcon,
    prompt: (level) => basePrompt('science', level, 'Explain scientific principles with clear analogies and real-world examples to make complex topics understandable.'),
    primaryColor: 'bg-purple-500',
    secondaryColor: 'bg-purple-100',
  }
];
