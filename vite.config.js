import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteReact(),
    tailwindcss(),
    // Add Sentry plugin only if auth token is available
    ...(process.env.SENTRY_AUTH_TOKEN ? [
      sentryVitePlugin({
        org: "org-name",
        project: "project-name",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      })
    ] : []),
  ],
})

