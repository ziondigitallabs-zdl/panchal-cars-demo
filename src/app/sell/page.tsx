"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Edit2 } from "lucide-react";
import { getSellWhatsAppLink } from "@/utils/whatsapp";

interface SellStep {
  id: number;
  title: string;
  subline: string;
  key: "brand" | "model" | "year" | "fuel" | "gearbox" | "km" | "owner";
  type: "select" | "text";
  options?: string[];
}

const STEPS: SellStep[] = [
  {
    id: 1,
    title: "WHAT BRAND IS YOUR CAR?",
    subline: "Select the manufacturer of your car.",
    key: "brand",
    type: "select",
    options: ["Maruti Suzuki", "Hyundai", "Tata", "Honda", "Renault", "Ford", "Mahindra", "Toyota", "Kia", "OTHER"]
  },
  {
    id: 2,
    title: "WHAT IS THE MODEL NAME?",
    subline: "Type your car's model (e.g. Swift, City, Kwid).",
    key: "model",
    type: "text"
  },
  {
    id: 3,
    title: "WHAT YEAR WAS IT MADE?",
    subline: "Select the year of registration.",
    key: "year",
    type: "select",
    options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"]
  },
  {
    id: 4,
    title: "WHAT FUEL TYPE?",
    subline: "Select the primary fuel type.",
    key: "fuel",
    type: "select",
    options: ["Petrol", "Diesel", "CNG", "Electric"]
  },
  {
    id: 5,
    title: "WHAT IS THE TRANSMISSION?",
    subline: "Manual or automatic gearbox?",
    key: "gearbox",
    type: "select",
    options: ["Manual", "Automatic"]
  },
  {
    id: 6,
    title: "HOW MANY KILOMETERS DRIVEN?",
    subline: "Choose the range that matches your odometer.",
    key: "km",
    type: "select",
    options: ["Under 20K km", "20K - 50K km", "50K - 80K km", "80K - 120K km", "120K+ km"]
  },
  {
    id: 7,
    title: "HOW MANY PREVIOUS OWNERS?",
    subline: "Select the number of owners.",
    key: "owner",
    type: "select",
    options: ["1st", "2nd", "3rd+"]
  }
];

export default function SellPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    brand: "",
    model: "",
    year: "",
    fuel: "",
    gearbox: "",
    km: "",
    owner: ""
  });

  // State to handle text input specifically for Step 2 (Model)
  const [modelInput, setModelInput] = useState("");
  const [isSummaryView, setIsSummaryView] = useState(false);

  const currentStep = STEPS[stepIndex];

  const handleSelectOption = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep.key]: val }));
    // Auto-advance with 200ms delay for selection visual feedback
    setTimeout(() => {
      if (stepIndex < STEPS.length - 1) {
        setStepIndex((prev) => prev + 1);
      } else {
        setIsSummaryView(true);
      }
    }, 200);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelInput.trim()) return;

    setAnswers((prev) => ({ ...prev, model: modelInput.trim() }));
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setIsSummaryView(true);
    }
  };

  const handleBack = () => {
    if (isSummaryView) {
      setIsSummaryView(false);
      setStepIndex(STEPS.length - 1);
    } else if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    } else {
      router.push("/");
    }
  };

  const handleEditField = (index: number) => {
    setStepIndex(index);
    if (STEPS[index].key === "model") {
      setModelInput(answers.model);
    }
    setIsSummaryView(false);
  };

  const handleWhatsAppSend = () => {
    const link = getSellWhatsAppLink({
      brand: answers.brand,
      model: answers.model,
      year: answers.year,
      fuel: answers.fuel,
      gearbox: answers.gearbox,
      km: answers.km,
      owner: answers.owner
    });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  // Render Summary View screen
  if (isSummaryView) {
    return (
      <div className="min-h-[100dvh] bg-cream flex flex-col justify-between pt-6 pb-12 text-ink">
        <div className="max-w-3xl mx-auto px-4 w-full space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 font-display text-sm tracking-widest text-gray-muted hover:text-ink transition-colors uppercase"
            >
              <ArrowLeft className="w-4 h-4 text-brass" />
              BACK
            </button>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <span className="font-display text-xs tracking-widest text-teal font-semibold uppercase">
              SUMMARY
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              VERIFY YOUR CAR DETAILS
            </h1>
            <p className="font-body text-sm sm:text-base text-gray-muted">
              Review the details below and proceed to send them on WhatsApp for valuation.
            </p>
          </div>

          {/* Answers Summary table */}
          <div className="bg-white rounded-[24px] p-6 space-y-4 shadow-sm border border-gray-pill/40">
            {STEPS.map((step, idx) => (
              <div
                key={step.key}
                className="flex items-center justify-between py-3 border-b border-gray-pill/40 last:border-none"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-muted font-body uppercase tracking-wider">{step.key}</span>
                  <span className="font-display text-lg mt-0.5">{answers[step.key] || "—"}</span>
                </div>

                <button
                  onClick={() => handleEditField(idx)}
                  className="p-2 rounded-full hover:bg-gray-pill text-brass hover:text-ink transition-colors"
                  aria-label={`Edit ${step.key}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Action WhatsApp Button */}
          <div className="text-center space-y-3 pt-4">
            <button
              onClick={handleWhatsAppSend}
              className="w-full max-w-md py-4 rounded-full bg-whatsapp text-white font-display text-lg tracking-wider hover:bg-opacity-95 transition-transform btn-scale flex items-center justify-center gap-2 shadow"
            >
              SEND DETAILS ON WHATSAPP
            </button>
            <p className="font-body text-xs text-gray-muted">
              Opens WhatsApp &middot; Nothing is sent until you press send in chat.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Render Quiz Question Screens
  return (
    <div className="min-h-[100dvh] bg-cream flex flex-col justify-between pt-6 pb-12 text-ink">
      
      {/* Header & Progress Bar */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 font-display text-sm tracking-widest text-gray-muted hover:text-ink transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4 text-brass" />
            BACK
          </button>
          <span className="font-display text-sm tracking-widest text-gray-muted">
            QUESTION {currentStep.id} OF {STEPS.length}
          </span>
        </div>

        {/* Progress Bar (Teal segments) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex gap-2">
            {STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  idx <= stepIndex ? "bg-teal" : "bg-gray-pill"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Question text block */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left animate-stagger-1">
            <span className="inline-block font-display text-xs tracking-widest text-brass uppercase font-semibold">
              STEP {currentStep.id} OF 7
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              {currentStep.title}
            </h2>
            <p className="font-body text-sm sm:text-base text-gray-muted max-w-md mx-auto lg:mx-0">
              {currentStep.subline}
            </p>
          </div>

          {/* Option elements (Teal fill on selected) */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto space-y-4">
            {currentStep.type === "select" ? (
              <div
                className={`${
                  currentStep.key === "brand"
                    ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
                    : currentStep.key === "year"
                    ? "grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1"
                    : "flex flex-col gap-3"
                }`}
              >
                {currentStep.options?.map((opt) => {
                  const isSelected = answers[currentStep.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full min-h-[56px] px-4 py-3 rounded-[16px] transition-all duration-150 btn-scale text-left flex items-center justify-between font-display text-sm tracking-wider ${
                        isSelected
                          ? "bg-teal text-ink font-bold"
                          : "bg-white text-ink hover:bg-gray-pill"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-4 h-4 text-ink" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Text Input Step (Model name) */
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter model name (e.g. City)"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="w-full px-6 py-4 rounded-[20px] bg-white border border-gray-pill focus:outline-none focus:ring-2 focus:ring-teal font-display text-lg tracking-wider text-ink"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!modelInput.trim()}
                  className={`w-full py-4 rounded-[20px] font-display text-lg tracking-wider transition-all btn-scale uppercase ${
                    modelInput.trim()
                      ? "bg-teal text-ink font-bold hover:bg-opacity-95"
                      : "bg-gray-pill text-gray-muted cursor-not-allowed"
                  }`}
                >
                  NEXT STEP
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom spacer to align nicely */}
      <div className="h-6" />
    </div>
  );
}
