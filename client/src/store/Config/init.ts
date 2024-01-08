import { createDomain, createApi } from "effector";

import { ConfigModel, defaultConfigModel } from "../../@types/configModel";
import api from "../../api";
import { ErrNot } from "../../components/NotificationService";

import { $config, $editableConfig, DEFAULT_EDITABLE_CONFIG } from "./state";
import { Effmu, Level, Network } from "../../@types/common";

const DEFAULT_ERROR_MESSAGE =
  "An error has occurred. You are denied access to the service.";

const configDomain = createDomain();

export const { clearConfig } = createApi($config, {
  clearConfig: () => null,
});

export const getConfigRequest = configDomain.createEffect(
  async (params: { alias: string; password: string }) => {
    return await api.get<ConfigModel>("/api/config", params);
  }
);

export const postConfigRequest = configDomain.createEffect(
  async (params: { config: defaultConfigModel; password: string }) => {
    const { config, password } = params;

    await api.postConfigRequest(config, password);
  }
);

export const patchConfigRequest = configDomain.createEffect(
  async ({
    alias,
    config,
    password,
  }: {
    alias: string;
    config: ConfigModel;
    password: string;
  }) => {
    await api.patchConfigRequest(alias, config, password);
    await getConfigRequest({ alias, password: config.password });
  }
);

export const deleteConfigRequest = configDomain.createEffect(
  async (params: { alias: string; password: string }) => {
    await api.deleteConfig(params);
    clearConfig();
  }
);

configDomain.onCreateEffect((effect) => {
  effect.fail.watch(({ error }: { error: any }) =>
    ErrNot(error?.response?.data?.message || DEFAULT_ERROR_MESSAGE)
  );
});

export const editableConfigEvents = createApi($editableConfig, {
  setConfig: (_, config: ConfigModel) => config,
  setConfig2: (_, config: ConfigModel) => config,
  clearConfig: (_) => DEFAULT_EDITABLE_CONFIG,
  handleChangeMail: (config, mail: string) => ({
    ...config,
    mail,
  }),
  handleChangeEffmu: (
    config,
    {
      network,
      effmu,
      type,
    }: { network: Network; effmu: Effmu; type: "ko" | "freezout" }
  ) => ({
    ...config,
    networks: {
      ...config.networks,
      [type]: {
        ...config.networks[type],
        [network]: { ...config.networks[type][network], effmu },
      },
    },
  }),
  handleChangeLevel: (
    config,
    {
      network,
      level,
      type,
    }: { network: Network; level: Level; type: "ko" | "freezout" }
  ) => ({
    ...config,
    networks: {
      ...config.networks,
      [type]: {
        ...config.networks[type],
        [network]: { ...config.networks[type][network], level },
      },
    },
  }),
  handleChangePassword: (config, password: string) => ({
    ...config,
    password,
  }),
  handleTimezoneChange: (config, timezone) => ({ ...config, timezone }),
  handleAddressChange: (config, address) => ({ ...config, address }),
  handleChangeEffmuAll: (config, effmu) => {
    const updatedState = {
      ...config,
      networks: {
        ko: Object.keys(config.networks.ko).reduce((acc, network) => {
          return {
            ...acc,
            [network]: { ...config.networks.ko[network], effmu },
          };
        }, {}),
        freezout: Object.keys(config.networks.freezout).reduce((acc, network) => {
          return {
            ...acc,
            [network]: { ...config.networks.freezout[network], effmu },
          };
        }, {}),
      },
    };
    return updatedState;
  },
  
  handleChangeTime1: (config, time1: string | null) => {
    const updatedState = {
      ...config,
      time1,
    };
    return updatedState;
  },
  handleChangeTime2: (config, time2: string | null) => {
    const updatedState = {
      ...config,
      time2,
    };
    return updatedState;
  },
  handleChangeNormalTime: (config, normalTime: string | null) => {
    const updatedState = {
      ...config,
      normalTime,
    };
    return updatedState;
  },
  handleChangeTurboTime: (config, turboTime: string | null) => {
    const updatedState = {
      ...config,
      turboTime,
    };
    return updatedState;
  },
  handleChangeSuperTurboTime: (config, superTurboTime: string | null) => {
    const updatedState = {
      ...config,
      superTurboTime,
    };
    return updatedState;
  },
});

$config.on(getConfigRequest.doneData, (_, config) => config);
