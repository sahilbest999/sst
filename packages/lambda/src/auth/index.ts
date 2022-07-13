import { GoogleAdapter, TwitterAdapter } from "./adapters/google";

type Adapter = {
  callback: any;
};

function provider<T extends Adapter>(config: { start: () => T }) {
  return config;
}

provider({
  start: () => {
    if (process.env) return GoogleAdapter({} as any);
    return TwitterAdapter({} as any);
  },
});
