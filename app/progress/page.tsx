'use client';

import { useEffect, useState } from 'react';
import { getXP } from '@/lib/xp';
import { getProgress, UserProgress } from '@/lib/progress';
import Link from 'next/link';

export default function ProgressPage() {
    const [xp, setXp] = useState(0);
    const [progress, setProgress] = useState<UserProgress | null>(null);

    useEffect(() => {
        setXp(getXP());
        setProgress(getProgress());
    }, []);

    if (!progress) return null;

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <Link href="/levels" className="text-neutral-500 hover:text-white mb-4 inline-block">&larr; Back to Library</Link>
                <h1 className="text-4xl font-bold">Your Progress</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <h2 className="text-neutral-500 uppercase tracking-wider text-sm mb-2">Total XP</h2>
                    <div className="text-6xl font-bold text-blue-500">{xp}</div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <h2 className="text-neutral-500 uppercase tracking-wider text-sm mb-2">Current Level</h2>
                    <div className="text-6xl font-bold text-white">{progress.unlockedLevels[progress.unlockedLevels.length - 1]}</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Books Read</h2>
            <div className="space-y-4">
                {Object.values(progress.books).map((book) => (
                    <div key={book.bookId} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg mb-1 capitalize">{book.bookId.replace('-', ' ')}</h3>
                            <p className="text-neutral-500 text-sm">Chapter {book.currentChapter} / {book.totalChapters}</p>
                        </div>
                        {book.isCompleted && (
                            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-bold">Completed</span>
                        )}
                    </div>
                ))}
                {Object.keys(progress.books).length === 0 && (
                    <p className="text-neutral-500">No books started yet.</p>
                )}
            </div>
        </div>
    );
}
