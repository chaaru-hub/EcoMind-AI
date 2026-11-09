// Turns Vite's dist-artifact/index.html into the page body a Claude
// artifact expects (no <html>/<head>/<body>; the viewer adds those).
import { readFileSync, writeFileSync } from "node:fs";

const built = readFileSync("dist-artifact/index.html", "utf8");
const tags = [
  ...built.matchAll(/<link rel="stylesheet"[^>]*>|<script type="module"[^>]*><\/script>/g),
].map((m) => m[0]);

writeFileSync(
  "dist-artifact/artifact.html",
  `<title>EcoMind AI</title>
<style>
  :root { color-scheme: dark; }
  html, body { background: #0a0a0b; }
  #root { min-height: 100vh; }
</style>
${tags.filter((t) => t.startsWith("<link")).join("\n")}
<div id="root"></div>
${tags.filter((t) => t.startsWith("<script")).join("\n")}
`
);
console.log("Wrote dist-artifact/artifact.html with", tags.length, "asset tags");
