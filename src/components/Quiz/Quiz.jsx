import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import "./Quiz.css";
import logoImg from "../OrientationRegistration/assets/ecell-logo.jpg";
import monogramImg from "../OrientationRegistration/assets/ec-monogram.png";

// 5 Curated Questions from User Request & Uploaded Images
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which of these brands doesn't use an animal in their logo?",
    options: [
      {
        id: "A",
        text: "Puma",
        isCorrect: false,
        explanation: "Puma features a leaping cougar (puma cat) in its logo."
      },
      {
        id: "B",
        text: "Lacoste",
        isCorrect: false,
        explanation: "Lacoste is famously identified by its green crocodile emblem."
      },
      {
        id: "C",
        text: "Jaguar",
        isCorrect: false,
        explanation: "Jaguar features a leaping predatory jaguar in its emblem."
      },
      {
        id: "D",
        text: "Apple",
        isCorrect: true,
        explanation: "Apple uses a bitten apple fruit logo, not an animal!"
      }
    ]
  },
  {
    id: 2,
    question: "Which Indian startup is popularly associated with the tagline \"Apna Time Aayega\"?",
    options: [
      {
        id: "A",
        text: "Zomato",
        isCorrect: true,
        explanation: "Zomato popularized the viral 'Apna Time Aayega' campaign across billboards and food delivery alerts."
      },
      {
        id: "B",
        text: "CRED",
        isCorrect: false,
        explanation: "CRED is widely known for 'Download CRED' retro celebrity advertisements."
      },
      {
        id: "C",
        text: "Swiggy",
        isCorrect: false,
        explanation: "Swiggy is known for 'Swiggy Karo, Phir Jo Chahe Karo'."
      },
      {
        id: "D",
        text: "Dream11",
        isCorrect: false,
        explanation: "Dream11 uses 'Yeh Apna Game Hai' & 'Khelo Dimag Se'."
      }
    ]
  },
  {
    id: 3,
    question: "What does MVP stand for in the startup ecosystem?",
    options: [
      {
        id: "A",
        text: "Minimum Value Proposition",
        isCorrect: false,
        explanation: "Value proposition defines customer value, but is not what MVP stands for."
      },
      {
        id: "B",
        text: "Maximum Viable Project",
        isCorrect: false,
        explanation: "Startups build minimal lean experiments first, not maximum projects."
      },
      {
        id: "C",
        text: "Most Valuable Product",
        isCorrect: false,
        explanation: "This is not the startup terminology."
      },
      {
        id: "D",
        text: "Minimum Viable Product",
        isCorrect: true,
        explanation: "An MVP is the simplest usable version built to test an idea and collect user feedback."
      }
    ]
  },
  {
    id: 4,
    question: "Who founded Instagram?",
    options: [
      {
        id: "A",
        text: "Kevin Systrom and Mike Krieger",
        isCorrect: true,
        explanation: "They launched Instagram in 2010 before it was acquired by Meta/Facebook."
      },
      {
        id: "B",
        text: "Evan Spiegel and Bobby Murphy",
        isCorrect: false,
        explanation: "Evan Spiegel and Bobby Murphy co-founded Snapchat."
      },
      {
        id: "C",
        text: "Brian Chesky and Joe Gebbia",
        isCorrect: false,
        explanation: "Brian Chesky and Joe Gebbia co-founded Airbnb."
      },
      {
        id: "D",
        text: "Ben Silbermann and Paul Sciarra",
        isCorrect: false,
        explanation: "They co-founded Pinterest."
      }
    ]
  },
  {
    id: 5,
    question: "What is the largest organ of the human body?",
    options: [
      {
        id: "A",
        text: "Liver",
        isCorrect: false,
        explanation: "The liver is the heaviest internal organ, but not the largest overall."
      },
      {
        id: "B",
        text: "Skin",
        isCorrect: true,
        explanation: "The skin is the largest organ of the human body, covering an average area of 2 square meters."
      },
      {
        id: "C",
        text: "Brain",
        isCorrect: false,
        explanation: "The brain is the control center of the nervous system."
      },
      {
        id: "D",
        text: "Lungs",
        isCorrect: false,
        explanation: "The lungs handle gas exchange, but skin is the largest organ overall."
      }
    ]
  }
];

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: optionId }

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "E-Cell Quiz | Innovation & Entrepreneurship Cell";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const selectedOptionId = userAnswers[currentQ.id];
  const hasAnsweredCurrent = selectedOptionId !== undefined;
  const isLastQuestion = currentIndex === QUIZ_QUESTIONS.length - 1;

  const handleSelectOption = (option) => {
    if (hasAnsweredCurrent) return; // Prevent re-selecting
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option.id
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="quiz-page-container quiz-grid-bg min-h-screen py-6 px-3 sm:px-6 md:px-8 flex flex-col justify-between">
      {/* Top Header Navigation (E-Cell brand only) */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between mb-4 sm:mb-6 z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoImg}
            alt="E-Cell SOA Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-purple-500/40 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = monogramImg;
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                IEC
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                SOA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-300/70 font-medium hidden xs:block">
              Innovation & Entrepreneurship Cell
            </p>
          </div>
        </Link>
      </header>

      {/* Main Content Area - Questions Only */}
      <main className="w-full max-w-3xl mx-auto my-auto z-20">
        <div className="bg-[#120424]/90 rounded-3xl border border-purple-500/30 p-5 sm:p-8 md:p-9 shadow-2xl shadow-purple-950/80 backdrop-blur-xl relative overflow-hidden glow-purple">
          {/* Top Glowing Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-snug mb-6 text-glow">
            {currentQ.question}
          </h2>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isOptionCorrect = opt.isCorrect;

              let cardStyle = "border-purple-500/25 bg-[#18082e]/80 text-slate-200 hover:border-purple-400/60 hover:bg-purple-950/40";
              let badgeStyle = "border-slate-600 bg-slate-800 text-slate-300";

              if (hasAnsweredCurrent) {
                if (isOptionCorrect) {
                  cardStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-md shadow-emerald-500/20";
                  badgeStyle = "bg-emerald-500 border-emerald-500 text-white font-black";
                } else if (isSelected) {
                  cardStyle = "border-rose-500 bg-rose-950/40 text-rose-100 shadow-md shadow-rose-500/20";
                  badgeStyle = "bg-rose-500 border-rose-500 text-white font-black";
                } else {
                  cardStyle = "border-slate-800/60 bg-slate-900/30 text-slate-500 opacity-60";
                  badgeStyle = "border-slate-700 bg-slate-800 text-slate-600";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleSelectOption(opt)}
                  className={`quiz-option-card w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-1.5 cursor-pointer disabled:cursor-default ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circular Letter Badge (A, B, C, D) */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-transform ${badgeStyle} ${
                        isSelected ? "scale-105" : ""
                      }`}
                    >
                      {hasAnsweredCurrent && isOptionCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : hasAnsweredCurrent && isSelected && !isOptionCorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        opt.id
                      )}
                    </div>

                    <span className="font-semibold text-sm sm:text-base leading-snug">
                      {opt.text}
                    </span>
                  </div>

                  {/* Explanatory annotation after selection */}
                  {hasAnsweredCurrent && (isSelected || isOptionCorrect) && (
                    <div
                      className={`pl-10 sm:pl-11 text-xs sm:text-[13px] leading-relaxed transition-all animate-fade-in ${
                        isOptionCorrect ? "text-emerald-300 font-medium" : "text-rose-300 font-normal"
                      }`}
                    >
                      <p>{opt.explanation}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-purple-900/40">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentIndex === 0
                  ? "text-slate-600 cursor-not-allowed opacity-40"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/40 cursor-pointer"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* In the last question, Next button is removed; only show Next when not on the last question */}
            {!isLastQuestion && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasAnsweredCurrent}
                  className={`py-2.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    hasAnsweredCurrent
                      ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-purple-950/60 text-purple-400/50 border border-purple-800/30 cursor-not-allowed"
                  }`}
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto mt-6 text-center z-20">
        <p className="text-[10px] sm:text-[11px] text-purple-400/40">
          Innovation & Entrepreneurship Cell (E-Cell) • SOA University • © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
