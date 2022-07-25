import { Handler } from "../context/handler.js";
import { usePath } from "../context/http.js";
import { AdaptersUnion, Provider } from "./provider.js";

export * from "./google.js";

export function AuthHandler<
  Providers extends Record<string, Provider<AdaptersUnion>>
>(config: { providers: Providers }) {
  return Handler("api", async () => {
    const [providerName] = usePath().slice(-2);
    const provider = config.providers[providerName];
    if (!provider) throw new Error("No matching provider found");
    return provider.adapter.handle(provider.config);
  });
}
