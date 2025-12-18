
'use client';

import { useState } from 'react';
import { Sprout, MapPin, Calendar, Ruler } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileFormProps {
  onComplete: () => void;
  initialData?: any;
}

export default function ProfileForm({ onComplete, initialData }: ProfileFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    farmerName: initialData?.farmerName || '',
    location: initialData?.location || '',
    cropType: initialData?.cropType || 'Wheat',
    fieldSize: initialData?.fieldSize || '',
    sowingDate: initialData?.sowingDate ? new Date(initialData.sowingDate).toISOString().split('T')[0] : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onComplete();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800 animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {initialData ? 'Edit Farm Profile' : 'Setup Your Farm Profile'}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Let's start by getting to know your farm.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Farmer Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            value={formData.farmerName}
            onChange={e => setFormData({ ...formData, farmerName: e.target.value })}
            placeholder="e.g. Rajesh Kumar"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              <div className="flex items-center gap-1">
                 <MapPin className="w-4 h-4 text-zinc-400" />
                 Location (Village/District)
              </div>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Ludhiana, Punjab"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
               <div className="flex items-center gap-1">
                 <Ruler className="w-4 h-4 text-zinc-400" />
                 Field Size (Acres)
               </div>
             </label>
            <input
              type="number"
              step="0.1"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={formData.fieldSize}
              onChange={e => setFormData({ ...formData, fieldSize: e.target.value })}
              placeholder="e.g. 2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Crop Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={formData.cropType}
              onChange={e => setFormData({ ...formData, cropType: e.target.value })}
            >
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-zinc-400" />
                Sowing Date
              </div>
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={formData.sowingDate}
              onChange={e => setFormData({ ...formData, sowingDate: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Saving Profile...' : initialData ? 'Update Profile' : 'Start Monitoring'}
        </button>
      </form>
    </div>
  );
}
