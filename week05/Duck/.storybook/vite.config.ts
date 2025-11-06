import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": require("path").resolve(__dirname, "../src"),
        },
      },
    });
  },
};

export default config;
