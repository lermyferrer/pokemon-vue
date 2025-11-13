import { ref } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'pokedex-theme';

const applyThemeClass = (isDark: boolean) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
};

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);
  let mediaQuery: MediaQueryList | null = null;
  let handleMediaChange: ((event: MediaQueryListEvent) => void) | null = null;
  let initialized = false;

  const setTheme = (value: boolean, persist = true) => {
    isDark.value = value;
    applyThemeClass(value);

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    setTheme(!isDark.value);
  };

  const initialize = () => {
    if (initialized || typeof window === 'undefined') {
      return;
    }

    initialized = true;

    const storedTheme = localStorage.getItem(STORAGE_KEY);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme === 'dark', false);
    } else {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches, false);
    }

    if (!mediaQuery) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }

    handleMediaChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setTheme(event.matches, false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
  };

  return {
    isDark,
    initialize,
    toggleTheme,
    setTheme,
  };
});

