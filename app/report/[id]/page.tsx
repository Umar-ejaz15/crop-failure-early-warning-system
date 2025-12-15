"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RiskDashboard from "../../components/RiskDashboard";
import { WeeklyCheckIn, RiskAssessment } from "../../types/crop";

export default function ReportPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [checkIn, setCheckIn] = useState<WeeklyCheckIn | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [geminiSuggestions, setGeminiSuggestions] = useState("");

  useEffect(() => {
    if (!id) return;
    // Get check-in from localStorage
    const saved = localStorage.getItem("checkInHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = parsed.find((c: WeeklyCheckIn) => c.id === id);
      if (found) {
        setCheckIn(found);
        setAssessment({
          overallRisk: found.riskScore,
          riskLevel: found.riskScore < 3 ? "low" : found.riskScore < 5 ? "medium" : found.riskScore < 7 ? "high" : "critical",
          factors: {
            pest: 0,
            disease: 0,
            water: 0,
            nutrient: 0,
            weather: 0,
            growth: 0
          },
          alerts: found.alerts || [],
          recommendations: []
        });
        // Fetch Gemini suggestions
        fetch("/api/gemini-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cropType: found.cropType,
            currentStage: found.currentStage,
            responses: found.responses,
            weatherData: found.weatherConditions
          })
        })
          .then(res => res.json())
          .then(data => setGeminiSuggestions(data.suggestions || ""));
      }
    }
  }, [id]);

  if (!id) return <div className="p-8 text-center">Invalid report link.</div>;
  if (!checkIn || !assessment) return <div className="p-8 text-center">Loading report...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Daily Report</h1>
        <RiskDashboard
          assessment={assessment}
          cropType={checkIn.cropType}
          currentStage={checkIn.currentStage}
          checkInHistory={[]}
          geminiSuggestions={geminiSuggestions}
        />
      </div>
    </div>
  );
}
