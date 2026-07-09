import { randomBytes } from "node:crypto";

export function createGuestToken() {
  return randomBytes(18).toString("base64url");
}

export function buildInvitationUrl(token: string) {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

  return `${baseUrl.replace(/\/$/, "")}/i/${token}`;
}
