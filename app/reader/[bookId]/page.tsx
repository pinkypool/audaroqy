'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { translateWord, translateSentence, explainGrammar } from '@/lib/gemini';
import { addXP, XP_EVENTS } from '@/lib/xp';
import { updateBookProgress } from '@/lib/progress';
import { incrementStat } from '@/lib/achievements';
import TranslationPanel from '@/components/TranslationPanel';
import ApiKeyModal from '@/components/ApiKeyModal';
import bookA from '@/data/bookA.json';
import bookB from '@/data/bookB.json';
import bookC from '@/data/bookC.json';
import bookD from '@/data/bookD.json';
import bookE from '@/data/bookE.json';
import bookF from '@/data/bookF.json';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Home } from 'lucide-react';

const getBook = (id: string) => {
    const allBooks = [bookA, bookB, bookC, bookD, bookE, bookF];
    return allBooks.find(b => b.id === id);
};

// Local cache for translations
const translationCache: Record<string, { word: string; sentence: string; sentenceTr?: string; grammar?: string }> = {};

export default function ReaderPage() {
    const params = useParams();
    const router = useRouter();
    const book = getBook(params.bookId as string);

    // Chapter navigation state
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [chapterPart, setChapterPart] = useState(0); // 0 or 1 for split chapters

    // Translation state
    const [selectedWord, setSelectedWord] = useState('');
    const [selectedSentence, setSelectedSentence] = useState('');
    const [wordTranslation, setWordTranslation] = useState('');
    const [sentenceTranslation, setSentenceTranslation] = useState('');
    const [grammar, setGrammar] = useState('');
    const [isLoadingWord, setIsLoadingWord] = useState(false);
    const [isLoadingSentence, setIsLoadingSentence] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [targetLang, setTargetLang] = useState<string>('ru');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!book) return <div className="p-8 text-white">Book not found</div>;

    const currentChapter = book.chapters[currentChapterIndex];

    // Calculate content splitting
    const fullContent = currentChapter.content;
    const totalChars = JSON.stringify(fullContent).length;
    const isLongChapter = totalChars > 8000;

    // If long, split roughly in half by paragraphs
    const splitIndex = isLongChapter ? Math.ceil(fullContent.length / 2) : fullContent.length;

    const displayedContent = isLongChapter
        ? (chapterPart === 0 ? fullContent.slice(0, splitIndex) : fullContent.slice(splitIndex))
        : fullContent;

    const totalParts = isLongChapter ? 2 : 1;

    // Progress calculation
    const totalChapters = book.chapters.length;
    const progressPercentage = ((currentChapterIndex + (chapterPart + 1) / totalParts) / totalChapters) * 100;

    const handleWordClick = async (e: React.MouseEvent, word: string, sentence: string) => {
        e.stopPropagation();
        const cleanWord = word.replace(/[.,!?;:"()']/g, '').toLowerCase();
        if (!cleanWord || cleanWord.length < 2) return;

        const cacheKey = `${cleanWord}_${targetLang}`;

        // Check cache
        if (translationCache[cacheKey]) {
            setSelectedWord(cleanWord);
            setSelectedSentence(sentence);
            setWordTranslation(translationCache[cacheKey].word);
            setSentenceTranslation(translationCache[cacheKey].sentenceTr || '');
            setGrammar(translationCache[cacheKey].grammar || '');
            return;
        }

        setSelectedWord(cleanWord);
        setSelectedSentence(sentence);
        setWordTranslation('');
        setSentenceTranslation('');
        setGrammar('');
        setIsLoadingWord(true);
        
        // Check for API key
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setWordTranslation('MISSING_API_KEY');
            setIsLoadingWord(false);
            return;
        }

        try {
            const { translation } = await translateWord(cleanWord, sentence, targetLang);
            setWordTranslation(translation);
            addXP(XP_EVENTS.TRANSLATE_WORD);
            incrementStat('wordsTranslated');

            translationCache[cacheKey] = { word: translation, sentence };
        } catch (err) {
            console.error('Translation error:', err);
            setWordTranslation('Translation error');
        } finally {
            setIsLoadingWord(false);
        }
    };

    const handleLoadSentence = async () => {
        if (!selectedSentence || isLoadingSentence) return;

        const cacheKey = `${selectedWord}_${targetLang}`;

        // Check cache
        if (translationCache[cacheKey]?.sentenceTr) {
            setSentenceTranslation(translationCache[cacheKey].sentenceTr!);
            setGrammar(translationCache[cacheKey].grammar || '');
            return;
        }

        setIsLoadingSentence(true);

        // Check for API key
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setSentenceTranslation('MISSING_API_KEY');
            setIsLoadingSentence(false);
            return;
        }

        try {
            const [trResult, grResult] = await Promise.all([
                translateSentence(selectedSentence, targetLang),
                explainGrammar(selectedSentence, targetLang)
            ]);

            setSentenceTranslation(trResult.translation);
            setGrammar(grResult.grammar);
            addXP(XP_EVENTS.TRANSLATE_SENTENCE);
            incrementStat('sentencesTranslated');

            // Update cache
            if (translationCache[cacheKey]) {
                translationCache[cacheKey].sentenceTr = trResult.translation;
                translationCache[cacheKey].grammar = grResult.grammar;
            }
        } catch (err) {
            console.error('Sentence translation error:', err);
            setSentenceTranslation('Translation error');
        } finally {
            setIsLoadingSentence(false);
        }
    };

    const handleNext = () => {
        window.scrollTo(0, 0);
        if (chapterPart < totalParts - 1) {
            setChapterPart(prev => prev + 1);
        } else if (currentChapterIndex < book.chapters.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
            setChapterPart(0);
            addXP(XP_EVENTS.FINISH_CHAPTER);
            updateBookProgress(book.id, currentChapterIndex + 1, book.chapters.length);
        } else {
            // Finish book
            addXP(XP_EVENTS.FINISH_CHAPTER);
            updateBookProgress(book.id, currentChapterIndex, book.chapters.length);
            router.push(`/test/book/${book.id}`);
        }
    };

    const handlePrev = () => {
        window.scrollTo(0, 0);
        if (chapterPart > 0) {
            setChapterPart(prev => prev - 1);
        } else if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
            // When going back to previous chapter, check if it was split
            const prevChapter = book.chapters[currentChapterIndex - 1];
            const prevLen = JSON.stringify(prevChapter.content).length;
            setChapterPart(prevLen > 8000 ? 1 : 0);
        }
    };

    // Reset translation when language changes
    useEffect(() => {
        if (selectedWord) {
            setWordTranslation('');
            setSentenceTranslation('');
            setGrammar('');
        }
    }, [targetLang]);

    return (
        <div className="min-h-screen bg-[#f7f7f7] flex">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-4">
                    <Link href="/levels" className="text-neutral-400 hover:text-neutral-600 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <Link href="/" className="text-neutral-400 hover:text-neutral-600 transition-colors">
                        <Home size={24} />
                    </Link>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            className="h-full bg-green-500 rounded-full"
                        />
                    </div>
                    <span className="text-sm font-bold text-neutral-400 font-sans">
                        Chapter {currentChapterIndex + 1} {totalParts > 1 ? `(Part ${chapterPart + 1})` : ''}
                    </span>
                </div>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            key={`${currentChapter.id}-${chapterPart}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl shadow-sm p-8 md:p-12 min-h-[60vh]"
                        >
                            <h2 className="text-3xl font-bold text-neutral-800 mb-8 font-serif">
                                {currentChapter.title} {totalParts > 1 && <span className="text-lg text-neutral-400 font-sans ml-2">Part {chapterPart + 1}</span>}
                            </h2>

                            <div className="prose prose-lg prose-neutral max-w-none font-serif leading-relaxed">
                                {displayedContent.map((block, idx) => (
                                    <p key={idx} className="mb-6 text-lg text-neutral-700">
                                        {block.text.split(' ').map((word, wIdx) => {
                                            // Simple sentence detection (not perfect but works for clicking)
                                            const sentence = block.text.match(/[^.!?]+[.!?]+/g)?.find(s => s.includes(word)) || block.text;
                                            return (
                                                <span
                                                    key={wIdx}
                                                    onClick={(e) => handleWordClick(e, word, sentence)}
                                                    className={`cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors rounded px-0.5 ${selectedWord === word.replace(/[.,!?;:"()']/g, '').toLowerCase()
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : ''
                                                        }`}
                                                >
                                                    {word}{' '}
                                                </span>
                                            );
                                        })}
                                    </p>
                                ))}
                            </div>
                        </motion.div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pb-12">
                            <button
                                onClick={handlePrev}
                                disabled={currentChapterIndex === 0 && chapterPart === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-neutral-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                            >
                                <ChevronLeft size={20} />
                                Back
                            </button>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                            >
                                {currentChapterIndex === book.chapters.length - 1 && chapterPart === totalParts - 1 ? (
                                    <>
                                        Finish <CheckCircle size={20} />
                                    </>
                                ) : (
                                    <>
                                        Next <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Translation Sidebar */}
            <div
                className="hidden lg:flex bg-[#1a2a32] border-l border-neutral-700 flex-shrink-0"
                style={{ width: sidebarWidth }}
            >
                <div className="sticky top-0 h-screen overflow-hidden w-full">
                    <TranslationPanel
                        word={selectedWord}
                        translation={wordTranslation}
                        sentence={selectedSentence}
                        sentenceTranslation={sentenceTranslation}
                        grammar={grammar}
                        onLoadSentence={handleLoadSentence}
                        isLoadingSentence={isLoadingSentence}
                        isLoadingWord={isLoadingWord}
                        width={sidebarWidth}
                        onWidthChange={setSidebarWidth}
                        language={targetLang}
                        onLanguageChange={setTargetLang}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                    />
                </div>
            </div>

            <ApiKeyModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
