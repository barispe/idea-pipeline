import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

const THEME_KEY = '__idea_pipeline_theme__';

function getInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    // Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    // Apply immediately on mount (before first render flicker)
    useEffect(() => {
        applyTheme(getInitialTheme());
    }, []);

    function toggleTheme() {
        setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
    }

    return { theme, toggleTheme };
}
