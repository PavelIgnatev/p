import { createEvent, createStore } from "effector";

export type Theme = "light" | "dark";

export const toggleTheme = createEvent();
export const setTheme = createEvent<Theme>();

const initialTheme: Theme = (localStorage.getItem("theme") as Theme) || "light";

export const $theme = createStore<Theme>(initialTheme)
  .on(setTheme, (_, theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    return theme;
  })
  .on(toggleTheme, (currentTheme) => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    return newTheme;
  });

document.documentElement.setAttribute("data-theme", initialTheme); 