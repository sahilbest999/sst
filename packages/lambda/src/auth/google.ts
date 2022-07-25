import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { generators, IdTokenClaims, Issuer } from "openid-client";
import {
  useCookie,
  useDomainName,
  useFormData,
  usePath
} from "../context/http.js";
import { createAdapter } from "./provider.js";

const issuer = await Issuer.discover("https://accounts.google.com");

interface Config {
  clientID: string;
  onSuccess: (
    claims: IdTokenClaims
  ) => Promise<APIGatewayProxyStructuredResultV2>;
}

declare module "./provider.js" {
  export interface Adapters {
    google: typeof GoogleAdapter;
  }
}

export const GoogleAdapter = createAdapter({
  handle: async (config: Config) => {
    const [step] = usePath().slice(-1);
    const callback =
      "https://" +
      useDomainName() +
      [...usePath().slice(0, -1), "callback"].join("/");

    if (step === "authorize") {
      const client = new issuer.Client({
        client_id: config.clientID,
        redirect_uris: [callback],
        response_types: ["id_token"]
      });
      const nonce = generators.nonce();
      const url = client.authorizationUrl({
        scope: "openid email profile",
        response_mode: "form_post",
        nonce
      });
      // writeCookie("auth-nonce", nonce);

      const expires = new Date(Date.now() + 1000 * 30).toUTCString();
      return {
        statusCode: 302,
        cookies: [`auth-nonce=${nonce}; HttpOnly; expires=${expires}`],
        headers: {
          location: url
        }
      };
    }

    if (step === "callback") {
      const client = new issuer.Client({
        client_id: config.clientID,
        response_types: ["id_token"]
      });
      const form = useFormData();
      if (!form) throw new Error("Missing body");
      const nonce = useCookie("auth-nonce");
      const tokenset = await client.callback(
        callback,
        {
          id_token: form.get("id_token")!
        },
        {
          nonce
        }
      );
      return config.onSuccess(tokenset.claims());
    }

    throw new Error("Invalid auth request");
  }
});
