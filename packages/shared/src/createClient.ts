import { CONFIG_TEST, StreamrClient, StreamrClientConfig } from 'streamr-client';

const DEV_NETWORK_CONFIG: StreamrClientConfig = {
  ...CONFIG_TEST,
  // logLevel: 'info',
};

export const createClient = (privateKey: string, devNetwork: boolean = false) => {
  const config: StreamrClientConfig = {
    ...(devNetwork ? DEV_NETWORK_CONFIG : {}),
    logLevel: 'trace',
    auth: {
      privateKey,
    },
  };

  return new StreamrClient(config);
};
