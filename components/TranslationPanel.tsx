'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, ChevronDown, ChevronUp, BookOpen, MessageSquare, Loader2, GripVertical, Globe, Settings } from 'lucide-react';

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
    // New optional language prop (default 'ru')
    // New optional language prop (default 'ru')
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
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Translation</h2>
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
                            <option value="ru">Russian</option>
                            <option value="kz">Kazakh</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="tr">Turkish</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a2a32]">
                    {!word ? (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 p-6">
                            <BookOpen size={48} className="mb-4 opacity-30" />
                            <p className="text-center text-sm">Click on any word to translate</p>
                        </div>
                    ) : (
                        <>
                            {/* Word Section */}
                            <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Word</span>
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
                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Translation</span>
                                    {isLoadingWord ? (
                                        <div className="flex items-center gap-2 text-neutral-400 mt-1">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Translating...</span>
                                        </div>
                                    ) : translation === 'MISSING_API_KEY' ? (
                                        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <p className="text-xs text-yellow-200 mb-2">API Key Required</p>
                                            <button
                                                onClick={onOpenSettings}
                                                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-1.5 rounded-lg transition-colors font-medium w-full"
                                            >
                                                Add Key
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
                                        <span className="font-bold text-sm text-white">Sentence Context</span>
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
                                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                            >
                                                {isLoadingSentence ? 'Translating...' : 'Translate Sentence'}
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Translation</span>
                                                    {sentenceTranslation === 'MISSING_API_KEY' ? (
                                                        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                            <p className="text-xs text-yellow-200 mb-2">API Key Required</p>
                                                            <button
                                                                onClick={onOpenSettings}
                                                                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-1.5 rounded-lg transition-colors font-medium w-full"
                                                            >
                                                                Add Key
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-white text-sm mt-1">{sentenceTranslation}</p>
                                                    )}
                                                </div>
                                                {grammar && (
                                                    <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                                                        <span className="text-xs text-blue-400 uppercase tracking-wider font-bold">Grammar</span>
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
