// Achievements System
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (stats: UserStats) => boolean;
    xpReward: number;
}

export interface UserStats {
    wordsTranslated: number;
    sentencesTranslated: number;
    booksCompleted: number;
    testsPasssed: number;
    totalXP: number;
    streakDays: number;
    minutesSpent: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_word',
        title: 'Первое слово',
        description: 'Переведи своё первое слово',
        icon: '📝',
        condition: (stats) => stats.wordsTranslated >= 1,
        xpReward: 10
    },
    {
        id: 'word_master_10',
        title: 'Начинающий переводчик',
        description: 'Переведи 10 слов',
        icon: '📚',
        condition: (stats) => stats.wordsTranslated >= 10,
        xpReward: 25
    },
    {
        id: 'word_master_50',
        title: 'Опытный переводчик',
        description: 'Переведи 50 слов',
        icon: '🎓',
        condition: (stats) => stats.wordsTranslated >= 50,
        xpReward: 50
    },
    {
        id: 'word_master_100',
        title: 'Мастер слов',
        description: 'Переведи 100 слов',
        icon: '🏆',
        condition: (stats) => stats.wordsTranslated >= 100,
        xpReward: 100
    },
    {
        id: 'first_book',
        title: 'Книголюб',
        description: 'Заверши свою первую книгу',
        icon: '📖',
        condition: (stats) => stats.booksCompleted >= 1,
        xpReward: 50
    },
    {
        id: 'bookworm',
        title: 'Книжный червь',
        description: 'Заверши 3 книги',
        icon: '🐛',
        condition: (stats) => stats.booksCompleted >= 3,
        xpReward: 100
    },
    {
        id: 'first_test',
        title: 'Отличник',
        description: 'Пройди свой первый тест',
        icon: '✅',
        condition: (stats) => stats.testsPasssed >= 1,
        xpReward: 30
    },
    {
        id: 'streak_3',
        title: 'На волне',
        description: 'Занимайся 3 дня подряд',
        icon: '🔥',
        condition: (stats) => stats.streakDays >= 3,
        xpReward: 30
    },
    {
        id: 'streak_7',
        title: 'Неделя успеха',
        description: 'Занимайся 7 дней подряд',
        icon: '💪',
        condition: (stats) => stats.streakDays >= 7,
        xpReward: 70
    },
    {
        id: 'streak_30',
        title: 'Легенда',
        description: 'Занимайся 30 дней подряд',
        icon: '👑',
        condition: (stats) => stats.streakDays >= 30,
        xpReward: 300
    },
    {
        id: 'xp_100',
        title: 'Сотня',
        description: 'Набери 100 XP',
        icon: '💯',
        condition: (stats) => stats.totalXP >= 100,
        xpReward: 20
    },
    {
        id: 'xp_500',
        title: 'Полтысячи',
        description: 'Набери 500 XP',
        icon: '⭐',
        condition: (stats) => stats.totalXP >= 500,
        xpReward: 50
    },
    {
        id: 'xp_1000',
        title: 'Тысячник',
        description: 'Набери 1000 XP',
        icon: '🌟',
        condition: (stats) => stats.totalXP >= 1000,
        xpReward: 100
    },
];

const STATS_KEY = 'audaroky_stats';
const UNLOCKED_ACHIEVEMENTS_KEY = 'audaroky_achievements';
const LAST_ACTIVITY_KEY = 'audaroky_last_activity';

export function getStats(): UserStats {
    if (typeof window === 'undefined') return getDefaultStats();
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return getDefaultStats();
    return JSON.parse(stored);
}

function getDefaultStats(): UserStats {
    return {
        wordsTranslated: 0,
        sentencesTranslated: 0,
        booksCompleted: 0,
        testsPasssed: 0,
        totalXP: 0,
        streakDays: 0,
        minutesSpent: 0
    };
}

export function updateStats(update: Partial<UserStats>) {
    if (typeof window === 'undefined') return;
    const current = getStats();
    const updated = { ...current, ...update };

    // Update total XP from xp.ts
    const xp = parseInt(localStorage.getItem('audaroky_xp') || '0');
    updated.totalXP = xp;

    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    checkAchievements(updated);
}

export function incrementStat(key: keyof UserStats, amount: number = 1) {
    const current = getStats();
    current[key] = (current[key] as number) + amount;

    // Sync XP
    const xp = parseInt(localStorage.getItem('audaroky_xp') || '0');
    current.totalXP = xp;

    localStorage.setItem(STATS_KEY, JSON.stringify(current));
    checkAchievements(current);
}

export function getUnlockedAchievements(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
}

function checkAchievements(stats: UserStats) {
    const unlocked = getUnlockedAchievements();
    const newUnlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
        if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
            unlocked.push(achievement.id);
            newUnlocked.push(achievement);
        }
    }

    if (newUnlocked.length > 0) {
        localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
        // Could trigger a toast notification here
    }
}

// Streak management
export function updateStreak() {
    if (typeof window === 'undefined') return;

    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    const today = new Date().toDateString();

    if (lastActivity === today) return; // Already active today

    const stats = getStats();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActivity === yesterday.toDateString()) {
        // Streak continues
        stats.streakDays += 1;
    } else if (lastActivity !== today) {
        // Streak broken
        stats.streakDays = 1;
    }

    localStorage.setItem(LAST_ACTIVITY_KEY, today);
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getStreak(): number {
    if (typeof window === 'undefined') return 0;
    return getStats().streakDays;
}
