'use client';

export const dynamic = 'force-dynamic';

import { Sprout, Target, Users, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="container mx-auto px-4 py-20">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
            {t('nav.about') || 'About Us'}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            {locale === 'ur' 
              ? 'کسانوں کو فصل کی ناکامی سے بچانے کے لیے پرعزم'
              : 'Empowering farmers to prevent crop failures through intelligent monitoring'
            }
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800">
            <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              {locale === 'ur' ? 'ہمارا مشن' : 'Our Mission'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {locale === 'ur'
                ? 'ہم مہنگے ٹیکنالوجی کی ضرورت کے بغیر سستی اور موثر فصل کی نگرانی کے حل فراہم کرکے کاشتکاروں کو بااختیار بنانا چاہتے ہیں۔ ہمارا مقصد فصل کی ناکامی سے پہلے کو روکنا اور زرعی کمیونٹیوں کے لیے خوراک کی حفاظت کو بہتر بنانا ہے۔'
                : 'We aim to empower farmers with affordable and effective crop monitoring solutions without the need for expensive technology. Our goal is to prevent crop failures before they happen and improve food security for agricultural communities.'
              }
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              {locale === 'ur' ? 'ہماری قدریں' : 'Our Values'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {locale === 'ur'
                ? 'ہم سادگی، رسائی، اور کسانوں کے لیے عملی حل میں یقین رکھتے ہیں۔ ہماری نظام زمینی حقائق کو سمجھ کر ڈیزائن کیا گیا ہے اور کسانوں کی روزمرہ چیلنجز کو مدنظر رکھتے ہوئے بنایا گیا ہے۔'
                : 'We believe in simplicity, accessibility, and practical solutions for farmers. Our system is designed with ground realities in mind, respecting the daily challenges farmers face.'
              }
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-12 border border-zinc-100 dark:border-zinc-800">
          <div className="text-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              {locale === 'ur' ? 'ہماری ٹیم' : 'Our Team'}
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
              {locale === 'ur'
                ? 'زرعی ماہرین، ڈیٹا سائنسدانوں اور سافٹ ویئر انجینئرز کی ایک سرشار ٹیم'
                : 'A dedicated team of agricultural experts, data scientists, and software engineers'}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {locale === 'ur'
                ? 'ہماری متنوع ٹیم زراعت، ٹیکنالوجی اور ڈیٹا سائنس میں مہارت کو یکجا کرتی ہے تاکہ کسانوں کے لیے بہترین ممکنہ حل تخلیق کیا جا سکے۔ ہم مقامی کسانوں کے ساتھ مل کر کام کرتے ہیں تاکہ یہ یقینی بنایا جا سکے کہ ہمارا نظام ان کی حقیقی ضروریات کو پورا کرتا ہے۔'
                : 'Our diverse team combines expertise in agriculture, technology, and data science to create the best possible solution for farmers. We work closely with local farming communities to ensure our system meets their real-world needs.'
              }
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">10K+</div>
            <p className="text-zinc-600 dark:text-zinc-400">{locale === 'ur' ? 'کسان' : 'Farmers'}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">5</div>
            <p className="text-zinc-600 dark:text-zinc-400">{locale === 'ur' ? 'فصلیں' : 'Crops Supported'}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
            <p className="text-zinc-600 dark:text-zinc-400">{locale === 'ur' ? 'کامیابی کی شرح' : 'Success Rate'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
