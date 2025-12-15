"use client";


import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RiskDashboard from "../../components/RiskDashboard";
import { WeeklyCheckIn, RiskAssessment } from "../../types/crop";

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [checkIn, setCheckIn] = useState<WeeklyCheckIn | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [geminiSuggestions, setGeminiSuggestions] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/checkin?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          setLoading(false);
          setCheckIn(null);
          return;
        }
        setCheckIn(data);
        setAssessment({
          overallRisk: data.riskScore,
          riskLevel: data.riskScore < 3 ? "low" : data.riskScore < 5 ? "medium" : data.riskScore < 7 ? "high" : "critical",
          factors: {
            pest: 0,
            disease: 0,
            water: 0,
            nutrient: 0,
            weather: 0,
            growth: 0
          },
          alerts: data.alerts || [],
          recommendations: []
        });
        fetch("/api/gemini-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cropType: data.cropType,
            currentStage: data.currentStage,
            responses: data.responses,
            weatherData: data.weather
          })
        })
          .then(res => res.json())
          .then(data => setGeminiSuggestions(data.suggestions || ""));
        setLoading(false);
      });
  }, [id]);

  if (!id) return <div className="p-8 text-center">Invalid report link.</div>;
  if (loading) return <div className="p-8 text-center">Loading report...</div>;
  if (!checkIn || !assessment) return <div className="p-8 text-center">Invalid report link.</div>;

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
