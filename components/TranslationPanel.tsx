'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, ChevronDown, ChevronUp, BookOpen, MessageSquare, Loader2, GripVertical, Globe, Settings, Sparkles, Key } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface TranslationPanelProps {
    word: string;
    translation: string;
    sentence: string;
    sentenceTranslation?: string;
    grammar?: string;
    onLoadSentence: () => void;
    isLoadingSentence: boolean;
    isLoadingWord: boolean;
    width: number;
    onWidthChange: (width: number) => void;
    language?: string;
    onLanguageChange?: (lang: string) => void;
    onOpenSettings?: () => void;
}

export default function TranslationPanel({
    word,
    translation,
    sentence,
    sentenceTranslation,
    grammar,
    onLoadSentence,
    isLoadingSentence,
    isLoadingWord,
    width,
    onWidthChange,
    language = 'ru',
    onLanguageChange,
    onOpenSettings,
}: TranslationPanelProps) {
    const { t } = useLanguage();
    const [showSentence, setShowSentence] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleShowSentence = () => {
        if (!sentenceTranslation && !isLoadingSentence) {
            onLoadSentence();
        }
        setShowSentence(true);
    };

    useEffect(() => {
        setShowSentence(false);
    }, [word]);

    // Handle drag resize
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newWidth = window.innerWidth - e.clientX;
            onWidthChange(Math.min(Math.max(newWidth, 250), 600));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onWidthChange]);

    return (
        <div
            ref={panelRef}
            className="h-full flex"
            style={{ width }}
        >
            {/* Resize Handle */}
            <div
                onMouseDown={() => setIsDragging(true)}
                className="w-2 bg-neutral-800 hover:bg-blue-500 cursor-ew-resize flex items-center justify-center transition-colors group"
            >
                <GripVertical size={12} className="text-neutral-600 group-hover:text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-neutral-700 bg-[#1a2a32] flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t('translation_panel_title')}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenSettings}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                            title="API Settings"
                        >
                            <Settings size={16} />
                        </button>
                        <Globe size={14} className="text-neutral-400" />
                        <select
                            value={language}
                            onChange={e => onLanguageChange && onLanguageChange(e.target.value)}
                            className="bg-neutral-800 text-white text-xs font-medium rounded-lg px-2 py-1.5 border border-neutral-700 focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
                        >
                            <option value="ru">Русский</option>
                            <option value="kz">Қазақша</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="it">Italiano</option>
                            <option value="tr">Türkçe</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a2a32]">
                    {!word ? (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 p-6">
                            <BookOpen size={48} className="mb-4 opacity-30" />
                            <p className="text-center text-sm">{t('click_to_translate')}</p>
                        </div>
                    ) : (
                        <>
                            {/* Word Section */}
                            <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">{t('word_label')}</span>
                                        <h3 className="text-xl font-bold text-white">{word}</h3>
                                    </div>
                                    <button
                                        onClick={() => speak(word)}
                                        className="w-9 h-9 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center text-blue-400 transition-colors"
                                        title="Pronounce"
                                    >
                                        <Volume2 size={18} />
                                    </button>
                                </div>

                                <div className="border-t border-neutral-700 pt-2">
                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{t('translation_label')}</span>
                                    {isLoadingWord ? (
                                        <div className="flex items-center gap-2 text-neutral-400 mt-1">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>{t('translating')}</span>
                                        </div>
                                    ) : translation === 'MISSING_API_KEY' ? (
                                        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 font-bold text-yellow-200 mb-1">
                                                <Key size={14} />
                                                <span>{t('api_key_required')}</span>
                                            </div>
                                            <p className="text-xs text-yellow-200/80 mb-2">{t('api_key_desc')}</p>
                                            <button
                                                onClick={onOpenSettings}
                                                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-1.5 rounded-lg transition-colors font-medium w-full"
                                            >
                                                {t('add_key')}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-lg text-green-400 font-medium">{translation || 'Error'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Sentence Section */}
                            <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
                                <button
                                    onClick={() => setShowSentence(!showSentence)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-neutral-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={16} className="text-blue-400" />
                                        <span className="font-bold text-sm text-white">{t('context_label')}</span>
                                    </div>
                                    {showSentence ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {showSentence && (
                                    <div className="p-4 pt-0 border-t border-neutral-700/50">
                                        <p className="text-neutral-300 italic mb-4 mt-3 text-sm leading-relaxed">
                                            "{sentence}"
                                        </p>

                                        {!sentenceTranslation ? (
                                            <button
                                                onClick={handleShowSentence}
                                                disabled={isLoadingSentence}
                                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isLoadingSentence ? (
                                                    <>
                                                        <Loader2 size={14} className="animate-spin" />
                                                        {t('translating')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={14} />
                                                        {t('translate_sentence')}
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{t('translation_label')}</span>
                                                    {sentenceTranslation === 'MISSING_API_KEY' ? (
                                                        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                            <p className="text-xs text-yellow-200 mb-2">{t('api_key_required')}</p>
                                                            <button
                                                                onClick={onOpenSettings}
                                                                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-1.5 rounded-lg transition-colors font-medium w-full"
                                                            >
                                                                {t('add_key')}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-white text-sm mt-1">{sentenceTranslation}</p>
                                                    )}
                                                </div>
                                                {grammar && (
                                                    <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                                                        <span className="text-xs text-blue-400 uppercase tracking-wider font-bold flex items-center gap-1">
                                                            <BookOpen size={12} />
                                                            {t('grammar_label')}
                                                        </span>
                                                        <p className="text-blue-100 text-xs mt-1 leading-relaxed">{grammar}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
