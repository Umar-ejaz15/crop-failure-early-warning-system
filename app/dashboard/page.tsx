'use client';

import { useState, useEffect } from 'react';
import { Sprout, BarChart3, CloudRain, Calendar, AlertTriangle, History as HistoryIcon, Plus, User } from 'lucide-react';
import ProfileForm from '../components/ProfileForm';
import WeeklyRecordForm from '../components/WeeklyRecordForm';
import MonthlyRecordForm from '../components/MonthlyRecordForm';
import FailureRecordForm from '../components/FailureRecordForm';
import RiskDashboard from '../components/RiskDashboard'; // Reusing for visuals
import { FarmProfile, WeeklyRecord, MonthlyRecord } from '../types/crop';
import { checkInQuestions } from '../data/cropData';
import { analyzeCropRisk } from '../utils/simpleRiskEngine';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'monthly' | 'history'>('overview');
  const [showForm, setShowForm] = useState<'weekly' | 'monthly' | 'failure' | null>(null);

  // Data State
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([]);
  const [lastRecord, setLastRecord] = useState<WeeklyRecord | null>(null);
  const [mockWeather, setMockWeather] = useState({ temp: 28 }); // Simulating system data

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (profileId: string) => {
    try {
      const res = await fetch(`/api/records/weekly?profileId=${profileId}`);
      if (res.ok) {
        const data = await res.json();
        // Parse responses if they exist as string
        const parsedRecords = data.records.map((r: any) => ({
             ...r,
             responses: typeof r.responses === 'string' ? JSON.parse(r.responses) : r.responses
        }));
        setWeeklyRecords(parsedRecords);
        if (parsedRecords.length > 0) {
            setLastRecord(parsedRecords[0]);
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
        fetchRecords(profile.id);
    }
  }, [profile]);

  const handleProfileComplete = () => {
    fetchProfile();
  };

  const handleWeeklySubmit = async (data: any) => {
    if (!profile) return;
    
    // Updated Logic: Use Combined Simple Risk Engine
    const assessment = analyzeCropRisk({
        rainfall: data.rainfall,
        irrigation: data.irrigation,
        cropCondition: data.cropCondition,
        pstSeen: data.pestSeen,
        temp: mockWeather.temp,
        responses: data.responses,
        questions: checkInQuestions[profile.cropType] || []
    });

    const payload = {
        ...data,
        riskScore: assessment.score,
        riskLevel: assessment.level,
        alerts: assessment.alerts,
        suggestions: assessment.actions,
        profileId: profile.id,
        avgTemp: mockWeather.temp,
        responses: JSON.stringify(data.responses), 
    };

    try {
        const res = await fetch('/api/records/weekly', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            setShowForm(null);
            fetchRecords(profile.id); // Refresh
        }
    } catch (e) { console.error(e); }
  };

  const handleMonthlySubmit = async (data: any) => {
      if (!profile) return;
      try {
        const res = await fetch('/api/records/monthly', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...data, profileId: profile.id })
        });
        if (res.ok) setShowForm(null);
      } catch (e) { console.error(e); }
  };

  const handleFailureSubmit = async (data: any) => {
      if (!profile) return;
      try {
        const res = await fetch('/api/records/failure', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...data, profileId: profile.id })
        });
        if (res.ok) setShowForm(null);
      } catch (e) { console.error(e); }
  };

  // Adapter for RiskVisuals
  // Maps new WeeklyRecord -> Old WeeklyCheckIn format expected by RiskDashboard
  const historyAdapter = weeklyRecords.map(record => ({
      id: record.id,
      date: record.date.toString(), // Ensure string date
      riskScore: record.riskScore,
      riskLevel: record.riskLevel, 
      // Mapping flat weather data to nested object
      weatherConditions: {
          avgTemp: record.avgTemp || 0,
          rainfall: record.rainfall || 0,
          humidity: 0 // Placeholder
      },
      // Mapping flat inputs to questions/responses structure if needed, 
      // but simplistic mapping is enough for charts usually.
      responses: typeof record.responses === 'string' ? JSON.parse(record.responses || '{}') : record.responses,
      factors: {
          // Approximate factors from raw data for charts
          water: record.rainfall < 10 ? 8 : 2,
          pest: record.pestSeen ? 7 : 1,
          weather: record.avgTemp && record.avgTemp > 35 ? 7 : 2
      }
  }));

  // Convert WeeklyRecord to RiskAssessment for visuals
  const currentRiskAssessment = lastRecord ? {
      overallRisk: lastRecord.riskScore,
      riskLevel: lastRecord.riskLevel.toLowerCase() as any,
      factors: {
          water: lastRecord.rainfall < 10 ? 8 : 2,
          pest: lastRecord.pestSeen ? 7 : 1,
          weather: lastRecord.avgTemp && lastRecord.avgTemp > 35 ? 7 : 3,
          growth: lastRecord.cropCondition === 'Poor' ? 9 : lastRecord.cropCondition === 'Average' ? 5 : 1,
          disease: 0,
          nutrient: 0
      },
      alerts: (lastRecord.alerts as unknown as any[]) || [],
      recommendations: (lastRecord.suggestions as unknown as string[]) || []
  } : null;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-green-600">Loading Farm Data...</div>;

  if (!profile) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
            <ProfileForm onComplete={handleProfileComplete} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{profile.farmerName}'s Farm</h1>
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                    <Sprout className="w-3 h-3" /> {profile.cropType} 
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    {profile.location}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setProfile(null)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Switch Farm
                </button>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Active
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-8">
        
        {/* Current Status Overview */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
                {lastRecord ? (
                    <RiskDashboard 
                        assessment={currentRiskAssessment} 
                        cropType={profile.cropType} 
                        currentStage="Current" 
                        checkInHistory={historyAdapter as any[]} 
                    />
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CloudRain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Records Yet</h3>
                        <p className="text-zinc-500 mb-6">Start by adding your first weekly record to get a risk assessment.</p>
                        <button 
                            onClick={() => setShowForm('weekly')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Add Weekly Record
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Forms Modal Overlay */}
        {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                    <button 
                        onClick={() => setShowForm(null)}
                        className="absolute top-4 right-4 z-10 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg"
                    >
                        ✕
                    </button>
                    {showForm === 'weekly' && (
                        <WeeklyRecordForm 
                            onSubmit={handleWeeklySubmit} 
                            cropType={profile.cropType} 
                        />
                    )}
                    {showForm === 'monthly' && <MonthlyRecordForm onSubmit={handleMonthlySubmit} />}
                    {showForm === 'failure' && <FailureRecordForm onSubmit={handleFailureSubmit} />}
                </div>
            </div>
        )}

      </div>

      {/* Mobile-Friendly Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 pb-6 z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto max-w-lg flex justify-between items-center px-4">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`}
            >
                <BarChart3 className="w-6 h-6" />
                <span className="text-xs font-medium">Status</span>
            </button>

            <div className="relative -top-8">
                <button 
                    onClick={() => setShowForm('weekly')}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 hover:scale-110 transition-transform"
                >
                    <Plus className="w-8 h-8" />
                </button>
            </div>

            <button 
                onClick={() => setShowForm('monthly')}
                className={`flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600`}
            >
                <Calendar className="w-6 h-6" />
                <span className="text-xs font-medium">Monthly</span>
            </button>
        </div>
      </div>
    </div>
  );
}
