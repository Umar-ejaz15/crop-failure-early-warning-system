
'use client';

import { useState } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FailureRecordFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function FailureRecordForm({ onSubmit, isLoading }: FailureRecordFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    failureType: 'Drought',
    lossPercentage: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        lossPercentage: parseFloat(formData.lossPercentage) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800 animate-fade-in border-l-8 border-l-red-500">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
        <XCircle className="w-5 h-5 text-red-500" />
        Record Crop Failure / Loss
      </h3>

      <div className="grid grid-cols-1 gap-6">
        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             Date of Event
           </label>
           <input
             type="date"
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-red-500"
             value={formData.date}
             onChange={e => setFormData({ ...formData, date: e.target.value })}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             Primary Cause
           </label>
           <select
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-red-500"
             value={formData.failureType}
             onChange={e => setFormData({ ...formData, failureType: e.target.value })}
           >
             <option value="Drought">Drought (Low Rainfall)</option>
             <option value="Heat">Heat Stress</option>
             <option value="Pest">Pest / Disease</option>
             <option value="Flood">Flood / Heavy Rain</option>
             <option value="Other">Other</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             Estimated Loss (%)
           </label>
           <input
             type="number"
             min="0"
             max="100"
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-red-500"
             placeholder="e.g. 50"
             value={formData.lossPercentage}
             onChange={e => setFormData({ ...formData, lossPercentage: e.target.value })}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             Notes / Lessons Learned
           </label>
           <textarea
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-red-500 resize-none h-24"
             placeholder="What went wrong? How to prevent next time?"
             value={formData.notes}
             onChange={e => setFormData({ ...formData, notes: e.target.value })}
           />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Saving...' : 'Record Failure'}
      </button>
    </form>
  );
}
