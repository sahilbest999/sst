import { Context } from "../context/context.js";
import { useHeader } from "../context/http.js";

export interface Session {}

type SessionValue = {
  [type in keyof Session]: {
    type: type;
    properties: Session[type];
  };
}[keyof Session];

export const useSession = /* @__PURE__ */ Context.memo(() => {
  const header = useHeader("authorization");
  if (!header) return;
  if (!header.startsWith("Bearer ")) return;
  const token = header.substring(7);
});
