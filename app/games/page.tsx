'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Home, Gamepad2, Brain, Zap } from 'lucide-react';

const GAMES = [
    {
        id: 'match',
        title: 'Найди пару',
        description: 'Соедини английские слова с русскими переводами',
        icon: '🎯',
        color: 'from-green-500 to-emerald-600',
        href: '/games/match'
    },
    {
        id: 'coming1',
        title: 'Собери предложение',
        description: 'Расставь слова в правильном порядке',
        icon: '🧩',
        color: 'from-blue-500 to-indigo-600',
        href: '#',
        locked: true
    },
    {
        id: 'coming2',
        title: 'Угадай слово',
        description: 'Угадай слово по картинке',
        icon: '🖼️',
        color: 'from-purple-500 to-pink-600',
        href: '#',
        locked: true
    },
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-[#131f24] text-white p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/levels" className="text-neutral-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <Link href="/" className="text-neutral-400 hover:text-white">
                        <Home size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Gamepad2 className="text-green-500" />
                        Мини-игры
                    </h1>
                </div>

                <p className="text-neutral-400 mb-8">
                    Играй и учи английский одновременно! 🎮
                </p>

                <div className="space-y-4">
                    {GAMES.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {game.locked ? (
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl grayscale">{game.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-lg">{game.title}</h3>
                                            <p className="text-sm text-neutral-500">{game.description}</p>
                                            <p className="text-xs text-neutral-600 mt-1">🔒 Скоро</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href={game.href}>
                                    <div className={`bg-gradient-to-r ${game.color} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{game.icon}</div>
                                            <div>
                                                <h3 className="font-bold text-lg">{game.title}</h3>
                                                <p className="text-sm text-white/80">{game.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
