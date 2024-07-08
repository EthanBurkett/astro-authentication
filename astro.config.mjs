import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [tailwind(), react()],
});
