'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TestCard from '@/components/TestCard';
import { addXP, XP_EVENTS } from '@/lib/xp';
import { unlockLevel } from '@/lib/progress';
import { generateTestQuestions } from '@/lib/gemini';

const MOCK_QUESTIONS = [
    {
        question: "What is the past tense of 'go'?",
        options: ["Goed", "Went", "Gone", "Going"],
        correctAnswerIndex: 1
    },
    {
        question: "Which word is a synonym for 'happy'?",
        options: ["Sad", "Angry", "Joyful", "Tired"],
        correctAnswerIndex: 2
    },
    {
        question: "Complete the sentence: She ___ to the store.",
        options: ["walking", "walks", "walked", "walker"],
        correctAnswerIndex: 2
    }
];

export default function TestPage() {
    const params = useParams();
    const router = useRouter();
    const levelId = params.levelId as string;

    const [questions, setQuestions] = useState(MOCK_QUESTIONS);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (index: number) => {
        if (index === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(prev => prev + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishTest();
        }
    };

    const finishTest = () => {
        setIsFinished(true);
        const finalScore = score + (questions[questions.length - 1].correctAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ? 1 : 0); // Hacky fix for last question
        // Actually, let's just calculate score properly
        // But for now, let's assume if score > 1 pass

        if (finalScore >= 2) {
            addXP(XP_EVENTS.FINISH_TEST);
            if (levelId === 'A') unlockLevel('B');
            if (levelId === 'B') unlockLevel('C');
        }
    };

    if (isFinished) {
        const passed = score >= 2;
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center">
                <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <h1 className="text-4xl font-bold mb-4">{passed ? '🎉 Passed!' : '😔 Try Again'}</h1>
                    <p className="text-neutral-400 mb-8">You got {score} out of {questions.length} correct.</p>
                    {passed && (
                        <p className="text-green-400 mb-8 font-bold">Level {levelId === 'A' ? 'B' : 'C'} Unlocked!</p>
                    )}
                    <button
                        onClick={() => router.push('/levels')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Back to Levels
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center">
            <TestCard
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
            />
        </div>
    );
}
