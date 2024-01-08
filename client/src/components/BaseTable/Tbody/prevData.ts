import { createEvent, createStore } from "effector";

export const clearPrevData = createEvent();
export const setPrevData = createEvent();
export const $prevData = createStore(
  JSON.parse(localStorage.getItem("deletedItems") || "[]")
)
  .on(setPrevData, (_, prevData) => prevData)
  .on(clearPrevData, () => {
    localStorage.setItem("deletedItems", "[]");
    return [];
  });
