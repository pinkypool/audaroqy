'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Crown } from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookTitle?: string;
}

export default function PricingModal({ isOpen, onClose, bookTitle }: PricingModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-[#1a2a32] rounded-3xl max-w-md w-full border border-neutral-700 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-center relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                                >
                                    <X size={18} />
                                </button>
                                <Crown className="mx-auto mb-2 text-white" size={48} />
                                <h2 className="text-2xl font-bold text-white">Разблокировать доступ</h2>
                                {bookTitle && (
                                    <p className="text-white/80 text-sm mt-1">"{bookTitle}"</p>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="p-6 space-y-4">
                                <div className="bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700 hover:border-green-500 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white">Месячная подписка</h3>
                                            <p className="text-neutral-400 text-sm">Все книги и функции</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-400">990 ₸</p>
                                            <p className="text-neutral-500 text-xs">/месяц</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 border-2 border-green-400 cursor-pointer relative">
                                    <div className="absolute -top-3 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                        ВЫГОДНО
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white">Годовая подписка</h3>
                                            <p className="text-white/80 text-sm">Экономия 40%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-white">6990 ₸</p>
                                            <p className="text-white/70 text-xs">/год</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700 hover:border-blue-500 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white">Одна книга</h3>
                                            <p className="text-neutral-400 text-sm">Навсегда</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-400">490 ₸</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 pt-0">
                                <button
                                    onClick={onClose}
                                    className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Попробовать бесплатно 7 дней
                                </button>
                                <p className="text-center text-neutral-500 text-xs mt-3">
                                    Отмена в любое время
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
