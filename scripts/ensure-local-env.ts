import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, appendFileSync } from "node:fs";

const envPath = ".env";

if (!existsSync(envPath)) {
  throw new Error(".env does not exist");
}

const current = readFileSync(envPath, "utf8");
const additions: string[] = [];

function ensure(name: string, value: string) {
  if (!new RegExp(`^${name}=`, "m").test(current)) {
    additions.push(`${name}="${value}"`);
  }
}

ensure("SESSION_SECRET", randomBytes(32).toString("base64url"));
ensure("SETUP_SECRET", randomBytes(24).toString("base64url"));
ensure("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
ensure("SEED_GROOM_EMAIL", "novio@example.com");
ensure("SEED_GROOM_PASSWORD", "change-me-groom");
ensure("SEED_BRIDE_EMAIL", "novia@example.com");
ensure("SEED_BRIDE_PASSWORD", "change-me-bride");

if (additions.length > 0) {
  appendFileSync(envPath, `\n# Local app defaults\n${additions.join("\n")}\n`);
  console.log(`Added ${additions.length} missing local app env vars.`);
} else {
  console.log("Local app env vars already present.");
}
