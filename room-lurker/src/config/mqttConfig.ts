export const mqttConfig = {
  host: "192.168.137.154", // raspberry pi ip
  port: 8083,
  protocol: "ws" as const, // ws secure
  path: "/mqtt",

  // login
  username: "admin",
  password: "123burger",

  // connection options
  keepalive: 60,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,

  topics: {
    roomStatus: "rooms/+/emptyStatus",
    roomStatusSpecific: (roomId: string) => `rooms/${roomId}/emptyStatus`,
  },

  // data priority
  qos: {
    roomUpdates: 0 as const, // at most once
    criticalUpdates: 1 as const, // at least once
  },
};

// maybe setup for cloud
export const mqttConfigs = {
  local: {
    ...mqttConfig,
    host: "192.168.137.154",
    port: 8083,
    protocol: "ws" as const,
  },

  // cloud setup, not finished... idk if we need it at all
  cloud: {
    ...mqttConfig,
    host: "",
    port: 8084,
    protocol: "wss" as const,
    username: "",
    password: "",
  },

  public: {
    ...mqttConfig,
    host: "broker.emqx.io",
    port: 8083,
    protocol: "ws" as const,
    username: undefined,
    password: undefined,
  },
};

export const getCurrentMqttConfig = () => {
  const env = process.env.NODE_ENV;

  if (env === "production") {
    return mqttConfigs.cloud;
  } else if (env === "development") {
    return mqttConfigs.local;
  } else {
    return mqttConfigs.public; 
  }
};
