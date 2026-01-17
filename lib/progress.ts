export interface BookProgress {
    bookId: string;
    currentChapter: number;
    totalChapters: number;
    isCompleted: boolean;
}

export interface UserProgress {
    unlockedLevels: string[]; // 'A', 'B', 'C'
    books: Record<string, BookProgress>;
}

const DEFAULT_PROGRESS: UserProgress = {
    unlockedLevels: ['A'],
    books: {},
};

export const getProgress = (): UserProgress => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    const stored = localStorage.getItem('user_progress');
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
};

export const saveProgress = (progress: UserProgress) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_progress', JSON.stringify(progress));
};

export const unlockLevel = (level: string) => {
    const progress = getProgress();
    if (!progress.unlockedLevels.includes(level)) {
        progress.unlockedLevels.push(level);
        saveProgress(progress);
    }
};

export const updateBookProgress = (bookId: string, chapterIndex: number, totalChapters: number) => {
    const progress = getProgress();
    const book = progress.books[bookId] || { bookId, currentChapter: 0, totalChapters, isCompleted: false };

    if (chapterIndex > book.currentChapter) {
        book.currentChapter = chapterIndex;
    }

    if (chapterIndex >= totalChapters - 1) {
        book.isCompleted = true;
    }

    progress.books[bookId] = book;
    saveProgress(progress);
};
