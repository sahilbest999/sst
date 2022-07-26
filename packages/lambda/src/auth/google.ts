import { Issuer } from "openid-client";
import { OidcAdapter, OidcConfig } from "./oidc.js";
import { createAdapter } from "./provider.js";

const issuer = await Issuer.discover("https://accounts.google.com");

type Config = Omit<OidcConfig, "issuer">;

declare module "./provider.js" {
  export interface Adapters {
    google: typeof GoogleAdapter;
  }
}

export const GoogleAdapter = createAdapter({
  handle: async (config: Config) => {
    return OidcAdapter.handle({
      issuer,
      ...config
    });
  }
});
