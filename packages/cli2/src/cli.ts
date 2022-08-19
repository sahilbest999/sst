import { Context } from "@serverless-stack/lambda/context/index.js";

interface GlobalCLIOptionsContext {
  profile?: string;
  stage?: string;
}
export const GlobalCLIOptionsContext =
  Context.create<GlobalCLIOptionsContext>();
