'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sprout, BarChart3, CloudRain, Calendar, AlertTriangle, History as HistoryIcon, Plus, User, CheckCircle, Shield, ArrowLeft } from 'lucide-react';
import ProfileForm from '../components/ProfileForm';
import WeeklyRecordForm from '../components/WeeklyRecordForm';
import FailureRecordForm from '../components/FailureRecordForm';
import RiskDashboard from '../components/RiskDashboard'; // Reusing for visuals
import { FarmProfile, WeeklyRecord } from '../types/crop';
import { checkInQuestions } from '../data/cropData';
import { analyzeCropRisk } from '../utils/simpleRiskEngine';
import { useLanguage } from '../contexts/LanguageContext';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black uppercase tracking-widest text-zinc-400">Initializing Engine...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'outlook' | 'history' | 'alerts' | 'settings'>('overview');
  const [outlookCrop, setOutlookCrop] = useState<string>('Wheat');
  const [showForm, setShowForm] = useState<'weekly' | 'failure' | 'profile' | null>(null);

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

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const formParam = searchParams.get('form');

    if (tabParam === 'overview' || tabParam === 'outlook' || tabParam === 'history' || tabParam === 'alerts') {
      setActiveTab(tabParam as any);
    }
    
    if (formParam === 'weekly') setShowForm('weekly');
    if (formParam === 'failure') setShowForm('failure');
    if (formParam === 'profile') setShowForm('profile');
  }, [searchParams]);

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

  const outlookRecord = weeklyRecords.find(r => r.cropType.toLowerCase() === outlookCrop.toLowerCase());
  const outlookRiskAssessment = outlookRecord ? {
      overallRisk: outlookRecord.riskScore,
      riskLevel: outlookRecord.riskLevel.toLowerCase() as any,
      factors: {
          water: outlookRecord.rainfall < 10 ? 8 : 2,
          pest: outlookRecord.pestSeen ? 7 : 1,
          weather: outlookRecord.avgTemp && outlookRecord.avgTemp > 35 ? 7 : 3,
          growth: outlookRecord.cropCondition === 'Poor' ? 9 : outlookRecord.cropCondition === 'Average' ? 5 : 1,
          disease: 0,
          nutrient: 0
      },
      alerts: (outlookRecord.alerts as unknown as any[]) || [],
      recommendations: (outlookRecord.suggestions as unknown as string[]) || []
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
      {/* Header - Sits below main Navigation */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{profile.farmerName}'s {t('nav.portfolio')}</h1>
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> {t('dashboard.managedRecords')}
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    {profile.location || t('common.noData')}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowForm('profile')}
                  className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
                >
                  {t('dashboard.editProfile')}
                </button>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {t('common.active')}
                </div>
            </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar - Sits below both headers */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 sticky top-[128px] h-[calc(100vh-128px)] overflow-y-auto">
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
                    {t('nav.dashboard')}
                </button>
                <button 
                    onClick={() => setActiveTab('outlook')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === 'outlook' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                >
                    <CloudRain className="w-5 h-5" />
                    {t('dashboard.cropOutlook')}
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
                    {t('dashboard.checkInHistory')}
                </button>
                <button 
                    onClick={() => setActiveTab('alerts')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === 'alerts' 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                >
                    <AlertTriangle className="w-5 h-5" />
                    {t('dashboard.criticalAlerts')}
                </button>
                <div className="pt-4 pb-2 px-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('dashboard.management')}</p>
                </div>
                <button 
                    onClick={() => setShowForm('profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    <User className="w-5 h-5" />
                    {t('dashboard.farmProfile')}
                </button>
            </div>

            <div className="mt-auto pt-6 space-y-3">
                <button 
                    onClick={() => setShowForm('weekly')}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 hover:scale-[1.02] transition-transform"
                >
                    <Plus className="w-4 h-4" />
                    New Record
                </button>
                <button 
                    onClick={() => setShowForm('failure')}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold py-3 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Report Failure
                </button>
            </div>
        </aside>

        <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        
        {/* Simplified Dashboard Overview */}
        {activeTab === 'overview' && !selectedRecordId && (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Welcome & Quick Stats */}
                <div className="bg-linear-to-br from-green-600 to-emerald-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-2">Welcome, {profile.farmerName}</h2>
                        <p className="text-green-100 mb-6 max-w-md opacity-90">Your farm is growing. Keep updating your records to get the most accurate failure predictions and crop health insights.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowForm('weekly')}
                                className="bg-white text-green-700 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform"
                            >
                                START NEW REPORT
                            </button>
                            <div className="bg-green-500/30 backdrop-blur-md border border-white/20 px-6 py-2 rounded-2xl">
                                <span className="block text-[10px] font-black uppercase opacity-60">Success Rate</span>
                                <span className="text-xl font-bold">92%</span>
                            </div>
                        </div>
                    </div>
                    <Sprout className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
                </div>

                {/* My Crops Cards */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">My Active Crops</h2>
                        <button className="text-sm font-bold text-green-600 hover:underline">UPDATE ALL</button>
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
                                        <span className="text-xs font-black text-zinc-400 group-hover:text-green-600 transition-colors uppercase">Details →</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{crop}</h3>
                                        <p className="text-sm text-zinc-500 font-medium">{count || 'No'} Reports</p>
                                    </div>
                                    {latest ? (
                                        <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block self-start ${
                                            latest.riskLevel === 'Low' ? 'bg-green-100 text-green-600' :
                                            latest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {latest.riskLevel} Risk
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-[10px] font-black text-zinc-300 uppercase">Waitng for data</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity Mini-list */}
                <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-wider">Recent Reports</h3>
                    <div className="space-y-4">
                        {weeklyRecords.slice(0, 5).map((record) => (
                            <div key={record.id} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        record.riskLevel === 'Low' ? 'bg-green-500' :
                                        record.riskLevel === 'Medium' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`} />
                                    <span className="font-bold text-sm">{record.cropType} Update</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-zinc-400">{new Date(record.date).toLocaleDateString()}</span>
                                    <button 
                                        onClick={() => router.push(`/dashboard/${record.cropType.toLowerCase()}`)}
                                        className="text-[10px] font-black uppercase text-green-600 hover:underline"
                                    >
                                        VIEW DASHBOARD
                                    </button>
                                </div>
                            </div>
                        ))}
                        {weeklyRecords.length === 0 && <p className="text-sm text-zinc-500">No records recently filed. Start by adding a new report.</p>}
                    </div>
                </div>
            </div>
        )}
        
        {/* Individual Record View */}
        {activeTab === 'overview' && selectedRecordId && viewRecord && (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => setSelectedRecordId(null)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold transition-colors uppercase tracking-widest text-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('dashboard.backToPortfolio')}
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('dashboard.reportDate')}:</span>
                        <span className="text-sm font-black">{new Date(viewRecord.date).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-red-600 rounded-full" />
                            <div>
                                <h3 className="font-black uppercase tracking-tight text-lg">{t('dashboard.detailedAnalysis')}</h3>
                                <p className="text-xs font-bold text-zinc-400">CROP: <span className="text-green-600">{viewRecord.cropType.toUpperCase()}</span></p>
                            </div>
                        </div>
                     </div>
                     <RiskDashboard 
                        assessment={currentRiskAssessment} 
                        cropType={viewRecord.cropType} 
                        currentStage="Manual Inspection" 
                        checkInHistory={historyAdapter.filter(h => h.cropType === viewRecord.cropType) as any[]} 
                    />
                </div>
            </div>
        )}

        {/* Outlook / Whole Crop Dashboard */}
        {activeTab === 'outlook' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">Portfolio Outlook</h2>
                        <p className="text-zinc-500 text-sm">Aggregated health and risk analysis for your entire portfolio.</p>
                    </div>
                </div>

                {/* Aggregated Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Portfolio Health</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-green-600">
                                {weeklyRecords.length > 0 
                                    ? (10 - (weeklyRecords.reduce((acc, r) => acc + r.riskScore, 0) / weeklyRecords.length)).toFixed(1)
                                    : '0.0'}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">LIVE</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Risk Intensity</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-amber-500 uppercase">
                                {weeklyRecords.length > 0
                                    ? (weeklyRecords.reduce((acc, r) => acc + r.riskScore, 0) / weeklyRecords.length >= 7 ? 'High' : 
                                       weeklyRecords.reduce((acc, r) => acc + r.riskScore, 0) / weeklyRecords.length >= 4 ? 'Medium' : 'Low')
                                    : 'N/A'}
                            </span>
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">STABLE</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Water Reliability</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-blue-600">
                                {weeklyRecords.length > 0
                                    ? Math.round((weeklyRecords.filter(r => r.rainfall > 0 || r.irrigation.includes('Yes')).length / weeklyRecords.length) * 100)
                                    : '0'}%
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">CALC</span>
                        </div>
                    </div>
                </div>

                {/* System Summary Banner */}
                <div className="bg-linear-to-br from-green-600/10 to-emerald-600/10 border border-green-200 dark:border-green-800/50 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                     <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                         <Shield className="w-10 h-10 text-white" />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                         <h3 className="text-xl font-black uppercase tracking-tight mb-2">System Health Protocol</h3>
                         <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                             {weeklyRecords.length > 0 
                                ? `Portfolio analysis indicates a ${weeklyRecords.reduce((acc, r) => acc + r.riskScore, 0) / weeklyRecords.length > 5 ? 'STRESS' : 'HEALTHY'} state. Monitoring ${weeklyRecords.length} active indicators. Failure detection engine predicts stable output for the upcoming cycle.`
                                : "Awaiting initial report ingestion. Please file your first weekly update to activate the failure prediction engine."}
                         </p>
                     </div>
                     <div className="bg-white dark:bg-zinc-800 px-6 py-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 shadow-sm text-center min-w-[140px]">
                         <span className="text-[10px] font-black text-zinc-400 uppercase block mb-1">Failure Risk</span>
                         <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                             {weeklyRecords.length > 0 ? (weeklyRecords.filter(r => r.riskLevel !== 'Low').length / weeklyRecords.length * 100).toFixed(0) : '0'}%
                         </span>
                     </div>
                </div>

                {/* Crop Selection Cards for Outlook */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Deep Analytics Hub</h3>
                         <span className="text-[10px] font-black text-green-600 animate-pulse">LIVE SYSTEM FEED</span>
                    </div>
                   
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {['Wheat', 'Rice', 'Maize'].map((crop) => {
                            const isSelected = outlookCrop.toLowerCase() === crop.toLowerCase();
                            const cropRecordCount = weeklyRecords.filter(r => r.cropType.toLowerCase() === crop.toLowerCase()).length;
                            return (
                                <button
                                    key={crop}
                                    onClick={() => setOutlookCrop(crop)}
                                    className={`flex-none w-56 p-5 rounded-[32px] border transition-all text-left group relative overflow-hidden ${
                                        isSelected 
                                        ? 'bg-linear-to-br from-green-600 to-emerald-700 border-green-500 shadow-xl shadow-green-500/30 -translate-y-1' 
                                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-green-500/50 hover:-translate-y-1'
                                    }`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-white/20' : 'bg-green-50 dark:bg-green-900/10'}`}>
                                                <Sprout className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-green-600'}`} />
                                            </div>
                                            <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-zinc-900 dark:text-zinc-50'}`}>{crop}</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-green-100' : 'text-zinc-400'}`}>Data Points</p>
                                                <span className={`text-xl font-black ${isSelected ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>{cropRecordCount}</span>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-white/20 rounded-full p-1.5">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {isSelected && <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {outlookRecord ? (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                             <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-10 bg-green-600 rounded-full" />
                                    <div>
                                        <h3 className="font-black uppercase tracking-tight text-lg">{t('dashboard.predictiveAnalysis')}</h3>
                                        <p className="text-xs font-bold text-zinc-400">ANALYZING: <span className="text-green-600">{outlookCrop.toUpperCase()}</span> REPORT DATA</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-2xl">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('dashboard.liveEngineActive')}</span>
                                </div>
                             </div>
                             <RiskDashboard 
                                assessment={outlookRiskAssessment} 
                                cropType={outlookRecord.cropType} 
                                currentStage="Overall Dashboard" 
                                checkInHistory={historyAdapter as any[]} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <CloudRain className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">{t('dashboard.noRecordsFor').replace('{crop}', outlookCrop)}</h3>
                        <p className="text-zinc-500 mt-2">{t('dashboard.completeCheckIn')}</p>
                        <button 
                            onClick={() => setShowForm('weekly')}
                            className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-2xl hover:scale-105 transition-transform"
                        >
                            {t('dashboard.addInitialReport')}
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
            <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-black">{t('dashboard.criticalAlerts')}</h2>
                <div className="space-y-4">
                    {weeklyRecords.filter(r => r.riskLevel !== 'Low').length > 0 ? (
                        weeklyRecords.filter(r => r.riskLevel !== 'Low').map(r => (
                            <div key={r.id} className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-6 rounded-[32px] flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-red-900 dark:text-red-400">{t(`checkIn.crops.${r.cropType}`)} {t('dashboard.criticalAlerts')} - {r.riskLevel} Risk</h4>
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{t('dashboard.highStressDetected')}</p>
                                    <button 
                                        onClick={() => {
                                            setSelectedRecordId(r.id);
                                            setActiveTab('overview');
                                        }}
                                        className="mt-4 text-xs font-black uppercase text-red-600 underline transition-transform active:scale-95"
                                    >
                                        {t('dashboard.viewFullAssessment')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-12 rounded-[32px] text-center">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-green-900 dark:text-green-400">{t('dashboard.allClear')}</h3>
                            <p className="text-green-700 dark:text-green-300">{t('dashboard.noActiveAlerts')}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* History View */}
        {activeTab === 'history' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('dashboard.cropHistory')}</h3>
                    <div className="text-sm text-zinc-500">{t('dashboard.recordsFound').replace('{count}', weeklyRecords.length.toString())}</div>
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
                                            {t(`checkIn.crops.${record.cropType}`)} - {t('dashboard.week')} {weeklyRecords.length - index}
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
                    {showForm === 'profile' && <ProfileForm initialData={profile} onComplete={handleProfileComplete} />}
                </div>
            </div>
        )}

            </div>
        </div>
      </div>

      {/* Mobile-Friendly Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 pb-6 z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] md:hidden">
        <div className="container mx-auto max-w-lg flex justify-between items-center px-4">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`}
            >
                <BarChart3 className="w-5 h-5" />
                <span className="text-[10px] font-bold">Home</span>
            </button>

            <button 
                onClick={() => setActiveTab('outlook')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'outlook' ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`}
            >
                <CloudRain className="w-5 h-5" />
                <span className="text-[10px] font-bold">Outlook</span>
            </button>

            <div className="relative -top-8">
                <button 
                    onClick={() => setShowForm('weekly')}
                    className="bg-linear-to-r from-green-600 to-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 hover:scale-110 transition-transform"
                >
                    <Plus className="w-8 h-8" />
                </button>
            </div>

            <button 
                onClick={() => setActiveTab('alerts')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'alerts' ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`}
            >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-[10px] font-bold">Alerts</span>
            </button>

            <button 
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`}
            >
                <HistoryIcon className="w-5 h-5" />
                <span className="text-[10px] font-bold">History</span>
            </button>
        </div>
      </div>
    </div>
  );
}
