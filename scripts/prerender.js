// Prerenders the single page to real static HTML so search engines and AI
// crawlers (which mostly don't execute JavaScript) see actual content
// instead of an empty <div id="root"></div> shell.
//
// Runs after `vite build` and after the SSR bundle has been built to
// dist-ssr/entry-server.js. See package.json "build" script.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const SITE_URL = "https://www.secretmenubuilder.app";

async function main() {
  if (!fs.existsSync(ssrEntry)) {
    console.error(`SSR bundle not found at ${ssrEntry}. Run the SSR build step first.`);
    process.exit(1);
  }
  if (!fs.existsSync(distDir)) {
    console.error(`Client build not found at ${distDir}. Run "vite build" first.`);
    process.exit(1);
  }

  const { render } = await import(pathToFileUrl(ssrEntry));
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

  const appHtml = render();

  let html = template;

  // Add canonical link right after the description if not already present
  const canonicalTag = `<link rel="canonical" href="${SITE_URL}/" />`;
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      /<meta name="description" content=".*?" \/>/s,
      (match) => `${match}\n    ${canonicalTag}`
    );
  }

  // Inject the prerendered app markup into the root div
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  fs.writeFileSync(path.join(distDir, "index.html"), html);
  console.log("Prerendered / -> dist/index.html");

  // Clean up the intermediate SSR bundle; it's not needed in the deployed output.
  fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
}

function pathToFileUrl(p) {
  return "file://" + p.replace(/\\/g, "/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
