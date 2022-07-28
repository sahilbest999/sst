import { Context } from "../context/context.js";
import { useCookie, useHeader } from "../context/http.js";
import { createSigner, createVerifier, SignerOptions } from "fast-jwt";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { KEY, verifier } from "./jwt.js";

export interface SessionTypes {
  public: {};
}

export type SessionValue = {
  [type in keyof SessionTypes]: {
    type: type;
    properties: SessionTypes[type];
  };
}[keyof SessionTypes];

const SessionMemo = /* @__PURE__ */ Context.memo(() => {
  let token = "";

  const header = useHeader("authorization")!;
  if (header) token = header.substring(7);

  const cookie = useCookie("auth-token");
  if (cookie) token = cookie;

  if (token) {
    const jwt = verifier(token);
    return jwt;
  }

  return {
    type: "public",
    properties: {}
  };
});

// This is a crazy TS hack to prevent the types from being evaluated too soon
export function useSession<T = SessionValue>() {
  const ctx = SessionMemo();
  return ctx as T;
}

function create<T extends keyof SessionTypes>(input: {
  type: T;
  properties: SessionTypes[T];
  options?: Partial<SignerOptions>;
}) {
  const signer = createSigner(Object.assign(input.options || {}, { key: KEY }));
  const token = signer({
    type: input.type,
    properties: input.properties
  });
  return token as string;
}

export function cookie<T extends keyof SessionTypes>(input: {
  type: T;
  properties: SessionTypes[T];
  redirect: string;
  options?: Partial<SignerOptions>;
}): APIGatewayProxyStructuredResultV2 {
  const token = create(input);
  return {
    statusCode: 302,
    headers: {
      location: input.redirect
    },
    cookies: [
      `auth-token=${token}; HttpOnly; Path=/; Expires=${new Date(
        Date.now() + (input.options?.expiresIn || 1000 * 60 * 60 * 24 * 7)
      )}`
    ]
  };
}

export function parameter<T extends keyof SessionTypes>(input: {
  type: T;
  redirect: string;
  properties: SessionTypes[T];
  options?: Partial<SignerOptions>;
}): APIGatewayProxyStructuredResultV2 {
  const token = create(input);
  return {
    statusCode: 302,
    headers: {
      location: input.redirect + "?token=" + token
    }
  };
}

export const Session = {
  create,
  cookie,
  parameter
};
