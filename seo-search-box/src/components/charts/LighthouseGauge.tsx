"use client";

import { cn } from "@/lib/utils";

interface LighthouseGaugeProps {
  label: string;
  score: number; // 0-100
}

export function LighthouseGauge({ label, score }: LighthouseGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getStrokeColor = (score: number): string => {
    if (score >= 90) return "#4ade80"; // green-400
    if (score >= 50) return "#fb923c"; // orange-400
    return "#f87171"; // red-400
  };

  const getLabel = (score: number): string => {
    if (score >= 90) return "Good";
    if (score >= 50) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke={getStrokeColor(normalizedScore)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold", getScoreColor(normalizedScore))}>
            {normalizedScore}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-white">{label}</p>
      <p className={cn("text-xs", getScoreColor(normalizedScore))}>
        {getLabel(normalizedScore)}
      </p>
    </div>
  );
}
