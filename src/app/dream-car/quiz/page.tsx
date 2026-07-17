"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface QuizOption {
  label: string;
  value: string;
}

interface Question {
  id: number;
  title: string;
  subline: string;
  paramKey: "budget" | "body" | "fuel" | "gearbox";
  options: QuizOption[];
  isGrid?: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "WHAT'S YOUR BUDGET?",
    subline: "Select a range to find matches within your budget.",
    paramKey: "budget",
    options: [
      { label: "UNDER ₹3 LAKH", value: "u3" },
      { label: "₹3 – 5 LAKH", value: "3-5" },
      { label: "₹5 – 8 LAKH", value: "5-8" },
      { label: "₹8 LAKH +", value: "8p" }
    ]
  },
  {
    id: 2,
    title: "WHAT KIND OF CAR?",
    subline: "Choose your preferred body style.",
    paramKey: "body",
    isGrid: true,
    options: [
      { label: "HATCHBACK", value: "hatchback" },
      { label: "SEDAN", value: "sedan" },
      { label: "SUV", value: "suv" },
      { label: "MUV", value: "muv" }
    ]
  },
  {
    id: 3,
    title: "WHAT FUEL?",
    subline: "Electric, petrol, or other fuels?",
    paramKey: "fuel",
    options: [
      { label: "PETROL", value: "petrol" },
      { label: "DIESEL", value: "diesel" },
      { label: "CNG", value: "cng" },
      { label: "ELECTRIC", value: "electric" }
    ]
  },
  {
    id: 4,
    title: "WHAT GEARBOX?",
    subline: "Manual or automatic transmission?",
    paramKey: "gearbox",
    options: [
      { label: "MANUAL", value: "manual" },
      { label: "AUTOMATIC", value: "automatic" }
    ]
  }
];

export default function QuizPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [animatingSelection, setAnimatingSelection] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[stepIndex];

  // Handle option click with 250ms auto-advance
  const handleSelect = (value: string) => {
    setAnimatingSelection(value);
    setSelections((prev) => ({
      ...prev,
      [currentQuestion.paramKey]: value,
    }));

    setTimeout(() => {
      setAnimatingSelection(null);
      if (stepIndex < QUESTIONS.length - 1) {
        setStepIndex((prev) => prev + 1);
      } else {
        finishQuiz({
          ...selections,
          [currentQuestion.paramKey]: value,
        });
      }
    }, 250);
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    } else {
      router.push("/dream-car");
    }
  };

  const handleSkip = () => {
    // Delete current param selection if any
    const updatedSelections = { ...selections };
    delete updatedSelections[currentQuestion.paramKey];
    setSelections(updatedSelections);

    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishQuiz(updatedSelections);
    }
  };

  const finishQuiz = (finalSelections: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(finalSelections).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    // Redirect to cars page with search params
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="min-h-[100dvh] bg-cream flex flex-col justify-between pt-6 pb-12 text-ink">
      {/* Top Header & Progress bar (desktop styling uses a purple top bar, mobile does not) */}
      <div className="w-full">
        {/* Top Navigation Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 font-display text-sm tracking-widest text-gray-muted hover:text-ink transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4 text-brass" />
            BACK
          </button>
          <span className="font-display text-sm tracking-widest text-gray-muted">
            QUESTION {currentQuestion.id} OF {QUESTIONS.length}
          </span>
        </div>

        {/* Progress Bar (4 segments) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex gap-2">
            {QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  idx <= stepIndex ? "bg-violet" : "bg-gray-pill"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (Responsive: Mobile = stacked, Desktop = 2-column) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Question Text block (Left Column on Desktop) */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="inline-block font-display text-xs tracking-widest text-brass uppercase">
              STEP {currentQuestion.id}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              {currentQuestion.title}
            </h2>
            <p className="font-body text-sm sm:text-base text-gray-muted max-w-md mx-auto lg:mx-0">
              {currentQuestion.subline}
            </p>
          </div>

          {/* Answer Options Grid (Right Column on Desktop) */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto space-y-4">
            <div
              className={`${
                currentQuestion.isGrid
                  ? "grid grid-cols-2 gap-4"
                  : "flex flex-col gap-4"
              }`}
            >
              {currentQuestion.options.map((opt) => {
                const isSelected = selections[currentQuestion.paramKey] === opt.value;
                const isAnimating = animatingSelection === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full min-h-[64px] px-6 py-4 rounded-[20px] transition-all duration-150 btn-scale text-left flex items-center justify-between font-display text-lg tracking-wider ${
                      isSelected || isAnimating
                        ? "bg-violet text-white"
                        : "bg-white text-ink hover:bg-gray-pill"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {(isSelected || isAnimating) && (
                      <CheckCircle2 className="w-5 h-5 text-white fill-current" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* SHOW ME ANYTHING (Full width button for Q2 body type) */}
            {currentQuestion.paramKey === "body" && (
              <button
                onClick={handleSkip}
                className="w-full min-h-[64px] px-6 py-4 rounded-[20px] bg-white text-ink hover:bg-gray-pill font-display text-lg tracking-wider text-center btn-scale"
              >
                SHOW ME ANYTHING
              </button>
            )}

            {/* ANY FUEL (For Q3 fuel) */}
            {currentQuestion.paramKey === "fuel" && (
              <button
                onClick={handleSkip}
                className="w-full min-h-[64px] px-6 py-4 rounded-[20px] bg-white text-ink hover:bg-gray-pill font-display text-lg tracking-wider text-center btn-scale"
              >
                ANY FUEL
              </button>
            )}

            {/* EITHER IS FINE (For Q4 gearbox) */}
            {currentQuestion.paramKey === "gearbox" && (
              <button
                onClick={handleSkip}
                className="w-full min-h-[64px] px-6 py-4 rounded-[20px] bg-white text-ink hover:bg-gray-pill font-display text-lg tracking-wider text-center btn-scale"
              >
                EITHER IS FINE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Skip this question */}
      <div className="w-full text-center">
        <button
          onClick={handleSkip}
          className="font-display text-sm tracking-widest text-brass hover:text-ink transition-colors uppercase underline decoration-2 underline-offset-4"
        >
          Skip this question &rarr;
        </button>
      </div>
    </div>
  );
}
