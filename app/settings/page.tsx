'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiKey, setApiKey } from '@/lib/openrouter';
import { ChevronLeft, Key, Save, Check } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const router = useRouter();
    const [apiKey, setApiKeyState] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setApiKeyState(getApiKey());
    }, []);

    const handleSave = () => {
        setApiKey(apiKey);
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
                    <h1 className="text-2xl font-bold">Настройки</h1>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Key className="text-yellow-500" size={24} />
                        <h2 className="text-lg font-bold">API Ключ OpenRouter</h2>
                    </div>

                    <p className="text-neutral-400 text-sm mb-4">
                        Для работы переводов нужен API ключ от OpenRouter.
                        Получите его бесплатно на <a href="https://openrouter.ai" target="_blank" className="text-blue-400 underline">openrouter.ai</a>
                    </p>

                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKeyState(e.target.value)}
                        placeholder="sk-or-v1-..."
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
                                Сохранено!
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Сохранить
                            </>
                        )}
                    </button>
                </div>

                <p className="text-neutral-600 text-xs text-center mt-6">
                    Ваш ключ хранится только локально в вашем браузере.
                </p>
            </div>
        </div>
    );
}
