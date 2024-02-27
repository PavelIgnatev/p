import { createDomain } from "effector";

import api from "../../api";

import { $store, StoreModel } from "./state";

const storeDomain = createDomain();

export const getStoreRequest = storeDomain.createEffect(async () => {
  const offpeak = await api.get<StoreModel["offpeak"]>("/api/store/offpeak");
  const currency = await api.get<StoreModel["currency"]>("/api/store/currency");
  const score1 = await api.get<StoreModel["score1"]>("/api/store/score1");
  const evscore = await api.get<StoreModel["evscore"]>("/api/store/evscore");

  return { offpeak, currency, score1, evscore };
});

$store.on(getStoreRequest.doneData, (_, store) => store);
