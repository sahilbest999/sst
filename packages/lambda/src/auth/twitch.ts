import { Issuer } from "openid-client";
import { OidcAdapter, OidcConfig } from "./oidc.js";
import { createAdapter } from "./provider.js";

const issuer = await Issuer.discover("https://id.twitch.tv/oauth2");

type Config = Omit<OidcConfig, "issuer">;

declare module "./provider.js" {
  export interface Adapters {
    google: typeof TwitchAdapter;
  }
}

export const TwitchAdapter = createAdapter({
  handle: async (config: Config) => {
    return OidcAdapter.handle({
      issuer,
      ...config
    });
  }
});
