'use client';

import { useEffect, useState } from 'react';
import { getProgress } from '@/lib/progress';
import LevelSection from '@/components/LevelSection';
import BookCard from '@/components/BookCard';
import PricingModal from '@/components/PricingModal';
import bookA from '@/data/bookA.json';
import bookB from '@/data/bookB.json';
import bookC from '@/data/bookC.json';
import bookD from '@/data/bookD.json';
import bookE from '@/data/bookE.json';
import bookF from '@/data/bookF.json';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Star, User, Flame, Gamepad2, Lock, Plus } from 'lucide-react';
import { getXP } from '@/lib/xp';
import { getStreak, updateStreak } from '@/lib/achievements';

interface LevelsClientProps {
    covers: Record<string, string>;
}

export default function LevelsClient({ covers: COVERS }: LevelsClientProps) {
    const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [pricingOpen, setPricingOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<string>('');

    useEffect(() => {
        updateStreak();
        const progress = getProgress();
        setUnlockedLevels(progress.unlockedLevels);
        setXp(getXP());
        setStreak(getStreak());
    }, []);

    const openPricing = (bookTitle: string) => {
        setSelectedBook(bookTitle);
        setPricingOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#131f24] text-white">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-[#131f24]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <Image src="/logo_white.svg" alt="Logo" width={32} height={32} />
                    <h1 className="text-xl font-bold tracking-tight">
                        Audar<span className="text-green-500">Oqu</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                        <Flame size={18} />
                        <span>{streak}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                        <Trophy size={18} />
                        <span>{xp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/profile">
                            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors">
                                <User size={18} className="text-green-400" />
                            </div>
                        </Link>
                        <Link href="/games">
                            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors">
                                <Gamepad2 size={18} className="text-purple-400" />
                            </div>
                        </Link>

                    </div>
                </div>
            </header>

            <main className="p-6 max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">Ваш путь обучения</h2>
                    <p className="text-neutral-400 text-sm">Читайте книги и открывайте новые уровни</p>
                </div>

                {/* Level A - Beginner */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center font-bold text-lg">A</div>
                        <div>
                            <h3 className="font-bold">Начинающий</h3>
                            <p className="text-neutral-500 text-sm">A1 уровень</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Unlocked book */}
                        <Link href="/reader/book-a">
                            <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-green-500 transition-all hover:scale-[1.02] cursor-pointer">
                                <div className="aspect-[3/4] relative">
                                    <Image src={COVERS['Prince']} alt={bookA.title} fill className="object-cover" />
                                </div>
                                <div className="p-3">
                                    <p className="font-medium text-sm truncate">{bookA.title}</p>
                                    <p className="text-green-400 text-xs">Доступно</p>
                                </div>
                            </div>
                        </Link>

                        {/* Locked books */}
                        <div onClick={() => openPricing(bookD.title)} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-500 transition-all cursor-pointer opacity-80">
                            <div className="aspect-[3/4] relative">
                                <Image src={COVERS['HarryPotter']} alt={bookD.title} fill className="object-cover grayscale" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Lock className="text-yellow-500" size={32} />
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">{bookD.title}</p>
                                <p className="text-yellow-500 text-xs">Закрыто</p>
                            </div>
                        </div>

                        {/* Add your book */}
                        <div onClick={() => setPricingOpen(true)} className="bg-neutral-900/50 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-green-500 transition-all cursor-pointer flex flex-col items-center justify-center aspect-[3/4] p-4">
                            <Plus size={40} className="text-neutral-600 mb-2" />
                            <p className="text-neutral-500 text-sm text-center">Добавить свою книгу</p>
                        </div>
                    </div>
                </div>

                {/* Level B - Intermediate */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${unlockedLevels.includes('B') ? 'bg-blue-500' : 'bg-neutral-700'}`}>B</div>
                        <div>
                            <h3 className="font-bold">Средний</h3>
                            <p className="text-neutral-500 text-sm">A2-B1 уровень</p>
                        </div>
                        {!unlockedLevels.includes('B') && <Lock size={16} className="text-neutral-500" />}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {unlockedLevels.includes('B') ? (
                            <Link href="/reader/book-b">
                                <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-blue-500 transition-all hover:scale-[1.02] cursor-pointer">
                                    <div className="aspect-[3/4] relative">
                                        <Image src={COVERS['Sherlock']} alt={bookB.title} fill className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <p className="font-medium text-sm truncate">{bookB.title}</p>
                                        <p className="text-blue-400 text-xs">Доступно</p>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div onClick={() => openPricing(bookB.title)} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 cursor-pointer opacity-60">
                                <div className="aspect-[3/4] relative">
                                    <Image src={COVERS['Sherlock']} alt={bookB.title} fill className="object-cover grayscale" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Lock className="text-neutral-400" size={32} />
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="font-medium text-sm truncate">{bookB.title}</p>
                                    <p className="text-neutral-500 text-xs">Пройдите уровень A</p>
                                </div>
                            </div>
                        )}

                        <div onClick={() => openPricing(bookE.title)} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-500 transition-all cursor-pointer opacity-80">
                            <div className="aspect-[3/4] relative">
                                <Image src={COVERS['BookE']} alt={bookE.title} fill className="object-cover grayscale" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Lock className="text-yellow-500" size={32} />
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">{bookE.title}</p>
                                <p className="text-yellow-500 text-xs">Закрыто</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level C - Advanced */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${unlockedLevels.includes('C') ? 'bg-purple-500' : 'bg-neutral-700'}`}>C</div>
                        <div>
                            <h3 className="font-bold">Продвинутый</h3>
                            <p className="text-neutral-500 text-sm">B2+ уровень</p>
                        </div>
                        {!unlockedLevels.includes('C') && <Lock size={16} className="text-neutral-500" />}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {unlockedLevels.includes('C') ? (
                            <Link href="/reader/book-c">
                                <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-purple-500 transition-all hover:scale-[1.02] cursor-pointer">
                                    <div className="aspect-[3/4] relative">
                                        <Image src={COVERS['1984']} alt={bookC.title} fill className="object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <p className="font-medium text-sm truncate">{bookC.title}</p>
                                        <p className="text-purple-400 text-xs">Доступно</p>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div onClick={() => openPricing(bookC.title)} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 cursor-pointer opacity-60">
                                <div className="aspect-[3/4] relative">
                                    <Image src={COVERS['1984']} alt={bookC.title} fill className="object-cover grayscale" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Lock className="text-neutral-400" size={32} />
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="font-medium text-sm truncate">{bookC.title}</p>
                                    <p className="text-neutral-500 text-xs">Пройдите уровень B</p>
                                </div>
                            </div>
                        )}

                        <div onClick={() => openPricing(bookF.title)} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-500 transition-all cursor-pointer opacity-80">
                            <div className="aspect-[3/4] relative">
                                <Image src={COVERS['BookF']} alt={bookF.title} fill className="object-cover grayscale" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Lock className="text-yellow-500" size={32} />
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">{bookF.title}</p>
                                <p className="text-yellow-500 text-xs">Закрыто</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PricingModal
                isOpen={pricingOpen}
                onClose={() => setPricingOpen(false)}
                bookTitle={selectedBook}
            />
        </div>
    );
}
