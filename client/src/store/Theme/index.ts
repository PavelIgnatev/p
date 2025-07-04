import { createEvent, createStore } from "effector";
import { Theme } from "../types";

export const toggleTheme = createEvent();
export const setTheme = createEvent<Theme>();
export const setCanToggleTheme = createEvent<boolean>();

const initialTheme: Theme = (localStorage.getItem("theme") as Theme) || "light";

// Состояние, определяющее, можно ли переключать тему
export const $canToggleTheme = createStore<boolean>(true)
  .on(setCanToggleTheme, (_, canToggle) => canToggle);

export const $theme = createStore<Theme>(initialTheme)
  .on(setTheme, (_, theme) => {
    if (!$canToggleTheme.getState()) return initialTheme;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    return theme;
  })
  .on(toggleTheme, (currentTheme) => {
    if (!$canToggleTheme.getState()) return currentTheme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    return newTheme;
  });

document.documentElement.setAttribute("data-theme", initialTheme); 