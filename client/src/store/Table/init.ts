import { getStoreRequest } from './../Store/init';
import { createEffect, createEvent } from "effector";

import { tableCellModel } from "../../@types/tableCellModel";
import { $tournamentsSettings } from "../Select";
import { ErrNot } from "../../components/NotificationService";
import { $tableState } from "./state";

import api from "../../api";

export const fetchUserReposFx = createEffect(async () => {
  const tournamentsSettings = $tournamentsSettings.getState();
  await getStoreRequest();

  try {
    return await api.get<tableCellModel[]>("/api/tour", {
      network: tournamentsSettings.network?.map((elem) => elem.value).join(","),
      time: tournamentsSettings.time?.value ?? 0,
    });
  } catch (error: any) {
    ErrNot(error?.response?.data?.message || "The request failed. Try again.");
  }
});

export const clearTableState = createEvent();

$tableState.on(clearTableState, () => null);

$tableState.on(fetchUserReposFx, () => null);
$tableState.on(fetchUserReposFx.doneData, (_, data) => data);
