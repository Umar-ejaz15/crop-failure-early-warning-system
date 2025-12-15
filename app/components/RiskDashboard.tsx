'use client';

import dynamic from 'next/dynamic';
import { RiskAssessment, Alert, WeeklyCheckIn } from '../types/crop';
import { ClipboardList, AlertTriangle, AlertOctagon, Info, CheckCircle, Lightbulb, TrendingUp, BarChart3, CloudRain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { checkInQuestions } from '../data/cropData';
import { calculateRiskScore } from '../utils/riskCalculator';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface RiskDashboardProps {
  assessment: RiskAssessment | null;
  cropType: string;
  currentStage: string;
  checkInHistory: WeeklyCheckIn[];
  geminiSuggestions?: string;
}

export default function RiskDashboard({ assessment, cropType, currentStage, checkInHistory, geminiSuggestions }: RiskDashboardProps) {
  const { t } = useLanguage();
  if (!assessment) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-100 dark:border-zinc-800">
        <div className="text-center text-zinc-500 dark:text-zinc-400">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="text-lg font-medium">{t('dashboard.noAssessment')}</p>
          <p className="text-sm mt-1">{t('dashboard.completeCheckIn')}</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-zinc-500';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-zinc-600 dark:text-zinc-400';
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      default: return 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Overall Risk Score */}
      <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('dashboard.riskAssessment')}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t(`checkIn.crops.${cropType}`)} - {t(`checkIn.stages.${currentStage}`)}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getRiskTextColor(assessment.riskLevel)}`}>
              {assessment.overallRisk.toFixed(1)}
            </div>
            <div className="flex items-center gap-2 justify-end mt-1">
              <div className={`w-3 h-3 rounded-full ${getRiskColor(assessment.riskLevel)} animate-pulse`}></div>
              <span className={`text-sm font-semibold uppercase ${getRiskTextColor(assessment.riskLevel)}`}>
                {assessment.riskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Factors Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {Object.entries(assessment.factors).map(([category, score]) => (
            <div key={category} className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 shadow-sm flex flex-col gap-2 transition-all duration-300">
              <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                {t(`checkIn.categories.${category}`)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      score < 3 ? 'bg-green-500' :
                      score < 5 ? 'bg-yellow-500' :
                      score < 7 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(score * 10, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {assessment.alerts.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-zinc-50 dark:from-red-900/20 dark:to-zinc-900 rounded-3xl shadow-2xl p-8 border border-red-200 dark:border-red-800 animate-fade-in">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            {t('dashboard.criticalAlerts')} ({assessment.alerts.length})
          </h3>
          <div className="space-y-4">
            {assessment.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-8 rounded-2xl p-5 flex gap-4 items-start shadow-md ${getSeverityColor(alert.severity)} animate-fade-in`}
                style={{ borderLeftColor: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'high' ? '#f59e0b' : alert.severity === 'medium' ? '#f97316' : '#3b82f6' }}
              >
                <div className="flex-shrink-0 mt-1">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase text-zinc-800 dark:text-zinc-100 tracking-wide">
                      {t(`checkIn.categories.${alert.category}`)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                    {alert.message}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    <strong>{t('common.action')}:</strong> {alert.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gemini Suggestions */}
      {geminiSuggestions && geminiSuggestions.trim() && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-3xl shadow-lg p-7 border border-yellow-200 dark:border-yellow-800 animate-fade-in mb-4">
          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            AI Suggestions
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-amber-900 dark:text-amber-100">
            {geminiSuggestions.split(/\n|\d+\./).filter(Boolean).map((s, i) => (
              <li key={i}>{s.trim()}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {assessment.recommendations.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-7 border border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            {t('dashboard.recommendations')}
          </h3>
          <ul className="space-y-3">
            {assessment.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                  {index + 1}
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 flex-1 pt-0.5">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Issues */}
      {assessment.alerts.length === 0 && assessment.overallRisk < 3 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-8 shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                {t('dashboard.healthyStatus')}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {t('dashboard.healthyMessage')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Graphs - Enhanced with more charts */}
      {checkInHistory.length > 1 && (
        <>
          {/* Risk Trend with Prediction */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800 animate-fade-in">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Risk Trend & Prediction
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  textStyle: { color: '#fff' }
                },
                legend: {
                  data: ['Historical Risk', 'Predicted Trend'],
                  textStyle: { color: '#666' }
                },
                grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                xAxis: {
                  type: 'category',
                  data: [
                    ...checkInHistory.slice().reverse().map(c => new Date(c.date).toLocaleDateString()),
                    'Next Week'
                  ],
                  axisLabel: { rotate: 45, color: '#666' }
                },
                yAxis: {
                  type: 'value',
                  name: 'Risk Score',
                  max: 10,
                  axisLabel: { color: '#666' }
                },
                series: [{
                  name: 'Historical Risk',
                  type: 'line',
                  data: checkInHistory.slice().reverse().map(c => c.riskScore),
                  smooth: true,
                  itemStyle: { color: '#ef4444' },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 0, y2: 1,
                      colorStops: [
                        { offset: 0, color: 'rgba(239, 68, 68, 0.4)' },
                        { offset: 1, color: 'rgba(239, 68, 68, 0.1)' }
                      ]
                    }
                  }
                }, {
                  name: 'Predicted Trend',
                  type: 'line',
                  data: [
                    ...checkInHistory.slice().reverse().map(c => c.riskScore),
                    Math.min(10, Math.max(0, assessment.overallRisk + (Math.random() - 0.5) * 2))
                  ],
                  smooth: true,
                  itemStyle: { color: '#f59e0b' },
                  lineStyle: { type: 'dashed' }
                }],
                markLine: {
                  data: [
                    { yAxis: 3, name: 'Low Risk', lineStyle: { color: '#10b981' } },
                    { yAxis: 7, name: 'High Risk', lineStyle: { color: '#ef4444' } }
                  ]
                }
              }}
              style={{ height: '350px' }}
            />
          </div>

          {/* Weather Impact Analysis */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800 animate-fade-in">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-500" />
              Weather Impact Analysis
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  textStyle: { color: '#fff' }
                },
                grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
                xAxis: {
                  type: 'category',
                  data: checkInHistory.slice().reverse().map(c => new Date(c.date).toLocaleDateString()),
                  axisLabel: { rotate: 45, color: '#666' }
                },
                yAxis: [
                  {
                    type: 'value',
                    name: 'Temperature (°C)',
                    position: 'left',
                    axisLabel: { color: '#666' }
                  },
                  {
                    type: 'value',
                    name: 'Risk Score',
                    position: 'right',
                    axisLabel: { color: '#666' }
                  }
                ],
                series: [{
                  name: 'Temperature',
                  type: 'line',
                  yAxisIndex: 0,
                  data: checkInHistory.slice().reverse().map(c => c.weatherConditions.avgTemp),
                  smooth: true,
                  itemStyle: { color: '#f59e0b' },
                  lineStyle: { width: 2 }
                }, {
                  name: 'Risk Score',
                  type: 'line',
                  yAxisIndex: 1,
                  data: checkInHistory.slice().reverse().map(c => c.riskScore),
                  smooth: true,
                  itemStyle: { color: '#ef4444' },
                  areaStyle: {
                    color: 'rgba(239, 68, 68, 0.1)'
                  }
                }]
              }}
              style={{ height: '300px' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Enhanced Category Risk Breakdown */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-7 border border-zinc-100 dark:border-zinc-800 animate-fade-in">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Category Risk Breakdown
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    textStyle: { color: '#fff' }
                  },
                  radar: {
                    indicator: Object.keys(assessment.factors).map(key => ({
                      name: t(`checkIn.categories.${key}`),
                      max: 10
                    })),
                    splitArea: { show: true }
                  },
                  series: [{
                    type: 'radar',
                    data: [{
                      value: Object.values(assessment.factors),
                      itemStyle: { color: '#10b981' },
                      areaStyle: { color: 'rgba(16, 185, 129, 0.3)' }
                    }]
                  }]
                }}
                style={{ height: '300px' }}
              />
            </div>

            {/* Risk Distribution with Trends */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-7 border border-zinc-100 dark:border-zinc-800 animate-fade-in">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Risk Level Distribution & Trends
              </h3>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    textStyle: { color: '#fff' }
                  },
                  legend: {
                    orient: 'vertical',
                    left: 'right',
                    textStyle: { color: '#666' }
                  },
                  series: [{
                    type: 'pie',
                    radius: ['30%', '70%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 10,
                      borderWidth: 2
                    },
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                      }
                    },
                    data: [
                      {
                        value: checkInHistory.filter(c => c.riskScore < 3).length,
                        name: 'Low Risk',
                        itemStyle: { color: '#10b981' }
                      },
                      {
                        value: checkInHistory.filter(c => c.riskScore >= 3 && c.riskScore < 5).length,
                        name: 'Medium Risk',
                        itemStyle: { color: '#f59e0b' }
                      },
                      {
                        value: checkInHistory.filter(c => c.riskScore >= 5 && c.riskScore < 7).length,
                        name: 'High Risk',
                        itemStyle: { color: '#f97316' }
                      },
                      {
                        value: checkInHistory.filter(c => c.riskScore >= 7).length,
                        name: 'Critical Risk',
                        itemStyle: { color: '#ef4444' }
                      }
                    ]
                  }]
                }}
                style={{ height: '300px' }}
              />
            </div>
          </div>

          {/* Category Trends Over Time */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800 animate-fade-in">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Category Risk Trends
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  textStyle: { color: '#fff' }
                },
                legend: {
                  data: Object.keys(assessment.factors).map(key => t(`checkIn.categories.${key}`)),
                  textStyle: { color: '#666' }
                },
                grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
                xAxis: {
                  type: 'category',
                  data: checkInHistory.slice().reverse().map(c => new Date(c.date).toLocaleDateString()),
                  axisLabel: { rotate: 45, color: '#666' }
                },
                yAxis: {
                  type: 'value',
                  name: 'Risk Score',
                  max: 10,
                  axisLabel: { color: '#666' }
                },
                series: Object.keys(assessment.factors).map((category, index) => ({
                  name: t(`checkIn.categories.${category}`),
                  type: 'line',
                  data: checkInHistory.slice().reverse().map(c => {
                    // For historical data, we need to recalculate factors since they're not stored
                    // This is a simplified approach - in production you'd store factors in the database
                    const historicalAssessment = calculateRiskScore(
                      c.responses,
                      checkInQuestions,
                      c.cropType,
                      c.currentStage,
                      c.weatherConditions
                    );
                    return historicalAssessment.factors[category as keyof typeof historicalAssessment.factors] || 0;
                  }),
                  smooth: true,
                  itemStyle: {
                    color: ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
                  }
                }))
              }}
              style={{ height: '350px' }}
            />
          </div>
        </>
      )}
    </div>
  );
}
