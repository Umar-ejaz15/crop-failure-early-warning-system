
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
    cropType: 'Wheat',
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
        {t('failure.title')}
      </h3>

      <div className="grid grid-cols-1 gap-6">
        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             {t('checkIn.selectCrop')}
           </label>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
             {['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane'].map(crop => (
               <button
                 key={crop}
                 type="button"
                 onClick={() => setFormData({ ...formData, cropType: crop })}
                 className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                   formData.cropType === crop
                   ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20 scale-105'
                   : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-red-300'
                 }`}
               >
                 {t(`checkIn.crops.${crop}`)}
               </button>
             ))}
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             {t('failure.dateOfEvent')}
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
             {t('failure.primaryCause')}
           </label>
           <select
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-red-500"
             value={formData.failureType}
             onChange={e => setFormData({ ...formData, failureType: e.target.value })}
           >
             <option value="Drought">{t('failure.causes.drought')}</option>
             <option value="Heat">{t('failure.causes.heat')}</option>
             <option value="Pest">{t('failure.causes.pest')}</option>
             <option value="Flood">{t('failure.causes.flood')}</option>
             <option value="Other">{t('failure.causes.other')}</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             {t('failure.lossPercentage')}
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
             {t('failure.notes')}
           </label>
           <textarea
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-red-500 resize-none h-24"
             placeholder={t('failure.notesPlaceholder')}
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
        {isLoading ? t('common.loading') : t('failure.submitButton')}
      </button>
    </form>
  );
}
