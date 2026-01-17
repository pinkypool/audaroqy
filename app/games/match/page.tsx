'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, Trophy, Home } from 'lucide-react';
import { addXP } from '@/lib/xp';

// Word pairs for the game (English -> Russian)
const WORD_PAIRS = [
    { en: 'hello', ru: 'привет' },
    { en: 'book', ru: 'книга' },
    { en: 'cat', ru: 'кот' },
    { en: 'dog', ru: 'собака' },
    { en: 'house', ru: 'дом' },
    { en: 'sun', ru: 'солнце' },
    { en: 'water', ru: 'вода' },
    { en: 'friend', ru: 'друг' },
    { en: 'school', ru: 'школа' },
    { en: 'happy', ru: 'счастливый' },
    { en: 'big', ru: 'большой' },
    { en: 'small', ru: 'маленький' },
    { en: 'good', ru: 'хороший' },
    { en: 'bad', ru: 'плохой' },
    { en: 'love', ru: 'любовь' },
    { en: 'time', ru: 'время' },
];

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export default function WordMatchGame() {
    const [gamePairs, setGamePairs] = useState<typeof WORD_PAIRS>([]);
    const [selectedEn, setSelectedEn] = useState<string | null>(null);
    const [matched, setMatched] = useState<string[]>([]);
    const [wrong, setWrong] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const shuffled = shuffleArray(WORD_PAIRS).slice(0, 6);
        setGamePairs(shuffled);
        setSelectedEn(null);
        setMatched([]);
        setWrong(null);
        setScore(0);
        setGameComplete(false);
    };

    const handleEnClick = (word: string) => {
        if (matched.includes(word)) return;
        setSelectedEn(word);
        setWrong(null);
    };

    const handleRuClick = (ruWord: string, enWord: string) => {
        if (!selectedEn) return;
        if (matched.includes(enWord)) return;

        if (selectedEn === enWord) {
            // Correct match!
            setMatched([...matched, enWord]);
            setScore(score + 10);
            setSelectedEn(null);

            if (matched.length + 1 === gamePairs.length) {
                setGameComplete(true);
                addXP(50); // Bonus XP for completing game
            }
        } else {
            // Wrong match
            setWrong(ruWord);
            setTimeout(() => setWrong(null), 500);
        }
    };

    const shuffledRu = shuffleArray(gamePairs);

    return (
        <div className="min-h-screen bg-[#131f24] text-white p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/levels" className="text-neutral-400 hover:text-white">
                            <ChevronLeft size={24} />
                        </Link>
                        <Link href="/" className="text-neutral-400 hover:text-white">
                            <Home size={24} />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold">Найди пару 🎯</h1>
                    <div className="flex items-center gap-2 text-yellow-500 font-bold">
                        <Trophy size={20} />
                        <span>{score}</span>
                    </div>
                </div>

                {gameComplete ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold mb-4">Отлично!</h2>
                        <p className="text-neutral-400 mb-6">Ты набрал {score} очков и получил 50 XP!</p>
                        <button
                            onClick={startNewGame}
                            className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 mx-auto"
                        >
                            <RotateCcw size={20} />
                            Играть снова
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 gap-8">
                        {/* English words */}
                        <div className="space-y-3">
                            <h3 className="text-sm text-neutral-500 uppercase tracking-wider mb-4">English</h3>
                            {gamePairs.map((pair) => (
                                <motion.button
                                    key={pair.en}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleEnClick(pair.en)}
                                    disabled={matched.includes(pair.en)}
                                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${matched.includes(pair.en)
                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                            : selectedEn === pair.en
                                                ? 'bg-blue-500 text-white border-2 border-blue-400'
                                                : 'bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700'
                                        }`}
                                >
                                    {pair.en}
                                </motion.button>
                            ))}
                        </div>

                        {/* Russian words */}
                        <div className="space-y-3">
                            <h3 className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Русский</h3>
                            {shuffledRu.map((pair) => (
                                <motion.button
                                    key={pair.ru}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRuClick(pair.ru, pair.en)}
                                    disabled={matched.includes(pair.en)}
                                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${matched.includes(pair.en)
                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                            : wrong === pair.ru
                                                ? 'bg-red-500 text-white border-2 border-red-400 animate-shake'
                                                : 'bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700'
                                        }`}
                                >
                                    {pair.ru}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-center text-neutral-500 text-sm mt-8">
                    Выбери английское слово, затем найди его перевод на русский
                </p>
            </div>
        </div>
    );
}
