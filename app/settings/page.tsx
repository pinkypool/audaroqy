'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Key, Save, Check } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [apiKey, setApiKeyState] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const key = localStorage.getItem('gemini_api_key');
        if (key) setApiKeyState(key);
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#131f24] text-white p-8">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/levels" className="text-neutral-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold">{t('settings_title')}</h1>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Key className="text-green-500" size={24} />
                        <h2 className="text-lg font-bold">{t('api_key_label')}</h2>
                    </div>

                    <p className="text-neutral-400 text-sm mb-4">
                        {t('api_key_desc_long')} <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-green-400 underline">{t('get_key_link')}</a>
                    </p>

                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKeyState(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all mb-4"
                    />

                    <button
                        onClick={handleSave}
                        className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-green-600 text-white'
                                : 'bg-green-500 hover:bg-green-400 text-white shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1'
                            }`}
                    >
                        {saved ? (
                            <>
                                <Check size={20} />
                                {t('saved')}
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                {t('save')}
                            </>
                        )}
                    </button>
                </div>

                <p className="text-neutral-600 text-xs text-center mt-6">
                    {t('key_stored_locally')}
                </p>
            </div>
        </div>
    );
}
