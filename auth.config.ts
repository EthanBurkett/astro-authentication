import Creds from "@auth/core/providers/credentials";
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    Creds({
      authorize(credentials, request) {
        return null;
      },
    }),
  ],
});
