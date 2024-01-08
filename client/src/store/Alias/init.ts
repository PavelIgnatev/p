import { createEffect, createApi } from "effector";
import { $aliases, $allAliases } from "./state";
import api from "../../api";

let cashedAliasesNames: string[] = [];

export const aliasesEvents = createApi($aliases, {
  addAlias: (store, alias: string) => [...store, alias],
  deleteAlias: (store, alias: string) => store.filter((a) => a !== alias),
});

export const getAllAliasesRequest = createEffect(async () => {
  if (cashedAliasesNames.length) {
    return cashedAliasesNames;
  } else {
    const responce = await api.get<string[]>("/api/aliases", {
      level: undefined,
    });
    cashedAliasesNames = responce;
    return responce;
  }
});

export const getAliasesRequest = createEffect(
  async (level?: number | string) => {
    const responce = await api.get<string[]>("/api/aliases", { level });
    cashedAliasesNames = responce;
    return responce;
  }
);

$allAliases.on(getAllAliasesRequest.doneData, (store, aliases) => aliases);
$aliases.on(getAliasesRequest.doneData, (store, aliases) => aliases);
