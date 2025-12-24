'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, BarChart3, CloudRain, Calendar, AlertTriangle, History as HistoryIcon, Plus, User } from 'lucide-react';
import ProfileForm from '../components/ProfileForm';
import WeeklyRecordForm from '../components/WeeklyRecordForm';
import FailureRecordForm from '../components/FailureRecordForm';
import RiskDashboard from '../components/RiskDashboard'; // Reusing for visuals
import { FarmProfile, WeeklyRecord } from '../types/crop';
import { checkInQuestions } from '../data/cropData';
import { analyzeCropRisk } from '../utils/simpleRiskEngine';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [showForm, setShowForm] = useState<'weekly' | 'failure' | null>(null);

  // Data State
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [mockWeather, setMockWeather] = useState({ temp: 28 }); // Simulating system data

  const lastRecord = weeklyRecords.length > 0 ? weeklyRecords[0] : null;
  const viewRecord = selectedRecordId ? weeklyRecords.find(r => r.id === selectedRecordId) : lastRecord;

  const fetchProfile = async () => {
    try {
      setSyncError(null);
      const res = await fetch('/api/profile');
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Critical Sync Error - Received non-JSON response:", text.substring(0, 100));
          setSyncError(`System Error: Expected JSON but received ${res.status} ${res.statusText}. Please check Server Logs.`);
          setLoading(false);
          return;
      }

      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
      } else {
        setSyncError(data.error || 'Server rejected synchronization');
      }
    } catch (e: any) {
      console.error("Fetch Profile Error:", e);
      setSyncError(e.message || 'Network connection error');
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
            // No need to setLastRecord manually anymore as it's derived
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
    
    // Use cropType from form data
    const selectedCropType = data.cropType;

    // Updated Logic: Use Combined Simple Risk Engine
    const assessment = analyzeCropRisk({
        rainfall: data.rainfall,
        irrigation: data.irrigation,
        cropCondition: data.cropCondition,
        pstSeen: data.pestSeen,
        temp: mockWeather.temp,
        responses: data.responses,
        questions: checkInQuestions[selectedCropType] || []
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
        cropType: selectedCropType
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
      },
      cropType: record.cropType,
      currentStage: 'Historical'
  }));

  // Convert viewRecord to RiskAssessment for visuals
  const currentRiskAssessment = viewRecord ? {
      overallRisk: viewRecord.riskScore,
      riskLevel: viewRecord.riskLevel.toLowerCase() as any,
      factors: {
          water: viewRecord.rainfall < 10 ? 8 : 2,
          pest: viewRecord.pestSeen ? 7 : 1,
          weather: viewRecord.avgTemp && viewRecord.avgTemp > 35 ? 7 : 3,
          growth: viewRecord.cropCondition === 'Poor' ? 9 : viewRecord.cropCondition === 'Average' ? 5 : 1,
          disease: 0,
          nutrient: 0
      },
      alerts: (viewRecord.alerts as unknown as any[]) || [],
      recommendations: (viewRecord.suggestions as unknown as string[]) || []
  } : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-green-600 font-bold bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-4">
            <Sprout className="w-12 h-12 animate-bounce" />
            <p className="text-xl animate-pulse">Syncing Farmer Profile...</p>
        </div>
    </div>
  );

  if (!profile) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-black">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Profile Sync Failed</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    {syncError || "We couldn't initialize your farmer profile. Please try logging in again."}
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{profile.farmerName}'s Portfolio</h1>
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> Managed Records
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    {profile.location || 'Location Pending'}
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

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 sticky top-16 h-[calc(100vh-64px)]">
            <div className="space-y-1">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === 'overview' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                >
                    <BarChart3 className="w-5 h-5" />
                    Portfolio Status
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === 'history' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                >
                    <HistoryIcon className="w-5 h-5" />
                    Record History
                </button>
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                    onClick={() => setShowForm('weekly')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 hover:scale-[1.02] transition-transform"
                >
                    <Plus className="w-4 h-4" />
                    New Report
                </button>
            </div>
        </aside>

        <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        
        {/* Crop Portfolio Section */}
        {activeTab === 'overview' && !selectedRecordId && (
            <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">My Crop Portfolio</h2>
                    <p className="text-xs font-bold text-zinc-400">SELECT A CROP FOR DETAILS</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Wheat', 'Rice', 'Maize'].map((crop) => {
                        const count = weeklyRecords.filter(r => r.cropType === crop).length;
                        const latest = weeklyRecords.find(r => r.cropType === crop);
                        return (
                            <button 
                                key={crop}
                                onClick={() => router.push(`/dashboard/${crop.toLowerCase()}`)}
                                className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-green-500 transition-all text-left flex flex-col gap-4 group hover:-translate-y-1"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                                        <Sprout className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="text-xs font-black text-zinc-400 group-hover:text-green-600 transition-colors">VIEW ALL →</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{crop}</h3>
                                    <p className="text-sm text-zinc-500 font-medium">{count} Reports Filed</p>
                                </div>
                                {latest && (
                                    <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block self-start ${
                                        latest.riskLevel === 'Low' ? 'bg-green-100 text-green-600' :
                                        latest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                        Latest: {latest.riskLevel} Risk
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Current Status Overview */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
                {viewRecord ? (
                    <div className="space-y-4">
                        {selectedRecordId && (
                            <button 
                                onClick={() => setSelectedRecordId(null)}
                                className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:underline mb-2"
                            >
                                ← Back to Latest Status
                            </button>
                        )}
                        <RiskDashboard 
                            assessment={currentRiskAssessment} 
                            cropType={viewRecord?.cropType || 'Wheat'} 
                            currentStage={selectedRecordId ? "Historical View" : "Current Status"} 
                            checkInHistory={historyAdapter as any[]} 
                        />
                    </div>
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

        {/* History View */}
        {activeTab === 'history' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Crop History</h3>
                    <div className="text-sm text-zinc-500">{weeklyRecords.length} Records Found</div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {weeklyRecords.length > 0 ? (
                        weeklyRecords.map((record, index) => (
                            <div 
                                key={record.id} 
                                onClick={() => {
                                    setSelectedRecordId(record.id);
                                    setActiveTab('overview');
                                }}
                                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between hover:border-green-500 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${
                                        record.riskLevel === 'Low' ? 'bg-green-100 text-green-600' :
                                        record.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                            {record.cropType} - Week {weeklyRecords.length - index}
                                            <span className="text-xs font-normal text-zinc-400">
                                                {new Date(record.date).toLocaleDateString()}
                                            </span>
                                        </h4>
                                        <p className="text-sm text-zinc-500">Risk Score: {record.riskScore}/100</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                                    record.riskLevel === 'Low' ? 'bg-green-500/10 text-green-600' :
                                    record.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                                    'bg-red-500/10 text-red-600'
                                }`}>
                                    {record.riskLevel} Risk
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-zinc-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            No records found.
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Forms Modal Overlay */}
        {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                    <button 
                        onClick={() => setShowForm(null)}
                        className="absolute top-4 right-4 z-10 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        ✕
                    </button>
                    {showForm === 'weekly' && (
                        <WeeklyRecordForm 
                            onSubmit={handleWeeklySubmit} 
                            initialCrop={viewRecord?.cropType} 
                        />
                    )}
                    {showForm === 'failure' && <FailureRecordForm onSubmit={handleFailureSubmit} />}
                </div>
            </div>
        )}

            </div>
        </div>
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
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`}
            >
                <HistoryIcon className="w-6 h-6" />
                <span className="text-xs font-medium">History</span>
            </button>
        </div>
      </div>
    </div>
  );
}
