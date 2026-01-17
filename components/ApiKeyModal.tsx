'use client';

import { useState, useEffect } from 'react';
import { X, Key, Save, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
    const { t } = useLanguage();
    const [apiKey, setApiKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);
    }, [isOpen]);

    const handleSave = () => {
        if (apiKey.trim().length < 10) {
            alert(t('enter_valid_key'));
            return;
        }
        localStorage.setItem('gemini_api_key', apiKey.trim());
        onClose();
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#1a2a32] border border-neutral-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <Key className="text-green-400" size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-white">{t('api_config_title')}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                <AlertCircle className="text-blue-400 shrink-0" size={20} />
                                <div className="text-sm text-blue-200">
                                    <p className="mb-2 font-medium">{t('why_need_key')}</p>
                                    <p className="opacity-80">
                                        {t('key_explanation')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    {t('google_api_key_label')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={isVisible ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="w-full bg-black/20 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    />
                                    <button
                                        onClick={() => setIsVisible(!isVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500 hover:text-neutral-300"
                                    >
                                        {isVisible ? t('hide') : t('show')}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                                    >
                                        {t('get_free_key')} <ExternalLink size={10} />
                                    </a>
                                    {apiKey && (
                                        <button
                                            onClick={handleClear}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            {t('clear_key')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-neutral-700 bg-black/20 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-neutral-400 hover:text-white font-medium transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
                            >
                                <Save size={18} />
                                {t('save_key')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
