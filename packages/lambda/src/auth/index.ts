import { createSigner, createVerifier, SignerOptions } from "fast-jwt";
import { Context } from "../context/context.js";
import { useHeader } from "../context/http.js";

export * from "./auth.js";
export * from "./google.js";
export * from "./session.js";

export interface Session {}

export type SessionValue = {
  [type in keyof Session]: {
    type: type;
    properties: Session[type];
  };
}[keyof Session];

const KEY = "12345678";
const verifier = createVerifier({ key: KEY });

export function createSession<T extends keyof Session>(
  type: T,
  properties: Session[T],
  options?: Partial<SignerOptions>
) {
  const signer = createSigner(Object.assign(options || {}, { key: KEY }));
  console.log(signer);
  const token = signer({
    type,
    properties
  });
  return token;
}

const SessionMemo = /* @__PURE__ */ Context.memo(() => {
  const header = useHeader("authorization")!;
  const token = header.substring(7);
  const jwt = verifier(token);
  return jwt;
});

// This is a crazy TS hack to prevent the types from being evaluated too soon
export function useSession<T = SessionValue>() {
  const ctx = SessionMemo();
  return ctx as T;
}
