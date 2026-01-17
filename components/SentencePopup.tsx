import { motion } from 'framer-motion';
import { X, BookOpen, Volume2 } from 'lucide-react';

interface SentencePopupProps {
    sentence: string;
    translation: string;
    grammar: string;
    position: { x: number; y: number };
    onClose: () => void;
    onPlayAudio: () => void;
}

export default function SentencePopup({ sentence, translation, grammar, position, onClose, onPlayAudio }: SentencePopupProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500" />

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-wider text-sm">
                        <BookOpen size={18} />
                        Перевод
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onPlayAudio}
                            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
                        >
                            <Volume2 size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <p className="text-neutral-800 text-xl font-medium mb-8 leading-relaxed">
                    {translation}
                </p>

                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                    <h4 className="font-bold text-blue-600 text-xs uppercase mb-3 tracking-wide">Грамматика</h4>
                    <p className="text-neutral-700 text-base leading-relaxed">
                        {grammar}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
