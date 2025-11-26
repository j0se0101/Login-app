import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="fixed z-50 bottom-6 right-6 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-soft border border-gray-200/70 dark:border-gray-700/60 hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Cambiar tema"
      title={theme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro'}
    >
      {theme === 'dark' ? (
        // Sol
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        // Luna
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707 8 8 0 1017.293 13.293z" />
        </svg>
      )}
    </button>
  );
}
