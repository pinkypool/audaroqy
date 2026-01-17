import { motion } from 'framer-motion';
import { Volume2, FileText } from 'lucide-react';

interface WordPopupProps {
    word: string;
    translation: string;
    position: { x: number; y: number };
    onClose: () => void;
    onTranslateSentence: () => void;
    onPlayAudio: () => void;
}

export default function WordPopup({ word, translation, position, onClose, onTranslateSentence, onPlayAudio }: WordPopupProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 min-w-[240px] border-2 border-neutral-100 flex flex-col gap-3"
            style={{ left: position.x, top: position.y + 20 }}
        >
            <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t-2 border-l-2 border-neutral-100 transform rotate-45" />

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-700 text-lg capitalize">{word}</h3>
                    <button onClick={onPlayAudio} className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50">
                        <Volume2 size={16} />
                    </button>
                </div>
                <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    &times;
                </button>
            </div>

            <div className="text-blue-500 font-bold text-xl">{translation}</div>

            <button
                onClick={onTranslateSentence}
                className="flex items-center justify-center gap-2 w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-sm font-bold py-2 rounded-xl transition-colors"
            >
                <FileText size={14} />
                Перевести предложение
            </button>
        </motion.div>
    );
}
