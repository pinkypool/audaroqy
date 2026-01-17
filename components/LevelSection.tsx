import BookCard from './BookCard';
import LockedCard from './LockedCard';
import { motion } from 'framer-motion';

interface Book {
    id: string;
    title: string;
    description: string;
    cover: string;
    level: string;
}

interface LevelSectionProps {
    level: string;
    title: string;
    books: Book[];
    isUnlocked: boolean;
    color: string; // e.g., 'bg-green-500'
}

export default function LevelSection({ level, title, books, isUnlocked, color }: LevelSectionProps) {
    return (
        <section className="mb-16 relative">
            {/* Connector Line */}
            <div className="absolute left-6 top-12 bottom-[-64px] w-1 bg-neutral-800 -z-10 last:hidden" />

            <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-2xl ${isUnlocked ? color : 'bg-neutral-800'} flex items-center justify-center text-xl font-bold text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] z-10`}>
                    {level}
                </div>
                <div>
                    <h2 className={`text-2xl font-bold ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>{title}</h2>
                    <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">
                        {isUnlocked ? `${books.length} Books Available` : 'Locked Level'}
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pl-4 md:pl-16"
            >
                {isUnlocked ? (
                    <>
                        {books.map((book) => (
                            <BookCard key={book.id} {...book} />
                        ))}
                        {/* Premium Placeholder */}
                        <BookCard
                            id="premium-1"
                            title="Premium Library"
                            description="Unlock 100+ more books"
                            cover="https://placehold.co/400x600/ffd700/333?text=Premium"
                            level={level}
                            isLocked={true}
                        />
                    </>
                ) : (
                    <>
                        <LockedCard level={level} />
                        <LockedCard level={level} />
                        <LockedCard level={level} />
                    </>
                )}
            </motion.div>
        </section>
    );
}
