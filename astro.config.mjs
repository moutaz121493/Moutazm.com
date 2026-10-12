import { defineConfig } from "astro/config";

// PREVIEW_BASE lets the same build be previewed under a sub-path on the Pi.
export default defineConfig({
  site: "https://moutazm.com",
  base: process.env.PREVIEW_BASE || "/",
  trailingSlash: "always",
  build: { format: "directory" },
});
