"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { quizQuestions, departments } from "../lib/quizData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ArrowRight, RotateCcw, Sparkles, Mail, X } from "lucide-react";
import confetti from 'canvas-confetti';

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
  
  // Question transition states
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);
  const [questionFadeClass, setQuestionFadeClass] = useState("");
  
  // Contact form states
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Enhanced reveal states
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [showDepartment, setShowDepartment] = useState(false);
  const [particleState, setParticleState] = useState("normal");

  // Confetti animation functions - optimized for mobile
  const triggerConfetti = () => {
    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    // IEC-themed confetti colors
    const colors = ['#ff7f2e', '#28359e', '#ffffff', '#fbbf24', '#34d399'];
    
    // Main burst - fewer particles on mobile
    confetti({
      particleCount: isMobile ? 50 : 100,
      spread: isMobile ? 50 : 70,
      origin: { y: 0.6 },
      colors: colors,
      scalar: isMobile ? 0.8 : 1.2,
      gravity: 1,
      drift: 0,
      ticks: isMobile ? 200 : 300
    });

    // Side bursts - only on desktop
    if (!isMobile) {
      setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors
      });
    }, 150);

    // Final cascade - fewer particles on mobile
    setTimeout(() => {
      confetti({
        particleCount: isMobile ? 15 : 30,
        spread: isMobile ? 90 : 120,
        origin: { y: 0.4 },
        colors: colors,
        scalar: isMobile ? 0.6 : 0.8
      });
    }, 300);
    }
  };

  const triggerSuccessConfetti = () => {
    // Golden success confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffd700', '#ffed4e', '#fbbf24', '#f59e0b'],
      shapes: ['star', 'circle'],
      scalar: 1.5,
      gravity: 0.8,
      ticks: 400
    });
  };

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
    // Start the fade out animation
    setIsQuestionTransitioning(true);
    setQuestionFadeClass("question-fade-out");

    // Wait for fade out to complete, then update question and fade in
    setTimeout(() => {
      const newScores = { ...scores };
      setSelectedAnswers([...selectedAnswers, answerText]);

      for (const department in weights) {
        newScores[department] =
          (newScores[department] || 0) + weights[department];
      }

      setScores(newScores);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        
        // Start fade in animation for the new question
        setQuestionFadeClass("question-fade-in");
        
        // Reset transition state after fade in completes
        setTimeout(() => {
          setIsQuestionTransitioning(false);
          setQuestionFadeClass("");
        }, 400); // Duration of fade-in animation
      } else {
        // Immediately show the result screen with loading state
        setShowResult(true);
        setIsLoading(true);
        setParticleState("gathering");
        setIsQuestionTransitioning(false);
        setQuestionFadeClass("");
        calculateResult(newScores);
      }
    }, 300); // Duration of fade-out animation
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
      // Get the AI-generated summary for email use
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

      let aiSummary = departmentDescription; // Fallback to default description
      if (response.ok) {
        const data = await response.json();
        aiSummary = data.summary;
      }

      // Reveal the department name after analysis
      setTimeout(() => {
        setResult({
          department: bestDepartment,
          description: aiSummary, // Store for email use
        });
        setIsLoading(false);
        setParticleState("scattering");
        setShowDepartment(true);
        
        // Trigger confetti animation when result is revealed
        setTimeout(() => {
          triggerConfetti();
        }, 200); // Small delay to let the result render first
      }, 2500); // Let analysis run for 2.5 seconds

    } catch (error) {
      console.error("Error fetching summary, using default description.", error);
      
      setTimeout(() => {
        setResult({
          department: bestDepartment,
          description: departmentDescription, // Fallback description
        });
        setIsLoading(false);
        setParticleState("scattering");
        setShowDepartment(true);
        
        // Trigger confetti animation when result is revealed
        setTimeout(() => {
          triggerConfetti();
        }, 200); // Small delay to let the result render first
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
    setParticleState("normal");
    setShowContactForm(false);
    setContactForm({ name: "", email: "", phone: "" });
    setContactSubmitted(false);
    setIsQuestionTransitioning(false);
    setQuestionFadeClass("");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactForm,
          department: result.department,
          description: result.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setContactSubmitted(true);
      setShowContactForm(false);
      
      // Trigger success confetti for successful contact form submission
      setTimeout(() => {
        triggerSuccessConfetti();
      }, 100);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const progressPercentage = (currentQuestion / quizQuestions.length) * 100;

  return (
    <div className={`min-h-screen swirling-gradient-bg ${isLoading ? 'analyzing' : ''}`}>
      {/* Fixed QR Code in top right corner - mobile optimized */}
      <div className="fixed top-2 right-2 z-50 scale-75 origin-top-right sm:scale-100 sm:top-4 sm:right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-all duration-300">
          <Image 
            src="/exec_gform_qr.jpg" 
            alt="Executive Form QR Code" 
            width={80}
            height={80}
            className="rounded"
          />
          <p className="text-[7px] sm:text-[8px] text-gray-600 text-center mt-1 font-medium">
            Executive Form
          </p>
        </div>
      </div>

      {isClient && (
        <div className={`particle-container ${particleState}`}>
          {Array.from({ length: window.innerWidth < 768 ? 200 : 500 }).map((_, i) => (
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

      <div className="content-layer quiz-main-container flex items-center justify-center min-h-screen py-2 px-2 sm:py-4 sm:px-4">
        <div className="quiz-content-wrapper max-w-4xl w-full">
          {/* Header Section - optimized for mobile */}
          <div className="text-center mb-2 sm:mb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 animate-fade-in-up">
              {/* IEC Department Classifier */}
            </h1>
            <Image 
              src="/iec-logo.svg" 
              alt="IEC Logo" 
              className="mb-2 sm:mb-4 w-1/2 sm:w-1/3 mx-auto" 
              width={50}
              height={50}
            />
            <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto animate-slide-in-left px-2">
              Discover your perfect department match through our intelligent
              assessment system
            </p>
          </div>

          {/* Progress Section */}
          {!showResult && (
            <div className="quiz-progress-container mb-2">
              <div className="quiz-progress-labels flex justify-between text-sm">
                <span className="quiz-progress-label">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="quiz-progress-label">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="quiz-progress-bar h-1">
                <Progress value={progressPercentage} className="progress-fill h-1" />
              </div>
            </div>
          )}

          {/* Main Quiz Card */}
          <Card className="quiz-card shadow-lg">
            <CardContent className="p-0">
              {!showResult && (
                <div className={`quiz-question-section py-3 px-4 ${questionFadeClass} ${isQuestionTransitioning ? 'question-transitioning' : ''}`}>
                  <h2 className="quiz-question-title text-lg font-medium">
                    {quizQuestions[currentQuestion].question}
                  </h2>
                </div>
              )}

              {showResult ? (
                <div className="quiz-results-section p-4">
                  {isLoading ? (
                    <div className="quiz-loading analyzing flex flex-col items-center justify-center py-3 sm:py-4">
                      <div className="relative">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 animate-spin" />
                        <div className="absolute inset-0 bg-gradient-radial from-orange-400/20 to-transparent rounded-full animate-ping" />
                      </div>
                      <p className="quiz-loading-text text-xs sm:text-sm mt-2">{analysisMessage}</p>
                    </div>
                  ) : (
                    <>
                      <div className="quiz-results-badge flex items-center gap-1 text-xs">
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span className="quiz-results-badge-text">Your Top Department</span>
                      </div>

                      <h2 className={`quiz-results-department text-2xl font-bold mt-1 ${showDepartment ? 'dramatic-reveal' : ''}`}>
                        {showDepartment ? result.department : ''}
                      </h2>

                      {showDepartment && (
                        <div className="flex flex-col gap-2 mt-4">
                          <Button
                            onClick={() => setShowContactForm(true)}
                            className="quiz-results-contact-button text-sm py-1"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Get Detailed Analysis via Email
                          </Button>
                          
                          <Button
                            onClick={restartQuiz}
                            className="quiz-results-restart-button delayed-reveal text-sm py-1"
                            variant="outline"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Take Quiz Again
                          </Button>
                        </div>
                      )}

                      {contactSubmitted && (
                        <div className="quiz-contact-success flex items-center gap-1 mt-2 text-xs bg-green-900/20 text-green-400 p-2 rounded">
                          <Sparkles className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>Email sent! Check your inbox for insights.</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className={`quiz-answers-section p-2 grid gap-2 ${isQuestionTransitioning ? 'question-transitioning' : ''}`}>
                  {quizQuestions[currentQuestion].answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => !isQuestionTransitioning && handleAnswer(answer.weights, answer.text)}
                      disabled={isQuestionTransitioning}
                      className="quiz-answer-option flex items-center justify-between py-3 px-4 sm:py-2 sm:px-3 hover:bg-gray-100/10 active:bg-gray-100/15 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed relative"
                    >
                      <span className="quiz-answer-text text-sm pr-8">{answer.text}</span>
                      <ArrowRight className="quiz-answer-arrow w-4 h-4 absolute right-3" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Form Modal */}
            {showContactForm && (
            <div className="quiz-modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/70 px-2 sm:px-4">
              <div className="quiz-contact-modal bg-black border border-gray-800 rounded-xl shadow-xl overflow-hidden max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="modal-header bg-black p-2 sm:p-3">
                <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                  ✨ Get Your Detailed Analysis
                  </h3>
                  <p className="text-white/80 text-[10px] sm:text-xs">
                  Personalized insights delivered to your inbox
                  </p>
                </div>
                <Button
                  onClick={() => setShowContactForm(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                </div>
              </div>
              
              <div className="p-2 sm:p-3 bg-black">
                <div className="department-highlight bg-black/40 p-2 rounded-md">
                <p className="text-white text-[11px] sm:text-xs leading-relaxed">
                  Enter your details to receive an analysis of why{" "}
                  <span className="department-name font-semibold ">{result.department}</span>{" "}
                  is your perfect match. We&apos;ll email you personalized insights and next steps.
                </p>
                </div>
                
                <form onSubmit={handleContactSubmit} className="space-y-2 sm:space-y-3 mt-2">
                <div className="form-group">
                  <label htmlFor="name" className="form-label text-white block mb-1 text-xs font-medium">
                  Full Name *
                  </label>
                  <Input
                  id="name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="form-input bg-gray-900 border-gray-700 text-white placeholder-gray-400 text-sm h-8 px-2"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label text-white block mb-1 text-xs font-medium">
                  Email Address *
                  </label>
                  <Input
                  id="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className="form-input bg-gray-900 border-gray-700 text-white placeholder-gray-400 text-sm h-8 px-2"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone" className="form-label text-white block mb-1 text-xs font-medium">
                  Phone Number *
                  </label>
                  <Input
                  id="phone"
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="form-input bg-gray-900 border-gray-700 text-white placeholder-gray-400 text-sm h-8 px-2"
                  />
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="submit-button flex-1 bg-blue-600 hover:bg-blue-700 text-white py-0 h-7 text-xs"
                  >
                  {isSubmittingContact ? (
                    <>
                    <Sparkles className="w-3 h-3 animate-spin mr-1" />
                    Sending...
                    </>
                  ) : (
                    <>
                    <Mail className="w-3 h-3 mr-1" />
                    Send Analysis
                    </>
                  )}
                  </Button>
                  
                  <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  disabled={isSubmittingContact}
                  className="cancel-button text-white border-gray-600 hover:bg-gray-800 py-0 h-7 text-xs"
                  >
                  Cancel
                  </Button>
                </div>
                {/* Consent statement */}
                  <p className="text-[11px] text-white/60 text-center mt-3">
                    By entering your email and phone number, you agree to receive promotional content from IEC.
                  </p>
                </form>
              </div>
              </div>
            </div>
            )}

          {/* Footer */}
          <div className="text-center text-white/60 text-xs mt-2">
            Discover your perfect department match
          </div>
        </div>
      </div>
    </div>
  );
}
