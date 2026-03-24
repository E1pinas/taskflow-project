import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const assets = [
  "index.html",
  "modal.html",
  "confirm-modal.html",
  "modal.js",
  "confirm-modal.js",
  "src",
];

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });

for (const asset of assets) {
  const source = path.join(projectRoot, asset);
  const destination = path.join(publicDir, asset);

  if (!existsSync(source)) {
    continue;
  }

  cpSync(source, destination, { recursive: true });
}
