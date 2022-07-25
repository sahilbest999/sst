import { Context } from "../context/context.js";
import { useHeader } from "../context/http.js";
import { createSigner, createVerifier } from "fast-jwt";
import type { Session } from "./index.js";

type SessionValue = {
  [type in keyof Session]: {
    type: type;
    properties: Session[type];
  };
}[keyof Session];

const KEY = "12345678";
const signer = createSigner({ key: KEY });
const verifier = createVerifier({ key: KEY });

export function createSession<T extends keyof Session>(
  type: T,
  properties: Session[T]
) {
  const token = signer({
    type,
    properties
  });
  return token;
}

export const useSession = /* @__PURE__ */ Context.memo(() => {
  const header = useHeader("authorization");
  if (!header) return;
  if (!header.startsWith("Bearer ")) return;
  const token = header.substring(7);
  return verifier(token) as SessionValue;
});
