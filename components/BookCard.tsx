import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface BookCardProps {
    id: string;
    title: string;
    description: string;
    cover: string;
    level: string;
    isLocked?: boolean;
}

export default function BookCard({ id, title, description, cover, level, isLocked }: BookCardProps) {
    if (isLocked) {
        return (
            <div className="relative group rounded-2xl overflow-hidden bg-neutral-900 border-2 border-neutral-800 opacity-60 grayscale">
                <div className="aspect-[2/3] relative">
                    <Image src={cover} alt={title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-neutral-800 text-neutral-400 px-3 py-1 rounded-lg font-bold text-sm border border-neutral-700">
                            ЗАКРЫТО
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="h-4 w-3/4 bg-neutral-800 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-neutral-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <Link href={`/reader/${id}`}>
            <motion.div
                whileHover={{ y: -8 }}
                className="block group relative rounded-2xl overflow-hidden bg-neutral-800 border-b-4 border-neutral-900 hover:border-blue-500 transition-colors shadow-lg"
            >
                <div className="aspect-[2/3] relative overflow-hidden">
                    <Image
                        src={cover}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
                        УРОВЕНЬ {level}
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-blue-500 rounded-full p-3 shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                            <Play fill="currentColor" size={24} />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-neutral-800">
                    <h3 className="font-bold text-lg mb-1 text-white truncate">{title}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-2">{description}</p>
                </div>
            </motion.div>
        </Link>
    );
}
