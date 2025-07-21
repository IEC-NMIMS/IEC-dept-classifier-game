"use client";

import { useState, useEffect } from "react";
import { quizQuestions, departments } from "../lib/quizData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // New state to track answers
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    department: "",
    description: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAnswer = (weights: { [key: string]: number }, answerText: string) => {
    const newScores = { ...scores };
    setSelectedAnswers([...selectedAnswers, answerText]); // Store the selected answer text

    for (const department in weights) {
      newScores[department] =
        (newScores[department] || 0) + weights[department];
    }

    setScores(newScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newScores);
      setShowResult(true);
    }
  };

  const calculateResult = async (finalScores: { [key: string]: number }) => {
    setIsLoading(true);
    if (Object.keys(finalScores).length === 0) {
      setResult({
        department: "No clear result",
        description: "Please try the quiz again!",
      });
      setIsLoading(false);
      return;
    }

    const sortedScores = Object.entries(finalScores).sort(
      (a, b) => b[1] - a[1]
    );

    const [bestDepartment] = sortedScores[0];
    const departmentDescription = departments[bestDepartment as keyof typeof departments];

    try {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: selectedAnswers,
                departmentDescription,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get summary');
        }

        const data = await response.json();
        setResult({
            department: bestDepartment,
            description: data.summary,
        });

    } catch (error) {
        console.error("Error fetching summary, falling back to default description.", error);
        setResult({
            department: bestDepartment,
            description: departmentDescription, // Fallback to the original description
        });
    } finally {
        setIsLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores({});
    setSelectedAnswers([]); // Reset selected answers
    setShowResult(false);
    setResult({ department: "", description: ""});
  };

  const progressPercentage = (currentQuestion / quizQuestions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 swirling-gradient-bg">
      {isClient && (
        <div className="particle-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background: ["#ff7f2e", "#28359e", "#ffffff"][
                  Math.floor(Math.random() * 3)
                ],
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content wrapper with horizontal padding for smaller screens */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col px-4 md:px-0">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              IEC Department Classifier
            </h1>
          </div>
          <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto">
            Discover your perfect department match through our intelligent
            assessment system
          </p>
        </div>

        {/* Progress Section (only shown during quiz) */}
        {!showResult && (
          <div className="w-full mb-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/80">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-white/80">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 w-full bg-white/10"
            />
          </div>
        )}

        {/* Main Quiz Card - Improved Version */}
        <Card className="quiz-card">
          {!showResult && (
            <CardHeader className="quiz-question-section">
              <CardTitle className="quiz-question-title">
                {quizQuestions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
          )}

          <CardContent className={showResult ? "quiz-results-section" : "quiz-answers-section"}>
            {showResult ? (
              /* Improved Results Section */
              <div className="animate-fade-in-up">
                {isLoading ? (
                  <div className="quiz-loading">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    <p className="quiz-loading-text">Analyzing your results...</p>
                  </div>
                ) : (
                  <>
                    <div className="quiz-results-badge">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="quiz-results-badge-text">Your Top Department</span>
                    </div>
                    <h2 className="quiz-results-department no-ugly-glow">
                      {result.department}
                    </h2>
                    <div className="quiz-results-description">
                      <p className="quiz-results-description-text">
                        {result.description}
                      </p>
                    </div>
                    <Button
                      onClick={restartQuiz}
                      className="quiz-results-restart-button"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Take Quiz Again
                    </Button>
                  </>
                )}
              </div>
            ) : (
              /* Improved Question and Answers Section */
              <div className="animate-fade-in-up">
                {quizQuestions[currentQuestion].answers.map((answer, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(answer.weights, answer.text)}
                    className="quiz-answer-option"
                  >
                    <span className="quiz-answer-text">
                      {answer.text}
                    </span>
                    <ArrowRight className="quiz-answer-arrow" />
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8 animate-fade-in-up">
          <p className="text-white/50 text-xs md:text-sm">
            Powered by advanced classification algorithms
          </p>
        </footer>
      </div>
    </main>
  );
}