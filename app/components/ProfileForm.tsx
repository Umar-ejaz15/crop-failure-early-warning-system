'use client';

import { useState } from 'react';
import { User, MapPin, Ruler, Calendar, Save, X } from 'lucide-react';
import { FarmProfile } from '../types/crop';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileFormProps {
  initialData?: FarmProfile | null;
  onComplete: () => void;
}

export default function ProfileForm({ initialData, onComplete }: ProfileFormProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmerName: initialData?.farmerName || '',
    location: initialData?.location || '',
    fieldSize: initialData?.fieldSize?.toString() || '',
    sowingDate: initialData?.sowingDate ? new Date(initialData.sowingDate).toISOString().split('T')[0] : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fieldSize: formData.fieldSize ? parseFloat(formData.fieldSize) : null,
          sowingDate: formData.sowingDate ? new Date(formData.sowingDate).toISOString() : null
        })
      });

      if (res.ok) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 w-full max-w-lg mx-auto animate-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight">{t('dashboard.farmProfile')}</h2>
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
          <User className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-zinc-400 ml-1">{t('profile.farmerName')}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              required
              type="text"
              value={formData.farmerName}
              onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder={t('profile.namePlaceholder')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-zinc-400 ml-1">{t('profile.location')}</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder={t('profile.locationPlaceholder')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-400 ml-1">{t('profile.fieldSize')}</label>
            <div className="relative">
              <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="number"
                step="0.1"
                value={formData.fieldSize}
                onChange={(e) => setFormData({ ...formData, fieldSize: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
                placeholder="0.0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-400 ml-1">{t('profile.sowingDate')}</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="date"
                value={formData.sowingDate}
                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? t('common.loading') : (
            <>
              <Save className="w-5 h-5" />
              {t('profile.updateButton')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
