'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStats, getUnlockedAchievements, ACHIEVEMENTS, updateStreak, getStreak } from '@/lib/achievements';
import { getXP } from '@/lib/xp';
import { getProgress } from '@/lib/progress';
import { ChevronLeft, Flame, Trophy, BookOpen, Target, Clock, Star, Award } from 'lucide-react';

export default function ProfilePage() {
    const [stats, setStats] = useState({
        wordsTranslated: 0,
        sentencesTranslated: 0,
        booksCompleted: 0,
        testsPasssed: 0,
        totalXP: 0,
        streakDays: 0,
        minutesSpent: 0
    });
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        updateStreak();
        setStats(getStats());
        setUnlockedIds(getUnlockedAchievements());
        const currentXP = getXP();
        setXp(currentXP);
        setLevel(Math.floor(currentXP / 100) + 1);
    }, []);

    const avatars = ['🐣', '🐥', '🐤', '🦆', '🦅', '🦉', '🦚', '🦋', '🐉', '👑'];
    const currentAvatar = avatars[Math.min(level - 1, avatars.length - 1)];

    return (
        <div className="min-h-screen bg-[#131f24] text-white p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/levels" className="text-neutral-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold">Мой профиль</h1>
                </div>

                {/* Avatar & Level */}
                <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-6 mb-6 text-center">
                    <div className="text-7xl mb-4">{currentAvatar}</div>
                    <h2 className="text-2xl font-bold mb-2">Уровень {level}</h2>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                        <Star size={20} fill="currentColor" />
                        <span className="font-bold">{xp} XP</span>
                    </div>
                    <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${(xp % 100)}%` }}
                        />
                    </div>
                    <p className="text-sm text-white/70 mt-2">{100 - (xp % 100)} XP до следующего уровня</p>
                </div>

                {/* Streak */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6 flex items-center gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-xl">
                        <Flame className="text-orange-500" size={32} />
                    </div>
                    <div>
                        <p className="text-neutral-400 text-sm">Серия дней</p>
                        <p className="text-2xl font-bold">{stats.streakDays} {stats.streakDays === 1 ? 'день' : 'дней'} 🔥</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatCard icon={<BookOpen />} label="Слов переведено" value={stats.wordsTranslated} color="text-blue-400" />
                    <StatCard icon={<Target />} label="Тестов пройдено" value={stats.testsPasssed} color="text-green-400" />
                    <StatCard icon={<Trophy />} label="Книг завершено" value={stats.booksCompleted} color="text-yellow-400" />
                    <StatCard icon={<Award />} label="Достижений" value={unlockedIds.length} color="text-purple-400" />
                </div>

                {/* Achievements */}
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={24} />
                    Достижения
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = unlockedIds.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`p-4 rounded-xl border transition-all ${isUnlocked
                                        ? 'bg-neutral-800 border-yellow-500/50'
                                        : 'bg-neutral-900/50 border-neutral-800 opacity-50 grayscale'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{ach.icon}</div>
                                <h4 className="font-bold text-sm">{ach.title}</h4>
                                <p className="text-xs text-neutral-400">{ach.description}</p>
                                {isUnlocked && (
                                    <p className="text-xs text-yellow-500 mt-2">+{ach.xpReward} XP</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-neutral-500 text-sm">
                    <Image src="/logo_grey.svg" alt="NomadSmart" width={100} height={30} className="mx-auto mb-2 opacity-50" />
                    <p>Powered by NomadSmart</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className={`${color} mb-2`}>{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-neutral-400">{label}</p>
        </div>
    );
}
