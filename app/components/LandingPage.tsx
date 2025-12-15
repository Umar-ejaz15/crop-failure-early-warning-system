'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Sprout, BarChart3, ClipboardCheck, TrendingUp, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: ClipboardCheck,
      color: 'from-blue-500 to-blue-600',
      titleKey: 'landing.features.manualCheckIns.title',
      descKey: 'landing.features.manualCheckIns.description'
    },
    {
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
      titleKey: 'landing.features.smartRisk.title',
      descKey: 'landing.features.smartRisk.description'
    },
    {
      icon: Sprout,
      color: 'from-amber-500 to-amber-600',
      titleKey: 'landing.features.actionableAlerts.title',
      descKey: 'landing.features.actionableAlerts.description'
    },
    {
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      titleKey: 'landing.features.weatherIntegration.title',
      descKey: 'landing.features.weatherIntegration.description'
    },
    {
      icon: Shield,
      color: 'from-pink-500 to-pink-600',
      titleKey: 'landing.features.multiCrop.title',
      descKey: 'landing.features.multiCrop.description'
    },
    {
      icon: Clock,
      color: 'from-indigo-500 to-indigo-600',
      titleKey: 'landing.features.historicalData.title',
      descKey: 'landing.features.historicalData.description'
    }
  ];

  const steps = [
    {
      number: '01',
      titleKey: 'landing.howItWorks.step1.title',
      descKey: 'landing.howItWorks.step1.description'
    },
    {
      number: '02',
      titleKey: 'landing.howItWorks.step2.title',
      descKey: 'landing.howItWorks.step2.description'
    },
    {
      number: '03',
      titleKey: 'landing.howItWorks.step3.title',
      descKey: 'landing.howItWorks.step3.description'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('landing.features.subtitle')}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              {t('landing.hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-3xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">
              {t('landing.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                {t('landing.hero.getStarted')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/features"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all shadow-lg border border-zinc-200 dark:border-zinc-700"
              >
                {t('landing.hero.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-700 hover:border-green-200 dark:hover:border-green-900"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="text-6xl font-bold text-green-100 dark:text-green-900/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {t(step.descKey)}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-green-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-green-50 mb-10">
              {t('landing.cta.description')}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-green-600 font-bold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
            >
              {t('landing.cta.button')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">CFEWS</span>
            </div>
            <p className="text-sm">
              © 2025 Crop Failure Early Warning System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
