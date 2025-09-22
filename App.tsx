import React, { useState } from 'react';
import SubjectSelection from './components/SubjectSelection';
import ChatView from './components/ChatView';
import DashboardView from './components/DashboardView';
import { TutorSubject, LearningLevel } from './types';
import { SUBJECTS } from './constants';

type View = 'subjects' | 'chat' | 'dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<TutorSubject | null>(null);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(LearningLevel.HighSchool);

  const handleSelectSubject = (subject: TutorSubject) => {
    setSelectedSubject(subject);
    setCurrentView('chat');
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setCurrentView('subjects');
  };
  
  const handleShowDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        if (selectedSubject) {
          return <ChatView subject={selectedSubject} level={learningLevel} onBack={handleBackToSubjects} />;
        }
        // Fallback to subjects if no subject is selected
        setCurrentView('subjects');
        return null;
      case 'dashboard':
        return <DashboardView onBack={handleBackToSubjects} />;
      case 'subjects':
      default:
        return (
          <SubjectSelection
            subjects={SUBJECTS}
            onSelectSubject={handleSelectSubject}
            onShowDashboard={handleShowDashboard}
            learningLevel={learningLevel}
            setLearningLevel={setLearningLevel}
          />
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-4xl h-[90vh] max-h-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
