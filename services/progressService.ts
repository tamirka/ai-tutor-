import { LessonRecord, QuizRecord } from '../types';

const LESSONS_KEY = 'ai_tutor_lessons';
const QUIZZES_KEY = 'ai_tutor_quizzes';

export const progressService = {
  getLessons: (): LessonRecord[] => {
    try {
      const lessonsJson = localStorage.getItem(LESSONS_KEY);
      return lessonsJson ? JSON.parse(lessonsJson) : [];
    } catch (error) {
      console.error("Error parsing lessons from localStorage", error);
      return [];
    }
  },

  saveLesson: (lesson: LessonRecord) => {
    const lessons = progressService.getLessons();
    lessons.unshift(lesson); // Add to the beginning
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  },

  getQuizzes: (): QuizRecord[] => {
    try {
      const quizzesJson = localStorage.getItem(QUIZZES_KEY);
      return quizzesJson ? JSON.parse(quizzesJson) : [];
    } catch (error) {
      console.error("Error parsing quizzes from localStorage", error);
      return [];
    }
  },

  saveQuiz: (quiz: QuizRecord) => {
    const quizzes = progressService.getQuizzes();
    quizzes.unshift(quiz); // Add to the beginning
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  },

  clearAllProgress: () => {
    localStorage.removeItem(LESSONS_KEY);
    localStorage.removeItem(QUIZZES_KEY);
  },
};
