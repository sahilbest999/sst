import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solid({
      solid: {
        moduleName: "solid-ink",
        generate: "universal" as any
      }
    })
  ]
});
