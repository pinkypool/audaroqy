'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';
import { useState } from 'react';

export default function LandingPage() {
    const { t, language, setLanguage } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'kz', label: 'Қазақша', flag: '🇰🇿' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div className="min-h-screen bg-[#0a1214] text-white flex flex-col relative overflow-hidden font-sans selection:bg-green-500/30">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image src="/logo_white.svg" alt="NomadSmart" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">NomadSmart</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                    <Link href="/levels" className="hover:text-white transition-colors">{t('nav_levels')}</Link>
                    <Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link>
                    
                    {/* Language Switcher */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                            <span>{currentLang.flag}</span>
                            <span>{currentLang.label}</span>
                            <ChevronDown size={14} />
                        </button>

                        <AnimatePresence>
                            {isLangMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full right-0 mt-2 bg-[#1a2a32] border border-neutral-700 rounded-xl overflow-hidden min-w-[140px] shadow-xl z-50"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3 ${language === lang.code ? 'text-green-400' : 'text-neutral-300'}`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex items-center gap-2 text-green-400 mb-8 bg-green-500/10 px-5 py-2 rounded-full border border-green-500/20 backdrop-blur-sm"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('hero_badge')}</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{t('hero_title_1')}</span>
                        <span className="block text-white">{t('hero_title_2')}</span>
                        <span className="block text-neutral-500">{t('hero_title_3')}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mb-12 leading-relaxed font-light">
                        {t('hero_desc')}
                        <br className="hidden md:block" />
                        <span className="text-neutral-200 font-medium">{t('hero_desc_2')}</span>
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 w-full max-w-3xl">
                        <FeatureCard
                            icon={<BookOpen className="text-blue-400" size={24} />}
                            title={t('feature_read_title')}
                            desc={t('feature_read_desc')}
                        />
                        <FeatureCard
                            icon={<Globe className="text-green-400" size={24} />}
                            title={t('feature_translate_title')}
                            desc={t('feature_translate_desc')}
                        />
                        <FeatureCard
                            icon={<Trophy className="text-yellow-400" size={24} />}
                            title={t('feature_play_title')}
                            desc={t('feature_play_desc')}
                        />
                    </div>

                    <Link href="/levels">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative bg-green-600 hover:bg-green-500 text-white font-bold text-xl px-16 py-6 rounded-2xl flex items-center gap-4 shadow-2xl shadow-green-900/20 transition-all overflow-hidden"
                        >
                            <span className="relative z-10">{t('start_learning')}</span>
                            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                        </motion.button>
                    </Link>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="p-8 text-center text-neutral-600 text-sm relative z-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <Image src="/logo_grey.svg" alt="NomadSmart" width={24} height={24} />
                        <span>NomadSmart © 2024</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-neutral-800/40 transition-colors group">
            <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className="text-center">
                <h3 className="font-bold text-white text-lg">{title}</h3>
                <p className="text-neutral-400 text-sm">{desc}</p>
            </div>
        </div>
    );
}
