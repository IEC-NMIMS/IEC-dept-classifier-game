"use client";

import { useState } from 'react';
import { quizQuestions, departments } from '../lib/quizData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ department: '', description: '' });

  const handleAnswer = (weights: { [key: string]: number }) => {
    const newScores = { ...scores };
    for (const department in weights) {
      if (newScores[department]) {
        newScores[department] += weights[department];
      } else {
        newScores[department] = weights[department];
      }
    }
    setScores(newScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newScores);
      setShowResult(true);
    }
  };

  const calculateResult = (finalScores: { [key: string]: number }) => {
    let maxScore = -1;
    let bestDepartment = '';
    for (const department in finalScores) {
      if (finalScores[department] > maxScore) {
        maxScore = finalScores[department];
        bestDepartment = department;
      }
    }
    setResult({ department: bestDepartment, description: departments[bestDepartment as keyof typeof departments] });
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores({});
    setShowResult(false);
    setResult({ department: '', description: '' });
  };

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-[0.01] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              IEC Department Classifier
            </h1>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover your perfect department match through our intelligent assessment system
          </p>
        </div>

        {/* Main Card */}
        <Card className="frosted-glass border-white/10 animate-fade-in-up">
          <CardHeader className="text-center pb-6">
            {!showResult && (
              <>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/60">Progress</span>
                    <span className="text-sm text-white/60">
                      {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <CardTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {quizQuestions[currentQuestion].question}
                </CardTitle>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {showResult ? (
              <div className="text-center space-y-6 animate-fade-in-up">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white/80 font-medium">Your Perfect Match</span>
                  </div>
                  
                  <h2 className="text-responsive-xl font-bold text-white animate-pulse-glow">
                    {result.department}
                  </h2>
                  
                  <div className="max-w-2xl mx-auto">
                    <p className="text-lg text-white/80 leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={restartQuiz}
                    className="btn-primary px-8 py-3 text-lg font-semibold rounded-xl"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Take Quiz Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizQuestions[currentQuestion].answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleAnswer(answer.weights)}
                      className="btn-frosted p-6 h-auto text-left text-white hover:text-white border-white/10 hover:border-white/20 rounded-xl group"
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-base leading-relaxed pr-4 text-left">
                          {answer.text}
                        </span>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-0.5" />
                      </div>
                    </Button>
                  ))}
                </div>
                
                {/* Question Counter */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white/60 text-sm">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up">
          <p className="text-white/40 text-sm">
            Powered by advanced classification algorithms
          </p>
        </div>
      </div>
    </main>
  );
}