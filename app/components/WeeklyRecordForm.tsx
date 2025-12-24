
'use client';

import { useState } from 'react';
import { CloudRain, Droplets, Bug, FileText, Activity, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cropTypes, checkInQuestions } from '../data/cropData';

interface WeeklyRecordFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialCrop?: string;
}

export default function WeeklyRecordForm({ onSubmit, isLoading, initialCrop }: WeeklyRecordFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cropType: initialCrop || 'Wheat',
    rainfall: '', // Manual input
    irrigation: 'No',
    cropCondition: 'Good',
    pestSeen: false,
    notes: '',
    responses: {} as Record<string, string>
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        rainfall: parseFloat(formData.rainfall) || 0
    });
  };

  const handleResponseChange = (questionId: string, value: string) => {
      setFormData(prev => ({
          ...prev,
          responses: { ...prev.responses, [questionId]: value }
      }));
  };

  const questions = formData.cropType ? checkInQuestions[formData.cropType] : [];

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800 animate-fade-in">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        New Weekly Record
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Crop Selection */}
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Select Crop
            </label>
            <div className="flex gap-2 flex-wrap">
                {cropTypes.map(type => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, cropType: type, responses: {} })}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            formData.cropType === type 
                            ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                            : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>

        {/* Date */}
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Date of Record
            </label>
            <input
                type="date"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
        </div>

        {/* Rainfall */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-500" />
              Rainfall (mm)
            </div>
          </label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.rainfall}
            onChange={e => setFormData({ ...formData, rainfall: e.target.value })}
            placeholder="0"
          />
          <p className="text-xs text-zinc-500 mt-1">Leave 0 if no rain.</p>
        </div>

        {/* Irrigation */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              Irrigation Done?
            </div>
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.irrigation}
            onChange={e => setFormData({ ...formData, irrigation: e.target.value })}
          >
            <option value="No">No</option>
            <option value="Yes - Light">Yes - Light</option>
            <option value="Yes - Heavy">Yes - Heavy</option>
            <option value="Flooding">Flooding</option>
          </select>
        </div>

        {/* Crop Condition */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Crop Condition
            </div>
          </label>
          <div className="flex gap-2">
            {['Good', 'Average', 'Poor'].map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => setFormData({ ...formData, cropCondition: condition })}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  formData.cropCondition === condition
                    ? condition === 'Good' ? 'bg-green-100 border-green-500 text-green-700' :
                      condition === 'Average' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' :
                      'bg-red-100 border-red-500 text-red-700'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Pests */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-red-500" />
              Pest/Disease Seen?
            </div>
          </label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pest"
                checked={!formData.pestSeen}
                onChange={() => setFormData({ ...formData, pestSeen: false })}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-zinc-700 dark:text-zinc-300">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pest"
                checked={formData.pestSeen}
                onChange={() => setFormData({ ...formData, pestSeen: true })}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <span className="text-zinc-700 dark:text-zinc-300">Yes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Dynamic Crop Questions */}
      {questions && questions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Quick Health Checks
              </h4>
              <div className="space-y-4">
                  {questions.map((q) => (
                      <div key={q.id} className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-3">
                              {q.question}
                          </p>
                          <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                      type="radio" 
                                      name={q.id}
                                      value="No"
                                      className="text-green-600 focus:ring-green-500"
                                      onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                  />
                                  <span className="text-sm">No</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                      type="radio" 
                                      name={q.id}
                                      value="Yes"
                                      className="text-red-600 focus:ring-red-500"
                                      onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                  />
                                  <span className="text-sm text-red-600 font-medium">Yes</span>
                              </label>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            Notes (Optional)
          </div>
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
          placeholder="Any other observations..."
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Saving...' : 'Save Weekly Record'}
      </button>
    </form>
  );
}
