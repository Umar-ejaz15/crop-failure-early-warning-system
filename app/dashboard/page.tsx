'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// (Removed duplicate import of RiskDashboard)
// Simple modal component
function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-2xl">&times;</button>
        {children}
      </div>
    </div>
  );
}
import { ClipboardCheck, BarChart3, History } from 'lucide-react';
import WeeklyCheckInForm from "../components/WeeklyCheckInForm";
import RiskDashboard from "../components/RiskDashboard";
import { WeeklyCheckIn, RiskAssessment } from "../types/crop";
import { useLanguage } from '../contexts/LanguageContext';
import { checkInQuestions } from '../data/cropData';
import { calculateRiskScore } from '../utils/riskCalculator';

export default function DashboardPage() {
  const [currentCheckIn, setCurrentCheckIn] = useState<WeeklyCheckIn | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<RiskAssessment | null>(null);
  const [checkInHistory, setCheckInHistory] = useState<WeeklyCheckIn[]>([]);
  const [activeTab, setActiveTab] = useState<'checkin' | 'dashboard' | 'history'>('checkin');
  const [geminiSuggestions, setGeminiSuggestions] = useState<string>('');
  const { t } = useLanguage();
  const [selectedCheckIn, setSelectedCheckIn] = useState<WeeklyCheckIn | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  const [selectedGeminiSuggestions, setSelectedGeminiSuggestions] = useState<string>('');

  // Load history from DB when history tab is active
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/checkin');
      if (res.ok) {
        const data = await res.json();
        const history = data.map((item: any) => ({
          id: item.id,
          farmerId: item.farmerId,
          cropType: item.cropType,
          currentStage: item.currentStage,
          date: item.date,
          responses: item.responses,
          weatherConditions: {
            avgTemp: item.weather.avgTemp,
            rainfall: item.weather.rainfall,
            humidity: item.weather.humidity,
          },
          riskScore: item.riskScore,
          alerts: item.alerts,
        }));
        setCheckInHistory(history);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch('/api/checkin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCheckInHistory(checkInHistory.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const handleCheckInSubmit = async (checkIn: WeeklyCheckIn, assessment: RiskAssessment) => {
    // Recalculate assessment with historical data for better accuracy
    const enhancedAssessment = calculateRiskScore(
      checkIn.responses,
      checkInQuestions[checkIn.cropType] || [],
      checkIn.cropType,
      checkIn.currentStage,
      checkIn.weatherConditions,
      checkInHistory
    );

    setCurrentCheckIn(checkIn);
    setCurrentAssessment(enhancedAssessment);
    setActiveTab('dashboard');

    try {
      // Get AI suggestions first
      const geminiRes = await fetch('/api/gemini-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: checkIn.cropType,
          currentStage: checkIn.currentStage,
          responses: checkIn.responses,
          weatherData: checkIn.weatherConditions,
        }),
      });

      let suggestions = '';
      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        suggestions = geminiData.suggestions || '';
        setGeminiSuggestions(suggestions);
      }

      // Save check-in with suggestions
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn, assessment: enhancedAssessment, suggestions }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to save check-in:', errorData);
        throw new Error('Failed to save check-in');
      }

      // Reload history if we're on history tab
      if (activeTab === 'history') {
        loadHistory();
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
      // You might want to show a user-friendly error message here
    }

    // Auto-scroll to top after submit and tab switch
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'checkin'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            {t('nav.checkin') || 'Weekly Check-In'}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {t('dashboard.riskAssessment') || 'Risk Dashboard'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <History className="w-5 h-5" />
            {t('dashboard.checkInHistory') || 'History'}
          </button>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'checkin' && (
            <WeeklyCheckInForm onSubmit={handleCheckInSubmit} />
          )}

          {activeTab === 'dashboard' && (
            currentCheckIn && currentAssessment ? (
              <RiskDashboard
                assessment={currentAssessment}
                cropType={currentCheckIn.cropType}
                currentStage={currentCheckIn.currentStage}
                checkInHistory={checkInHistory}
                geminiSuggestions={geminiSuggestions}
              />
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-100 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-400">
                <div className="bg-zinc-100 dark:bg-zinc-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
                </div>
                <p className="text-lg font-medium">{t('dashboard.noAssessment')}</p>
                <p className="text-sm mt-1">{t('dashboard.completeCheckIn')}</p>
              </div>
            )
          )}

          {activeTab === 'history' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                {t('dashboard.checkInHistory') || 'Check-In History'}
              </h2>
              {checkInHistory.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                  <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <p className="text-lg font-medium">{t('dashboard.noAssessment')}</p>
                  <p className="text-sm mt-1">{t('dashboard.completeCheckIn')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {checkInHistory.map((checkIn) => (
                    <div key={checkIn.id} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/report/${checkIn.id}`}
                          className="flex-1 text-left hover:bg-green-50 dark:hover:bg-zinc-800 rounded-lg p-2 -m-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {checkIn.cropType} - {checkIn.currentStage}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {new Date(checkIn.date).toLocaleDateString()}
                          </p>
                        </Link>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {checkIn.riskScore.toFixed(1)}
                          </div>
                          <button
                            onClick={() => handleDeleteHistory(checkIn.id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
