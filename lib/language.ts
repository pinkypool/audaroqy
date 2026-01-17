export const LANGUAGES = {
    ru: 'Russian',
    kz: 'Kazakh',
} as const;

type LanguageKey = keyof typeof LANGUAGES;
export type Language = LanguageKey;
