"use client";

import { useState, useEffect } from "react";
import { quizQuestions, departments } from "../lib/quizData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    department: "",
    description: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Enhanced reveal states
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [showDepartment, setShowDepartment] = useState(false);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [particleState, setParticleState] = useState("normal");

  // Fun analysis messages
  const analysisMessages = [
    "🔍 Analyzing your responses...",
    "🧠 Processing your preferences...",
    "✨ Matching you with departments...",
    "🎯 Finding your perfect fit...",
    "⚡ Calculating compatibility scores...",
    "🔬 Running advanced algorithms...",
    "🎨 Crafting your personalized result...",
    "🚀 Almost there...",
  ];

  useEffect(() => {
    setIsClient(true);
    
    // Set random starting positions for particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle) => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      (particle as HTMLElement).style.setProperty('--start-x', `${x - window.innerWidth/2}px`);
      (particle as HTMLElement).style.setProperty('--start-y', `${y - window.innerHeight/2}px`);
    });
  }, []);

  // Cycle through analysis messages
  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      setAnalysisMessage(analysisMessages[0]);
      
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % analysisMessages.length;
        setAnalysisMessage(analysisMessages[messageIndex]);
      }, 1200); // Change message every 1.2 seconds

      return () => clearInterval(messageInterval);
    }
  }, [isLoading]);

  const handleAnswer = (
    weights: { [key: string]: number },
    answerText: string
  ) => {
    const newScores = { ...scores };
    setSelectedAnswers([...selectedAnswers, answerText]);

    for (const department in weights) {
      newScores[department] =
        (newScores[department] || 0) + weights[department];
    }

    setScores(newScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Immediately show the result screen with loading state
      setShowResult(true);
      setIsLoading(true);
      setParticleState("gathering");
      calculateResult(newScores);
    }
  };

  const calculateResult = async (finalScores: { [key: string]: number }) => {
  if (Object.keys(finalScores).length === 0) {
    setResult({
      department: "No clear result",
      description: "Please try the quiz again!",
    });
    setIsLoading(false);
    setParticleState("normal");
    return;
  }

    const sortedScores = Object.entries(finalScores).sort(
      (a, b) => b[1] - a[1]
    );
    const [bestDepartment] = sortedScores[0];
    const departmentDescription =
      departments[bestDepartment as keyof typeof departments];

    try {
      // First, reveal the department name
      setTimeout(() => {
        setResult(prev => ({
          ...prev,
          department: bestDepartment,
        }));
        setIsLoading(false);
        setParticleState("scattering");
        setShowDepartment(true);
      }, 2500); // Let analysis run for 2.5 seconds

      // Fetch the summary in background
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: selectedAnswers,
          departmentDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get summary");
      }

      const data = await response.json();
      
      // Load the summary after department is revealed
      setTimeout(() => {
        setResult(prev => ({
          ...prev,
          description: data.summary,
        }));
        setSummaryLoaded(true);
        
        // Expand description after a brief delay
        setTimeout(() => {
          setShowDescription(true);
          setParticleState("normal");
        }, 500);
      }, 3000); // Department reveal + 500ms

    } catch (error) {
      console.error(
        "Error fetching summary, falling back to default description.",
        error
      );
      
      setTimeout(() => {
        setResult(prev => ({
          ...prev,
          department: bestDepartment,
        }));
        setIsLoading(false);
        setParticleState("scattering");
        setShowDepartment(true);
        
        setTimeout(() => {
          setResult(prev => ({
            ...prev,
            description: departmentDescription,
          }));
          setSummaryLoaded(true);
          
          setTimeout(() => {
            setShowDescription(true);
            setParticleState("normal");
          }, 500);
        }, 1000);
      }, 2500);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores({});
    setSelectedAnswers([]);
    setShowResult(false);
    setResult({ department: "", description: "" });
    setIsLoading(false);
    setShowDepartment(false);
    setSummaryLoaded(false);
    setShowDescription(false);
    setParticleState("normal");
  };

  const progressPercentage = (currentQuestion / quizQuestions.length) * 100;

  return (
    <div className={`min-h-screen swirling-gradient-bg ${isLoading ? 'analyzing' : ''}`}>
      {isClient && (
        <div className={`particle-container ${particleState}`}>
          {Array.from({ length: 500 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="content-layer quiz-main-container">
        <div className="quiz-content-wrapper">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
              {/* IEC Department Classifier */}
            </h1>
            <img src="\iec-logo.svg" alt="IEC Logo" className="mb-4 w-1/2" />
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-slide-in-left">
              Discover your perfect department match through our intelligent
              assessment system
            </p>
          </div>

          {/* Progress Section */}
          {!showResult && (
            <div className="quiz-progress-container">
              <div className="quiz-progress-labels">
                <span className="quiz-progress-label">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="quiz-progress-label">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="quiz-progress-bar">
                <Progress value={progressPercentage} className="progress-fill" />
              </div>
            </div>
          )}

          {/* Main Quiz Card */}
          <Card className="quiz-card">
            <CardContent className="p-0">
              {!showResult && (
                <div className="quiz-question-section">
                  <h2 className="quiz-question-title">
                    {quizQuestions[currentQuestion].question}
                  </h2>
                </div>
              )}

              {showResult ? (
                <div className="quiz-results-section">
                  {isLoading ? (
                    <div className="quiz-loading analyzing">
                      <Sparkles className="w-8 h-8 text-orange-400 animate-spin" />
                      <p className="quiz-loading-text">{analysisMessage}</p>
                    </div>
                  ) : (
                    <>
                      <div className="quiz-results-badge">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span className="quiz-results-badge-text">Your Top Department</span>
                      </div>

                      <h2 className={`quiz-results-department ${showDepartment ? 'dramatic-reveal' : ''}`}>
                        {showDepartment ? result.department : ''}
                      </h2>

                      {summaryLoaded && (
                        <div className={`quiz-results-description ${showDescription ? 'expand' : ''}`}>
                          <div className="quiz-results-description-text">
                            <ReactMarkdown>{result.description}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {showDescription && (
                        <Button
                          onClick={restartQuiz}
                          className="quiz-results-restart-button delayed-reveal"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Take Quiz Again
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="quiz-answers-section">
                  {quizQuestions[currentQuestion].answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(answer.weights, answer.text)}
                      className="quiz-answer-option"
                    >
                      <span className="quiz-answer-text">{answer.text}</span>
                      <ArrowRight className="quiz-answer-arrow" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-white/60 text-sm">
            Discover your perfect department match through our intelligent
            assessment system
          </div>
        </div>
      </div>
    </div>
  );
}
