import React from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export enum LearningLevel {
    MiddleSchool = "Middle School",
    HighSchool = "High School",
    University = "University",
}

export interface TutorSubject {
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  prompt: (level: LearningLevel) => string;
  primaryColor: string;
  secondaryColor: string;
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export interface LessonRecord {
  subject: string;
  level: LearningLevel;
  date: string;
  messageCount: number;
}

export interface QuizRecord {
  subject: string;
  level: LearningLevel;
  date: string;
  score: number;
  total: number;
}