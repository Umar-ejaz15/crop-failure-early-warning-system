'use client';

import { CheckCircle, ClipboardCheck, BarChart3, Sprout, TrendingUp, Shield, Clock, Zap, Users, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FeaturesPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: ClipboardCheck,
      color: 'from-blue-500 to-blue-600',
      titleKey: 'landing.features.manualCheckIns.title',
      descKey: 'landing.features.manualCheckIns.description',
      benefits: ['No hardware costs', 'Easy to use', 'Works offline']
    },
    {
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
      titleKey: 'landing.features.smartRisk.title',
      descKey: 'landing.features.smartRisk.description',
      benefits: ['Real-time analysis', 'Proven algorithms', 'Accurate predictions']
    },
    {
      icon: Sprout,
      color: 'from-amber-500 to-amber-600',
      titleKey: 'landing.features.actionableAlerts.title',
      descKey: 'landing.features.actionableAlerts.description',
      benefits: ['Early warnings', 'Specific actions', 'Prevent losses']
    },
    {
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      titleKey: 'landing.features.weatherIntegration.title',
      descKey: 'landing.features.weatherIntegration.description',
      benefits: ['Weather tracking', 'Stage-specific advice', 'Climate adaptation']
    },
    {
      icon: Shield,
      color: 'from-pink-500 to-pink-600',
      titleKey: 'landing.features.multiCrop.title',
      descKey: 'landing.features.multiCrop.description',
      benefits: ['5+ crop types', 'Regional varieties', 'Custom stages']
    },
    {
      icon: Clock,
      color: 'from-indigo-500 to-indigo-600',
      titleKey: 'landing.features.historicalData.title',
      descKey: 'landing.features.historicalData.description',
      benefits: ['Trend analysis', 'Pattern recognition', 'Seasonal insights']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              {t('nav.features') || 'Features'}
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Everything you need to protect your crops and maximize yield
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-8 hover:shadow-2xl transition-all border border-zinc-100 dark:border-zinc-800"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {t(feature.descKey)}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
              Why Farmers Trust Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Fast & Easy</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Complete check-ins in under 5 minutes</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">10,000+ Farmers</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Trusted by farming communities</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Multi-Language</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Available in English and Urdu</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
