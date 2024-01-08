import { createStore } from "effector";

export interface StoreModel {
  score1: {};
  currency: number;
  offpeak: any;
}

export const DEFAULT_STORE: StoreModel = {
  score1: {},
  currency: 0,
  offpeak: {},
};

export const $store = createStore<StoreModel>(DEFAULT_STORE);
