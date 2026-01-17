'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X, ChevronDown, ChevronUp, BookOpen, MessageSquare } from 'lucide-react';

interface TranslationSidebarProps {
    isOpen: boolean;
    word: string;
    translation: string;
    synonyms?: string[];
    sentence: string;
    sentenceTranslation?: string;
    grammar?: string;
    onClose: () => void;
    onLoadSentence: () => void;
    isLoadingSentence: boolean;
}

export default function TranslationSidebar({
    isOpen,
    word,
    translation,
    synonyms = [],
    sentence,
    sentenceTranslation,
    grammar,
    onClose,
    onLoadSentence,
    isLoadingSentence
}: TranslationSidebarProps) {
    const [showSentence, setShowSentence] = useState(false);

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
        if (!sentenceTranslation) {
            onLoadSentence();
        }
        setShowSentence(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#1a2a32] border-l border-neutral-800 z-50 overflow-y-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#1a2a32] border-b border-neutral-800 p-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Перевод</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Word Section */}
                            <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Слово</span>
                                        <h3 className="text-2xl font-bold text-white">{word}</h3>
                                    </div>
                                    <button
                                        onClick={() => speak(word)}
                                        className="w-10 h-10 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center text-blue-400 transition-colors"
                                        title="Произнести"
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                </div>

                                <div className="border-t border-neutral-800 pt-3">
                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Перевод</span>
                                    <p className="text-lg text-green-400 font-medium">{translation}</p>
                                </div>

                                {synonyms.length > 0 && (
                                    <div className="border-t border-neutral-800 pt-3 mt-3">
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Синонимы</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {synonyms.map((syn, i) => (
                                                <span key={i} className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300">
                                                    {syn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sentence Section */}
                            <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden">
                                <button
                                    onClick={handleShowSentence}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                            <MessageSquare size={18} className="text-purple-400" />
                                        </div>
                                        <span className="font-medium text-white">Перевод предложения</span>
                                    </div>
                                    {showSentence ? (
                                        <ChevronUp size={20} className="text-neutral-500" />
                                    ) : (
                                        <ChevronDown size={20} className="text-neutral-500" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showSentence && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 pt-0 space-y-4">
                                                {/* Original sentence */}
                                                <div>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Оригинал</span>
                                                    <p className="text-neutral-300 text-sm mt-1 leading-relaxed">{sentence}</p>
                                                    <button
                                                        onClick={() => speak(sentence)}
                                                        className="mt-2 flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300"
                                                    >
                                                        <Volume2 size={16} /> Произнести
                                                    </button>
                                                </div>

                                                {/* Translation */}
                                                {isLoadingSentence ? (
                                                    <div className="flex items-center gap-2 text-neutral-500">
                                                        <div className="w-4 h-4 border-2 border-neutral-600 border-t-green-500 rounded-full animate-spin" />
                                                        <span className="text-sm">Перевожу...</span>
                                                    </div>
                                                ) : sentenceTranslation ? (
                                                    <div>
                                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Перевод</span>
                                                        <p className="text-green-400 text-sm mt-1 leading-relaxed">{sentenceTranslation}</p>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Grammar Section */}
                            {(grammar || showSentence) && (
                                <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden">
                                    <div className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                            <BookOpen size={18} className="text-yellow-400" />
                                        </div>
                                        <span className="font-medium text-white">Грамматика</span>
                                    </div>

                                    <div className="p-4 pt-0">
                                        {isLoadingSentence ? (
                                            <div className="flex items-center gap-2 text-neutral-500">
                                                <div className="w-4 h-4 border-2 border-neutral-600 border-t-yellow-500 rounded-full animate-spin" />
                                                <span className="text-sm">Анализирую...</span>
                                            </div>
                                        ) : grammar ? (
                                            <p className="text-yellow-200/80 text-sm leading-relaxed">{grammar}</p>
                                        ) : (
                                            <p className="text-neutral-500 text-sm">Нажмите "Перевод предложения" для анализа грамматики</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
