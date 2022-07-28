import { createVerifier } from "fast-jwt";

export const KEY = "12345678";
export const verifier = createVerifier({ key: KEY });
