export const XP_EVENTS = {
    TRANSLATE_WORD: 1,
    TRANSLATE_SENTENCE: 5,
    FINISH_CHAPTER: 50,
    FINISH_TEST: 100,
};

export const getXP = (): number => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('user_xp') || '0', 10);
};

export const addXP = (amount: number) => {
    if (typeof window === 'undefined') return;
    const current = getXP();
    const newAmount = current + amount;
    localStorage.setItem('user_xp', newAmount.toString());
    // Dispatch event for UI updates
    window.dispatchEvent(new Event('xp_updated'));
    return newAmount;
};
