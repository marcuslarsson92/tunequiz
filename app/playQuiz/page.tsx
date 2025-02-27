// app/playQuiz/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define TypeScript interfaces for the quiz data
interface Question {
  questionText: string;
  options: string[];
  correctOption: string;
}

interface QuizData {
  questions: Question[];
  summary: string;
}

export default function PlayQuiz() {
  // Retrieve the quizData from the URL search parameters
  const searchParams = useSearchParams();
  const quizDataParam = searchParams.get('quizData') || '';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const router = useRouter();

  // Parse the quizData once on component mount
  useEffect(() => {
    try {
      const parsedData: QuizData = JSON.parse(quizDataParam);
      setQuizData(parsedData);
    } catch (e) {
      console.error('Failed to parse quizData:', e);
    }
  }, [quizDataParam]);

  const totalQuestions = quizData?.questions?.length || 0;

  // Hide the correct answer whenever the question changes
  useEffect(() => {
    setShowCorrectAnswer(false);
  }, [currentQuestionIndex]);

  // Navigate to the next question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => {
      if (prev < totalQuestions - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  // Navigate to the previous question
  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prev => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  /**
   * Scroll handler for web:
   * - When the user scrolls near the bottom, go to the next question.
   * - When the user scrolls near the top, go to the previous question.
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 100) {
      handleNextQuestion();
    }
    if (target.scrollTop < 50) {
      handlePreviousQuestion();
    }
  };

  // If quizData is not loaded, show an error message
  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: Invalid quiz data.</p>
      </div>
    );
  }

  // Check if all questions have been answered
  const allQuestionsAnswered = currentQuestionIndex >= totalQuestions;

  return (
    <div className="min-h-screen  text-white flex flex-col">
      <div
        className="flex-grow overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        <h1 className="text-2xl font-bold mb-4">Let's Play!</h1>

        {allQuestionsAnswered ? (
          <div className="p-4 bg-blue-900 rounded">
            <p>{quizData.summary}</p>
          </div>
        ) : (
          <div className="p-4 bg-blue-950 rounded-2xl">
            <p className="mb-2">
              {currentQuestionIndex + 1}. {quizData.questions[currentQuestionIndex].questionText}
            </p>
            <ul className="mb-2">
              {quizData.questions[currentQuestionIndex].options.map((option, index) => (
                <li key={index} className="mb-1">
                  {option}
                </li>
              ))}
            </ul>
            {showCorrectAnswer ? (
              <p className="font-semibold">
                Correct Answer: {quizData.questions[currentQuestionIndex].correctOption}
              </p>
            ) : (
              <button
                onClick={() => setShowCorrectAnswer(true)}
                className="btn btn-secondary"
              >
                Show Correct Answer
              </button>
            )}
          </div>
        )}

        <p className="mt-4 text-sm">
          Scroll up for previous question, scroll down for next question.
        </p>
      </div>
    </div>
  );
}
