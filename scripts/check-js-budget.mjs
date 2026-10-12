import { readdir, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

const assetsDir = "dist/assets";
const budgetKB = 55;

const files = await readdir(assetsDir);

const dashboardFile = files.find((file) => file.startsWith("DashboardView-"));

if (!dashboardFile) {
  console.error("Dashboardens JavaScript-fil hittades inte.");
  process.exit(1);
}

const filePath = path.join(assetsDir, dashboardFile);
const content = await readFile(filePath);
const sizeKB = gzipSync(content).length / 1024;

console.log(`Dashboard JS: ${sizeKB.toFixed(2)} KB gzip`);
console.log(`Budget: ${budgetKB} KB gzip`);

if (sizeKB > budgetKB) {
  console.error("JavaScript-budgeten överskrids!");
  process.exit(1);
}

console.log("JavaScript-budgeten klaras.");
