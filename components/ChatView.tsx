import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createTutorSession } from '../services/geminiService';
import { progressService } from '../services/progressService';
import { TutorSubject, ChatMessage, LearningLevel, QuizQuestion } from '../types';
import QuizView from './QuizView';

// TypeScript interfaces for Web Speech API
// FIX: Add missing resultIndex property to fix error on line 65.
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
}
// FIX: Add missing onresult property to fix error on line 63.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface ChatViewProps {
  subject: TutorSubject;
  level: LearningLevel;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ subject, level, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    chatSessionRef.current = createTutorSession(subject, level);
    setMessages([{ role: 'model', content: `Hello! I'm your ${subject.name} tutor. What would you like to learn about today?` }]);
  }, [subject, level]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          handleUserMessage(finalTranscript.trim());
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);
  
  useEffect(() => {
    // Save lesson on component unmount
    return () => {
      // Don't save if there's only the initial message
      if (messages.length > 1) {
        progressService.saveLesson({
          subject: subject.name,
          level: level,
          date: new Date().toISOString(),
          messageCount: messages.length,
        });
      }
    };
  }, [messages, subject, level]);

  const speak = (text: string) => {
    // If speaking, cancel previous speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleUserMessage = async (text: string) => {
    if (!text || isResponding) return;
    setIsResponding(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    // Check for quiz request
    if (text.toLowerCase().includes('quiz me')) {
      handleQuizRequest(text);
      return;
    }

    try {
      if (chatSessionRef.current) {
        const stream = await chatSessionRef.current.sendMessageStream({ message: text });
        let fullResponse = '';
        setMessages(prev => [...prev, { role: 'model', content: '' }]);
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: 'model', content: fullResponse };
              return newMessages;
          });
        }
        speak(fullResponse);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
      speak(errorMessage);
    } finally {
      setIsResponding(false);
    }
  };
  
  const handleQuizRequest = async (text: string) => {
    try {
        if (chatSessionRef.current) {
            // Use a non-streaming call for JSON
            const response = await chatSessionRef.current.sendMessage({ message: text });
            const jsonText = response.text.trim();
            const quizData = JSON.parse(jsonText);
            setQuiz(quizData);
        }
    } catch (error) {
        console.error('Failed to parse quiz JSON:', error);
        const errorMessage = "I had trouble creating a quiz. Let's try something else.";
        setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
        speak(errorMessage);
    } finally {
        setIsResponding(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([{ role: 'model', content: `Hello! Let's start over. What would you like to learn about ${subject.name}?` }]);
    }
  };
  
  const handleQuizComplete = (score: number, total: number) => {
    const summary = `Quiz complete! You scored ${score} out of ${total}. Great job!`;
    setQuiz(null);
    setMessages(prev => [...prev, { role: 'system', content: summary }]);
    speak(summary);
    // Save quiz result
    progressService.saveQuiz({
      subject: subject.name,
      level: level,
      date: new Date().toISOString(),
      score,
      total,
    });
  };

  if (quiz) {
      return <QuizView quiz={quiz} subject={subject} onQuizComplete={handleQuizComplete} />;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg">
      <header className={`grid grid-cols-3 items-center p-4 rounded-t-2xl text-white ${subject.primaryColor}`}>
        <button onClick={onBack} className="text-left font-semibold hover:opacity-80 transition-opacity">&larr; Back</button>
        <h2 className="text-2xl font-bold text-center">{subject.name} Tutor</h2>
        <div className="flex justify-end space-x-2">
           <button 
              onClick={() => handleUserMessage("Quiz me on what we've discussed.")}
              disabled={isResponding || messages.length < 2}
              className="px-3 py-1.5 text-sm font-semibold rounded-md bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Quiz Me
           </button>
           <button 
              onClick={handleClearChat}
              disabled={messages.length <= 1}
              className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 disabled:opacity-50"
              aria-label="Clear chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
        </div>
      </header>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl px-4 py-2 rounded-2xl ${msg.role === 'user' ? `${subject.primaryColor} text-white` : 'bg-gray-100 text-gray-800'} ${msg.role === 'system' ? 'w-full text-center bg-yellow-100 text-yellow-800 font-medium' : ''}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <footer className="p-4 border-t border-gray-200 flex items-center justify-center space-x-4">
        {isSpeaking && (
          <button onClick={stopSpeaking} className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold">Stop</button>
        )}
        <button
          onClick={toggleListen}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500' : subject.primaryColor}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10v-2.035A5.002 5.002 0 0018 9V8a1 1 0 10-2 0v1a3 3 0 01-6 0V8a1 1 0 10-2 0v1a5.002 5.002 0 006 4.965V14a1 1 0 102 0z" clipRule="evenodd" />
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default ChatView;