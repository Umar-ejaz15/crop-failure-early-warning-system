'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ClipboardCheck, Search, Filter, Calendar, AlertTriangle, ChevronRight, Plus } from 'lucide-react';
import { WeeklyRecord } from '../types/crop';
import Link from 'next/link';

export default function ReportPage() {
    const { t } = useLanguage();
    const [records, setRecords] = useState<WeeklyRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCrop, setFilterCrop] = useState('All');

    useEffect(() => {
        async function fetchRecords() {
            try {
                // Fetch profile first to get profileId
                const profileRes = await fetch('/api/profile');
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData?.id) {
                        const recordsRes = await fetch(`/api/records/weekly?profileId=${profileData.id}`);
                        if (recordsRes.ok) {
                            const data = await recordsRes.json();
                            setRecords(data);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchRecords();
    }, []);

    const filteredRecords = records.filter(r => {
        const matchesSearch = r.cropType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCrop === 'All' || r.cropType === filterCrop;
        return matchesSearch && matchesFilter;
    });

    const cropTypes = ['All', ...Array.from(new Set(records.map(r => r.cropType)))];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                                {t('nav.report')}
                            </h1>
                            <p className="text-zinc-500 font-medium">
                                Audit and monitor all field observations from one central hub.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link 
                                href="/dashboard?tab=overview&form=weekly"
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                {t('checkIn.newRecord')}
                            </Link>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                                type="text"
                                placeholder="Search by crop type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {cropTypes.map(crop => (
                                <button
                                    key={crop}
                                    onClick={() => setFilterCrop(crop)}
                                    className={`px-6 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                                        filterCrop === crop 
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' 
                                        : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                    }`}
                                >
                                    {crop === 'All' ? t('common.all') : t(`checkIn.crops.${crop}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Records List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('common.loading')}</p>
                            </div>
                        ) : filteredRecords.length > 0 ? (
                            filteredRecords.map((record, index) => (
                                <Link 
                                    key={record.id}
                                    href={`/dashboard/${record.cropType.toLowerCase()}`}
                                    className="block bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-green-500 dark:hover:border-green-500/50 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg ${
                                                record.riskLevel === 'Low' ? 'bg-green-100 text-green-600' :
                                                record.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                <ClipboardCheck className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-black">{t(`checkIn.crops.${record.cropType}`)}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                        record.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                                                        record.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {t('dashboard.riskLevel').replace('{level}', record.riskLevel)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                                    <div>{t('dashboard.reportNumber').replace('{number}', (records.length - index).toString())}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs font-black text-zinc-400 uppercase mb-1">{t('dashboard.healthIndex')}</div>
                                                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                                                    {(10 - record.riskScore).toFixed(1)}/10
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <ChevronRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <AlertTriangle className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold">{t('common.noData')}</h3>
                                <p className="text-zinc-500 mt-2">No field reports found matching your search.</p>
                                <Link 
                                    href="/dashboard?tab=overview&form=weekly"
                                    className="inline-block mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-2xl hover:scale-105 transition-transform"
                                >
                                    {t('dashboard.addInitialReport')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
