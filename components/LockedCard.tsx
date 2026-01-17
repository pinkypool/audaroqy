import { Lock } from 'lucide-react';

interface LockedCardProps {
    level: string;
}

export default function LockedCard({ level }: LockedCardProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900/50 border-2 border-dashed border-neutral-800 p-6 flex flex-col items-center justify-center text-center aspect-[2/3] group hover:bg-neutral-900 transition-colors">
            <div className="bg-neutral-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lock className="text-neutral-500" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-neutral-400">Уровень {level} Закрыт</h3>
            <p className="text-xs text-neutral-600 max-w-[150px]">
                Пройдите тест предыдущего уровня, чтобы открыть.
            </p>
        </div>
    );
}
