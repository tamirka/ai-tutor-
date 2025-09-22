import React, { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';
import { LessonRecord, QuizRecord } from '../types';

interface DashboardViewProps {
  onBack: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onBack }) => {
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([]);

  useEffect(() => {
    setLessons(progressService.getLessons());
    setQuizzes(progressService.getQuizzes());
  }, []);

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to delete all your progress? This action cannot be undone.')) {
      progressService.clearAllProgress();
      setLessons([]);
      setQuizzes([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={onBack} className="text-blue-500 font-semibold hover:underline">&larr; Back to Subjects</button>
        <h1 className="text-2xl font-bold text-gray-800">My Progress</h1>
        <button 
          onClick={handleClearProgress}
          className="px-3 py-1.5 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear Progress
        </button>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lesson History</h2>
          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800">{lesson.subject} <span className="text-sm font-normal text-gray-500">({lesson.level})</span></p>
                    <span className="text-sm text-gray-500">{formatDate(lesson.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lesson.messageCount} messages</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No lessons completed yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quiz Performance</h2>
          {quizzes.length > 0 ? (
            <div className="space-y-3">
              {quizzes.map((quiz, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                     <p className="font-bold text-gray-800">{quiz.subject} <span className="text-sm font-normal text-gray-500">({quiz.level})</span></p>
                    <span className="text-sm text-gray-500">{formatDate(quiz.date)}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="font-semibold text-lg mr-4">Score: {quiz.score} / {quiz.total}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(quiz.score / quiz.total) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No quizzes completed yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
