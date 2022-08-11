import { Context } from "@serverless-stack/lambda/context/context.js";
import path from "path";
import fs from "fs/promises";
import { ProjectRoot } from "../config/index.js";

export const StateRoot = Context.create(() =>
  path.join(ProjectRoot.use(), ".sst")
);

export const useState = Context.memo(async () => {
  const root = StateRoot.use();
  await fs.mkdir(root, {
    recursive: true,
  });

  return root;
});

export const StageContext = Context.create(async () => {
  const state = await useState();
  try {
    const result = await fs.readFile(path.join(state, "stage"));
    return result.toString("utf8");
  } catch {
    return;
  }
});

export async function requireStage() {
  const stage = await StageContext.use();
  if (stage) return stage;

  return "thdxr";
}
