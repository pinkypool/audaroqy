'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof TRANSLATIONS['ru'], params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('ru');

    useEffect(() => {
        const stored = localStorage.getItem('app_language');
        if (stored && (stored === 'ru' || stored === 'kz' || stored === 'en')) {
            setLanguage(stored as Language);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app_language', lang);
    };

    const t = (key: keyof typeof TRANSLATIONS['ru'], params?: Record<string, string | number>) => {
        let text = TRANSLATIONS[language][key] || TRANSLATIONS['ru'][key] || key;
        
        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                text = text.replace(`{${param}}`, String(value));
            });
        }
        
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
