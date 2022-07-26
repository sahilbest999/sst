import { Context } from "../context/context.js";
import { useHeader } from "../context/http.js";
import { createSigner, createVerifier, SignerOptions } from "fast-jwt";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export interface Session {}

export type SessionValue = {
  [type in keyof Session]: {
    type: type;
    properties: Session[type];
  };
}[keyof Session];

const KEY = "12345678";
const verifier = createVerifier({ key: KEY });

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

function create<T extends keyof Session>(input: {
  type: T;
  properties: Session[T];
  options?: Partial<SignerOptions>;
}) {
  const signer = createSigner(Object.assign(input.options || {}, { key: KEY }));
  const token = signer({
    type: input.type,
    properties: input.properties
  });
  return token as string;
}

export function cookie<T extends keyof Session>(input: {
  type: T;
  properties: Session[T];
  redirect: string;
  options?: Partial<SignerOptions>;
}): APIGatewayProxyStructuredResultV2 {
  const token = create(input);
  return {
    cookies: []
  };
}

export const Session = {
  create
};
