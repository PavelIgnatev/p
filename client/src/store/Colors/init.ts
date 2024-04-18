import { createEffect, createApi } from "effector";
import api from "../../api";
import { $colors } from "./state";

export const getColors = createEffect(async () => {
  const result = await api.get<number[]>("/api/colors");

  return result;
});

export const postColors = createEffect(
  async ({ colors }: { colors: number[] }) => {
    console.log(colors)
    await api.postColors(colors);
  }
);

export const { handleChangeColors } = createApi($colors, {
  handleChangeColors: (_, colors: number[]) => colors,
});

$colors.on(getColors.doneData, (_, colors) => colors);

getColors();
