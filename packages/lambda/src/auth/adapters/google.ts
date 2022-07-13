import { define } from "./index.js";
import { Issuer } from "openid-client";

interface GoogleAdapterConfig {
  clientID: string;
  clientSecret: string;
  scopes?: string[];
}

export const GoogleAdapter = (config: GoogleAdapterConfig) => {
  return {
    callback: {
      email: "lol",
    },
  };
};

interface TwitterAdapterConfig {}
export const TwitterAdapter = (config: TwitterAdapterConfig) => {
  return {
    callback: {
      username: "lol",
    },
  };
};
