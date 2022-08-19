import { Stacks } from "../stacks/index.js";
import { useConfig } from "../config/index.js";

export async function Build() {
  const fn = await Stacks.build();
  const cfg = await useConfig();
  const { App } = await import("@serverless-stack/resources");
  const app = new App(cfg);
  try {
    await fn(app);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
