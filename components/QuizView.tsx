import React, { useState } from 'react';
import { QuizQuestion, TutorSubject } from '../types';

interface QuizViewProps {
  quiz: QuizQuestion[];
  subject: TutorSubject;
  onQuizComplete: (score: number, total: number) => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const QuizView: React.FC<QuizViewProps> = ({ quiz, subject, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.length;

  const handleSelectChoice = (choice: string) => {
    if (isAnswered) return;
    setSelectedChoice(choice);
    const isCorrect = choice === currentQuestion.answer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedChoice(null);
    setCurrentQuestionIndex(i => i + 1);
  };
  
  const getChoiceStyle = (choice: string) => {
      if (!isAnswered) {
          return `bg-white hover:${subject.secondaryColor} border-gray-300`;
      }
      if (choice === currentQuestion.answer) {
          return 'bg-green-100 border-green-500 text-green-800 font-semibold';
      }
      if (choice === selectedChoice) {
          return 'bg-red-100 border-red-500 text-red-800';
      }
      return 'bg-gray-100 border-gray-300 opacity-60';
  }

  if (isQuizFinished) {
    return (
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg p-8 items-center justify-center text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
        <p className={`text-2xl font-medium mb-2 ${subject.primaryColor.replace('bg-', 'text-')}`}>
            You scored {score} out of {quiz.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 my-4">
            <div 
                className={`${subject.primaryColor} h-4 rounded-full`}
                style={{ width: `${(score / quiz.length) * 100}%` }}
            ></div>
        </div>
        <button
          onClick={() => onQuizComplete(score, quiz.length)}
          className={`mt-6 px-8 py-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 ${subject.primaryColor}`}
        >
          Back to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg">
      <header className={`flex items-center justify-between p-4 rounded-t-2xl text-white ${subject.primaryColor}`}>
        <h2 className="text-2xl font-bold">{subject.name} Quiz</h2>
        <div className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {quiz.length} | Score: {score}
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto">
        <p className="text-2xl font-semibold text-gray-800 mb-8">{currentQuestion.question}</p>
        <div className="space-y-4">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleSelectChoice(choice)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border text-lg transition-all duration-200 ${getChoiceStyle(choice)}`}
            >
              {choice}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`mt-8 p-4 rounded-lg ${selectedChoice === currentQuestion.answer ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} border`}>
            {selectedChoice === currentQuestion.answer ? (
                <div className="flex items-center text-green-700">
                    <CheckIcon />
                    <h3 className="text-xl font-bold">Correct!</h3>
                </div>
            ) : (
                <div className="flex items-center text-red-700">
                    <XIcon />
                    <h3 className="text-xl font-bold">Not quite!</h3>
                </div>
            )}
            <p className="mt-2 text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        {isAnswered && (
             <button
                onClick={handleNextQuestion}
                className={`w-full p-4 rounded-xl text-white font-semibold transition-transform transform hover:scale-105 ${subject.primaryColor}`}
            >
                {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;
