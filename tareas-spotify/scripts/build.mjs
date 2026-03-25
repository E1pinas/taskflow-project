import { execSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(projectRoot, "public");
const distRoot = path.join(projectRoot, "dist");

rmSync(distRoot, { recursive: true, force: true });
cpSync(publicRoot, distRoot, { recursive: true });

execSync("npm run build:css:dist", {
  cwd: projectRoot,
  stdio: "inherit",
});
