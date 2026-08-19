import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "vercel-static");
const entries = await readdir(root, { withFileTypes: true });
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const excluded = new Set([".git", ".vercel", ".openai", ".next", "dist", "build", "node_modules", "app", "db", "drizzle", "examples", "public", "scripts", "supabase", "tests", "worker", "api", "vercel-static", ".env.local", ".gitignore", "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "next.config.ts", "postcss.config.mjs", "eslint.config.mjs"]);
for (const entry of entries) {
  if (excluded.has(entry.name)) continue;
  await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
}
console.log(`Static site prepared: ${out}`);
