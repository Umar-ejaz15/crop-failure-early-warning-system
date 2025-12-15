'use client';

import { useState, useEffect } from 'react';
import { Thermometer, CloudRain, Wind, Sprout, Info } from 'lucide-react';
import { cropTypes, cropStages, checkInQuestions } from '../data/cropData';
import { calculateRiskScore, compareWithIdealConditions } from '../utils/riskCalculator';
import { WeeklyCheckIn, RiskAssessment } from '../types/crop';
import { useLanguage } from '../contexts/LanguageContext';

interface WeeklyCheckInFormProps {
  onSubmit: (checkIn: WeeklyCheckIn, assessment: RiskAssessment) => void;
}

export default function WeeklyCheckInForm({ onSubmit }: WeeklyCheckInFormProps) {
  const { t } = useLanguage();
  const [cropType, setCropType] = useState('Rice');
  const [currentStage, setCurrentStage] = useState('germination');
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [weatherData, setWeatherData] = useState({
    avgTemp: 25,
    rainfall: 0,
    humidity: 70
  });
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch current weather on mount
  useEffect(() => {
    async function fetchWeather() {
      setLoadingWeather(true);
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          const data = await res.json();
          setWeatherData({
            avgTemp: data.avgTemp ?? 25,
            rainfall: data.rainfall ?? 0,
            humidity: data.humidity ?? 70
          });
        }
      } catch {}
      setLoadingWeather(false);
    }
    fetchWeather();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate risk assessment with enhanced parameters
    const assessment = calculateRiskScore(responses, checkInQuestions, cropType, currentStage, weatherData);
    
    // Get current stage data
    const stageData = cropStages[cropType]?.find(s => s.id === currentStage);
    
    // Compare with ideal conditions
    if (stageData) {
      const { warnings, riskAdjustment } = compareWithIdealConditions(stageData, weatherData);
      
      // Adjust overall risk
      assessment.overallRisk += riskAdjustment;
      
      // Add weather warnings to alerts
      warnings.forEach(warning => {
        assessment.alerts.push({
          id: `weather-${Date.now()}-${Math.random()}`,
          severity: 'medium',
          category: 'weather',
          message: warning,
          action: 'Monitor conditions closely'
        });
      });
    }

    const checkIn: WeeklyCheckIn = {
      id: `checkin-${Date.now()}`,
      farmerId: 'farmer-1', // In real app, this would come from auth
      cropType,
      currentStage,
      date: new Date().toISOString(),
      responses,
      weatherConditions: weatherData,
      riskScore: assessment.overallRisk,
      alerts: assessment.alerts
    };

    onSubmit(checkIn, assessment);
  };

  const handleResponseChange = (questionId: string, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const stages = cropStages[cropType] || [];
  const currentStageData = stages.find(s => s.id === currentStage);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-zinc-100 dark:border-zinc-800">
      <div className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
          {t('checkIn.title')}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          {t('checkIn.subtitle')}
        </p>
      </div>

      {/* Crop Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('checkIn.cropType')}
          </label>
          <select
            value={cropType}
            onChange={(e) => {
              setCropType(e.target.value);
              setCurrentStage(cropStages[e.target.value]?.[0]?.id || '');
            }}
            className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            {cropTypes.map(type => (
              <option key={type} value={type}>{t(`checkIn.crops.${type}`)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('checkIn.currentStage')}
          </label>
          <select
            value={currentStage}
            onChange={(e) => setCurrentStage(e.target.value)}
            className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>
                {t(`checkIn.stages.${stage.id}`)} ({stage.duration} {t('checkIn.days')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stage Information */}
      {currentStageData && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t('checkIn.stage')}: {t(`checkIn.stages.${currentStageData.id}`)} ({currentStageData.duration} {t('checkIn.days')})
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p><strong>{t('checkIn.duration')}:</strong> {currentStageData.duration} {t('checkIn.days')}</p>
            <p><strong>{t('checkIn.criticalFactors')}:</strong> {currentStageData.criticalFactors.map(f => t(`checkIn.factors.${f}`)).join(', ')}</p>
            <p><strong>{t('checkIn.idealTemp')}:</strong> {currentStageData.idealConditions.tempMin}°C - {currentStageData.idealConditions.tempMax}°C</p>
          </div>
        </div>
      )}

      {/* Weather Data */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-blue-500" />
          {t('checkIn.weatherConditions')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <Thermometer className="w-4 h-4" />
              {t('checkIn.avgTemp')}
            </label>
            <input
              type="number"
              value={weatherData.avgTemp}
              onChange={(e) => setWeatherData(prev => ({ ...prev, avgTemp: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={loadingWeather}
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <CloudRain className="w-4 h-4" />
              {t('checkIn.rainfall')}
            </label>
            <input
              type="number"
              value={weatherData.rainfall}
              onChange={(e) => setWeatherData(prev => ({ ...prev, rainfall: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={loadingWeather}
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              <Wind className="w-4 h-4" />
              {t('checkIn.humidity')}
            </label>
            <input
              type="number"
              value={weatherData.humidity}
              onChange={(e) => setWeatherData(prev => ({ ...prev, humidity: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={loadingWeather}
            />
          </div>
        </div>
      </div>

      {/* Checklist Questions */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
          {t('checkIn.healthChecklist')}
        </h3>
        <div className="space-y-4">
          {['pest', 'disease', 'water', 'nutrient', 'growth', 'weather'].map(category => {
            const categoryQuestions = checkInQuestions.filter(q => q.category === category);
            
            return (
              <div key={category} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-800/50">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 capitalize">
                  {t(`checkIn.categories.${category}`)}
                </h4>
                <div className="space-y-3">
                  {categoryQuestions.map(question => (
                    <div key={question.id} className="flex items-start gap-3">
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleResponseChange(question.id, true)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            responses[question.id] === true
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                          }`}
                        >
                          {t('checkIn.yes')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResponseChange(question.id, false)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            responses[question.id] === false
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                          }`}
                        >
                          {t('checkIn.no')}
                        </button>
                      </div>
                      <label className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                        {t(`checkIn.questions.${question.id}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        {t('checkIn.submitButton')}
      </button>
    </form>
  );
}
