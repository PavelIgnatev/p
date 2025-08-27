import { createEvent, createStore } from "effector";

export const goToFirstPage = createEvent();

export const $goToFirstPageTick = createStore(0).on(goToFirstPage, (n) => n + 1);


