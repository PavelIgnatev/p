import { createEvent, createStore } from 'effector';

export type Theme = 'light' | 'dark';

export const toggleTheme = createEvent();
export const setTheme = createEvent<Theme>();

export const $theme = createStore<Theme>('light')
  .on(toggleTheme, (state) => state === 'light' ? 'dark' : 'light')
  .on(setTheme, (_, theme) => theme);

// Инициализация темы из localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme) {
    setTheme(savedTheme);
  }
}

// Сохранение темы в localStorage при изменении
$theme.watch((theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}); 