// After `vite build`: copy dist/index.html to dist/<route>/index.html for each
// page route in src/App.jsx, so opening or refreshing /devices, /analytics,
// etc. serves the app as a plain static file on any host (Vercel included).
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";

const app = readFileSync("src/App.jsx", "utf8");
const routes = [...app.matchAll(/<Route\s+path="([^"/][^"]*)"/g)].map((m) => m[1]);

if (routes.length === 0) {
  throw new Error("spa-routes: no <Route path=\"...\"> found in src/App.jsx");
}

for (const route of routes) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync("dist/index.html", `dist/${route}/index.html`);
}
console.log(`spa-routes: wrote index.html for /${routes.join(", /")}`);
