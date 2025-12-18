
'use client';

import { useState } from 'react';
import { Calendar, Sprout, TrendingUp, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MonthlyRecordFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function MonthlyRecordForm({ onSubmit, isLoading }: MonthlyRecordFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    monthDate: new Date().toISOString().split('T')[0],
    growthStage: 'Vegetative',
    fertilizer: '',
    yieldExpected: '',
    lossesFaced: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        yieldExpected: parseFloat(formData.yieldExpected) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800 animate-fade-in">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-purple-500" />
        New Monthly Record
      </h3>

      <div className="grid grid-cols-1 gap-6">
        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             Record Date
           </label>
           <input
             type="date"
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-purple-500"
             value={formData.monthDate}
             onChange={e => setFormData({ ...formData, monthDate: e.target.value })}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-green-500" />
                Current Growth Stage
             </div>
           </label>
           <select
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-purple-500"
             value={formData.growthStage}
             onChange={e => setFormData({ ...formData, growthStage: e.target.value })}
           >
             <option value="Germination">Germination</option>
             <option value="Vegetative">Vegetative</option>
             <option value="Flowering">Flowering</option>
             <option value="Grain Filling">Grain Filling / Fruiting</option>
             <option value="Maturity">Maturity</option>
             <option value="Harvest">Harvested</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             Input Applied (Fertilizer/Pesticide)
           </label>
           <input
             type="text"
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-purple-500"
             placeholder="e.g. Urea 50kg, DAP 20kg"
             value={formData.fertilizer}
             onChange={e => setFormData({ ...formData, fertilizer: e.target.value })}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Expected Yield (Quintals/Acre)
             </div>
           </label>
           <input
             type="number"
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-purple-500"
             placeholder="0"
             value={formData.yieldExpected}
             onChange={e => setFormData({ ...formData, yieldExpected: e.target.value })}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
             <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500" />
                Any Losses Faced (Optional)
             </div>
           </label>
           <textarea
             className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
             placeholder="Describe any significant loss events..."
             value={formData.lossesFaced}
             onChange={e => setFormData({ ...formData, lossesFaced: e.target.value })}
           />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Saving...' : 'Save Monthly Record'}
      </button>
    </form>
  );
}
