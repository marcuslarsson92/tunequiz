'use client';

import React, { createContext, useContext, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

/**
 * 1) Define the shape of your quiz data. 
 *    Adjust this to match your actual quiz structure.
 */
interface Question {
  artist: string;
  questionText: string;
  options: string[];
  correctOption: string;
}
interface QuizData {
  questions: Question[];
  summary: string;
}

/**
 * 2) Define a context type that includes both
 *    the quiz data and a setter function.
 */
interface QuizContextType {
  quizData: QuizData | null;                 
  setQuizData: React.Dispatch<React.SetStateAction<QuizData | null>>;
}

// 3) Create the QuizContext with default “empty” values
const QuizContext = createContext<QuizContextType>({
  quizData: null,
  setQuizData: () => {},
});

/**
 * 4) The QuizProvider is where we hold quiz data in state.
 *    We'll wrap this around our entire app in Providers().
 */
function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  );
}

/**
 * 5) A handy hook for any component to access the quiz context
 */
export function useQuiz() {
  return useContext(QuizContext);
}

/**
 * 6) The existing Providers component now wraps SessionProvider
 *    AND our new QuizProvider, so both are accessible throughout the app.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QuizProvider>
        {children}
      </QuizProvider>
    </SessionProvider>
  );
}
