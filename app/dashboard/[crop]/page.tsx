'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sprout, Calendar, ArrowLeft, Activity, Info, TrendingUp, History as HistoryIcon } from 'lucide-react';
import RiskDashboard from '../../components/RiskDashboard';
import { FarmProfile, WeeklyRecord } from '../../types/crop';
import { analyzeCropRisk } from '../../utils/simpleRiskEngine';
import { checkInQuestions } from '../../data/cropData';

export default function CropDashboard() {
  const params = useParams();
  const router = useRouter();
  const cropType = params.crop as string;
  const decodedCrop = decodeURIComponent(cropType);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  const cropRecords = weeklyRecords.filter(r => r.cropType.toLowerCase() === decodedCrop.toLowerCase());
  const latestRecord = cropRecords.length > 0 ? cropRecords[0] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const prof = profileData.profile;
          setProfile(prof);

          if (prof) {
            const recordsRes = await fetch(`/api/records/weekly?profileId=${prof.id}`);
            if (recordsRes.ok) {
              const recordsData = await recordsRes.json();
              console.log(`Fetched ${recordsData.records.length} total records for ${decodedCrop}`);
              setWeeklyRecords(recordsData.records);
            }
          }
        }
      } catch (e) {
        console.error("Fetch Data Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decodedCrop]); // Refetch if crop type changes in URL

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <Sprout className="w-12 h-12 text-green-600 animate-bounce" />
        <p className="text-xl font-bold text-zinc-600 dark:text-zinc-400">Loading {decodedCrop} Analytics...</p>
      </div>
    </div>
  );

  const historyAdapter = cropRecords.map(record => ({
    id: record.id,
    date: record.date.toString(),
    riskScore: record.riskScore,
    riskLevel: record.riskLevel,
    weatherConditions: {
        avgTemp: record.avgTemp || 0,
        rainfall: record.rainfall || 0,
        humidity: 0
    },
    responses: typeof record.responses === 'string' ? JSON.parse(record.responses || '{}') : record.responses,
    factors: {
        water: record.rainfall < 10 ? 8 : 2,
        pest: record.pestSeen ? 7 : 1,
        weather: record.avgTemp && record.avgTemp > 35 ? 7 : 2
    },
    cropType: record.cropType,
    currentStage: 'Historical'
  }));

  const currentRiskAssessment = latestRecord ? {
    overallRisk: latestRecord.riskScore,
    riskLevel: latestRecord.riskLevel.toLowerCase() as any,
    factors: {
        water: latestRecord.rainfall < 10 ? 8 : 2,
        pest: latestRecord.pestSeen ? 7 : 1,
        weather: latestRecord.avgTemp && latestRecord.avgTemp > 35 ? 7 : 3,
        growth: latestRecord.cropCondition === 'Poor' ? 9 : latestRecord.cropCondition === 'Average' ? 5 : 1,
        disease: 0,
        nutrient: 0
    },
    alerts: (latestRecord.alerts as any) || [],
    recommendations: (latestRecord.suggestions as any) || []
  } : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        {decodedCrop} <span className="text-green-600">Analytics</span>
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium">Detailed Monitoring Portfolio</p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-green-200 dark:border-green-800">
                    Active Monitoring
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Stats */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Crop Metadata</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-sm">Total Reports</span>
                            <span className="font-bold">{cropRecords.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-sm">Latest Status</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                latestRecord?.riskLevel === 'Low' ? 'bg-green-100 text-green-600' : 
                                latestRecord?.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 
                                'bg-red-100 text-red-600'
                            }`}>
                                {latestRecord?.riskLevel || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                            activeTab === 'overview' 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-green-500'
                        }`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        Status Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                            activeTab === 'history' 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-green-500'
                        }`}
                    >
                        <HistoryIcon className="w-5 h-5" />
                        Historical Logs
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {latestRecord ? (
                            <>
                                <RiskDashboard 
                                    assessment={currentRiskAssessment} 
                                    cropType={decodedCrop} 
                                    currentStage="Monitoring" 
                                    checkInHistory={historyAdapter as any[]} 
                                />

                                {/* Weekly Progress Timeline */}
                                <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black uppercase tracking-tight">Weekly Health Timeline</h3>
                                        <span className="text-xs font-bold text-zinc-400">PROGRESSION FLOW</span>
                                    </div>

                                    <div className="relative">
                                        {/* Vertical Line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800 hidden md:block" />

                                        <div className="space-y-8">
                                            {cropRecords.map((record, index) => (
                                                <div key={record.id} className="relative md:pl-16 group">
                                                    {/* Timeline Bullet */}
                                                    <div className={`absolute left-0 top-1.5 w-12 h-12 rounded-2xl hidden md:flex items-center justify-center font-black text-xs z-10 transition-transform group-hover:scale-110 ${
                                                        record.riskLevel === 'Low' ? 'bg-green-100 text-green-600 border-2 border-green-200' :
                                                        record.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-200' :
                                                        'bg-red-100 text-red-600 border-2 border-red-200'
                                                    }`}>
                                                        W{cropRecords.length - index}
                                                    </div>

                                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-transparent hover:border-green-500/30 transition-all">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                                        {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                                                         record.riskLevel === 'Low' ? 'bg-green-500/10 text-green-600' :
                                                                         record.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                                                                         'bg-red-500/10 text-red-600'
                                                                    }`}>
                                                                        {record.riskLevel} Risk
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                                                                    Crop condition was <span className={
                                                                        record.cropCondition === 'Good' ? 'text-green-600' :
                                                                        record.cropCondition === 'Average' ? 'text-yellow-600' :
                                                                        'text-red-600'
                                                                    }>{record.cropCondition}</span>
                                                                </h4>
                                                                <p className="text-sm text-zinc-500 mt-2 line-clamp-1 italic">
                                                                    "{record.notes || 'No observation notes recorded for this week.'}"
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <div className="text-center">
                                                                    <span className="block text-[10px] font-black text-zinc-400 uppercase">Rain</span>
                                                                    <span className="text-sm font-bold">{record.rainfall}mm</span>
                                                                </div>
                                                                <div className="text-center border-l border-zinc-200 dark:border-zinc-700 pl-4">
                                                                    <span className="block text-[10px] font-black text-zinc-400 uppercase">Temp</span>
                                                                    <span className="text-sm font-bold text-orange-500">{record.avgTemp}°C</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-[40px] p-20 text-center">
                                <Activity className="w-16 h-16 text-zinc-300 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold mb-2">No Records for {decodedCrop}</h2>
                                <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                                    You haven't submitted any weekly reports for this crop yet.
                                </p>
                                <button 
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black uppercase tracking-tight">{decodedCrop} Historical Logs</h3>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{cropRecords.length} Entries Recorded</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {cropRecords.map((record, index) => (
                                <div key={record.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-green-500 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
                                            record.riskLevel === 'Low' ? 'bg-green-100 text-green-600' :
                                            record.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {record.riskScore}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Report Week {cropRecords.length - index}</h4>
                                            <p className="text-sm text-zinc-500 flex items-center gap-2 font-medium">
                                                <Calendar className="w-3 h-3" /> {new Date(record.date).toLocaleDateString()}
                                                <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                                                {record.cropCondition} Condition
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            record.riskLevel === 'Low' ? 'bg-green-50 text-green-600 border border-green-200' :
                                            record.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                                            'bg-red-50 text-red-600 border border-red-200'
                                        }`}>
                                            {record.riskLevel} Risk
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
