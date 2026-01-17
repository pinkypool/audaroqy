'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TestCard from '@/components/TestCard';
import { addXP, XP_EVENTS } from '@/lib/xp';
import { unlockLevel } from '@/lib/progress';
import { generateTestQuestions } from '@/lib/gemini';
import { incrementStat } from '@/lib/achievements';
import bookA from '@/data/bookA.json';
import bookB from '@/data/bookB.json';
import bookC from '@/data/bookC.json';
import bookD from '@/data/bookD.json';
import bookE from '@/data/bookE.json';
import bookF from '@/data/bookF.json';
import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

const getBook = (id: string) => {
    const allBooks = [bookA, bookB, bookC, bookD, bookE, bookF];
    return allBooks.find(b => b.id === id);
};

// Fallback questions if API fails
const fallbackQuestions = [
    { question: "What does 'once upon a time' mean?", options: ["Давным-давно", "Один раз", "Сейчас", "Никогда"], correctAnswerIndex: 0 },
    { question: "What is the past tense of 'go'?", options: ["goed", "went", "gone", "going"], correctAnswerIndex: 1 },
    { question: "Choose the correct article: '___ apple'", options: ["A", "An", "The", "No article"], correctAnswerIndex: 1 },
    { question: "What does 'beautiful' mean?", options: ["Страшный", "Красивый", "Большой", "Маленький"], correctAnswerIndex: 1 },
    { question: "Which is correct?", options: ["He don't like", "He doesn't like", "He not like", "He no like"], correctAnswerIndex: 1 },
    { question: "What is the plural of 'child'?", options: ["childs", "childes", "children", "childen"], correctAnswerIndex: 2 },
    { question: "Choose the correct word: 'I ___ a book'", options: ["readed", "read", "readen", "reading"], correctAnswerIndex: 1 },
    { question: "What does 'happy' mean?", options: ["Грустный", "Злой", "Счастливый", "Усталый"], correctAnswerIndex: 2 },
    { question: "Which word is a verb?", options: ["book", "run", "table", "happy"], correctAnswerIndex: 1 },
    { question: "What is the opposite of 'big'?", options: ["large", "huge", "small", "tall"], correctAnswerIndex: 2 },
];

export default function BookTestPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params.bookId as string;
    const book = getBook(bookId);

    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = async () => {
            if (!book) return;
            const textContext = book.chapters.map(c => c.content.map(p => p.text).join(' ')).join(' ').substring(0, 2000);

            try {
                const generated = await generateTestQuestions(textContext, 10);
                if (generated && generated.length >= 5) {
                    setQuestions(generated);
                } else {
                    setQuestions(fallbackQuestions);
                }
            } catch {
                setQuestions(fallbackQuestions);
            }
            setIsLoading(false);
        };

        loadQuestions();
    }, [book]);

    const handleAnswer = (index: number) => {
        if (index === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(prev => prev + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#131f24] text-white">
                <div className="absolute top-4 left-4">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                        <span>Назад</span>
                    </button>
                </div>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-green-500 mx-auto mb-4"></div>
                    <p>Генерация теста...</p>
                    <p className="text-neutral-500 text-sm mt-2">Если долго, используются запасные вопросы</p>
                </div>
            </div>
        );
    }

    if (isFinished) {
        const passed = score >= 8;

        if (passed) {
            addXP(XP_EVENTS.FINISH_TEST);
            incrementStat('testsPasssed');
            incrementStat('booksCompleted');
            if (book?.level === 'A') unlockLevel('B');
            if (book?.level === 'B') unlockLevel('C');
        }

        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center bg-[#131f24] text-white">
                <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <h1 className="text-4xl font-bold mb-4">{passed ? '🎉 Тест пройден!' : '😔 Попробуйте снова'}</h1>
                    <p className="text-neutral-400 mb-4">Вы набрали {score} из {questions.length} правильных ответов.</p>

                    <div className="w-full bg-neutral-800 rounded-full h-4 mb-6">
                        <div
                            className={`h-4 rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${(score / questions.length) * 100}%` }}
                        />
                    </div>

                    {passed && (
                        <p className="text-green-400 mb-6 font-bold text-lg">🔓 Следующий уровень открыт!</p>
                    )}

                    <button
                        onClick={() => router.push('/levels')}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 mb-3"
                    >
                        Вернуться к уровням
                    </button>

                    {!passed && (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Попробовать снова
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[#131f24]">
            <div className="absolute top-4 left-4 flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                    <Home size={24} />
                </Link>
            </div>

            <TestCard
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
            />
        </div>
    );
}
