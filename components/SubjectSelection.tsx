import React from 'react';
import { TutorSubject, LearningLevel } from '../types';

interface SubjectSelectionProps {
  subjects: TutorSubject[];
  onSelectSubject: (subject: TutorSubject) => void;
  onShowDashboard: () => void;
  learningLevel: LearningLevel;
  setLearningLevel: (level: LearningLevel) => void;
}

const SubjectSelection: React.FC<SubjectSelectionProps> = ({ subjects, onSelectSubject, onShowDashboard, learningLevel, setLearningLevel }) => {
  const levels = Object.values(LearningLevel);

  return (
    <div className="flex flex-col h-full p-8 bg-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Choose a Subject</h1>
        <button 
          onClick={onShowDashboard}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          My Progress
        </button>
      </header>
      
      <div className="mb-8">
        <p className="text-lg text-gray-600 mb-3 font-medium">Select your learning level:</p>
        <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-lg">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setLearningLevel(level)}
              className={`w-full px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 ${learningLevel === level ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-500 hover:bg-white/50'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {subjects.map(subject => (
          <button
            key={subject.name}
            onClick={() => onSelectSubject(subject)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl text-white transition-transform transform hover:scale-105 ${subject.primaryColor}`}
          >
            <subject.Icon className="h-16 w-16 mb-4" />
            <span className="text-2xl font-bold">{subject.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection;
