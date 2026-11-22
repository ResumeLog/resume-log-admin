import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Recolors mono icons with `currentColor`, so they follow the text color. Same as resume-log-fe-v2. */
const useCurrentColor = {
  name: "useCurrentColor",
  fn: () => ({
    element: {
      enter(node: { name: string; attributes: Record<string, string> }) {
        const { attributes } = node;
        delete attributes["fill-opacity"];
        delete attributes["stroke-opacity"];
        if (node.name === "clipPath" || node.name === "rect") return;
        for (const key of ["fill", "stroke"]) {
          if (attributes[key] && attributes[key] !== "none") attributes[key] = "currentColor";
        }
      },
    },
  }),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      include: "**/icons/mono/*.svg?react",
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: { plugins: [useCurrentColor] },
      },
    }),
    svgr({ include: "**/icons/color/*.svg?react" }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": path.join(dirname, "src") },
  },
});
