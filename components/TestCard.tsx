import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

interface TestCardProps {
    question: Question;
    onAnswer: (index: number) => void;
    currentIndex: number;
    totalQuestions: number;
}

export default function TestCard({ question, onAnswer, currentIndex, totalQuestions }: TestCardProps) {
    const { t } = useLanguage();

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <span className="text-neutral-500 font-mono text-sm">{t('question')} {currentIndex + 1} / {totalQuestions}</span>
                <div className="h-2 w-32 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                {question.question}
            </h3>

            <div className="space-y-4">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswer(idx)}
                        className="w-full text-left p-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-transparent hover:border-blue-500 transition-all duration-200 text-neutral-200 hover:text-white font-medium"
                    >
                        <span className="inline-block w-8 h-8 rounded-full bg-neutral-700 text-neutral-400 text-center leading-8 mr-4 text-sm">
                            {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
