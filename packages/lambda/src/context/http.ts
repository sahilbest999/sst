import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { Context } from "./context";
import { useEvent } from "./handler";

export const useCookies = /* @__PURE__ */ Context.memo(() => {
  const evt = useEvent("api");
  const cookies = evt.cookies || [];
  return Object.fromEntries(cookies.map(c => c.split("=")));
});

export function useCookie(name: string) {
  const cookies = useCookies();
  return cookies[name];
}

export const useBody = /* @__PURE__ */ Context.memo(() => {
  const evt = useEvent("api");
  if (!evt.body) return;
  const body = evt.isBase64Encoded
    ? Buffer.from(evt.body, "base64").toString()
    : evt.body;
  return body;
});

export const useJsonBody = /* @__PURE__ */ Context.memo(() => {
  const body = useBody();
  if (!body) return;
  return JSON.parse(body);
});

export const useFormData = /* @__PURE__ */ Context.memo(() => {
  const body = useBody();
  if (!body) return;
  const params = new URLSearchParams(body);
  return params;
});

export function useHttpMethod() {
  const evt = useEvent("api");
  return evt.requestContext.http.method;
}

export function useHttpHeaders() {
  const evt = useEvent("api");
  return evt.headers || {};
}

export function useFormValue(name: string) {
  const params = useFormData();
  return params?.get(name);
}

export function useQueryParams() {
  const evt = useEvent("api");
  const query = evt.queryStringParameters || {};
  return query;
}

export function useQueryParam(name: string) {
  return useQueryParams()[name];
}
