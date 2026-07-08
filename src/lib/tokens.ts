import { randomBytes } from "node:crypto";

export function createGuestToken() {
  return randomBytes(18).toString("base64url");
}

export function buildInvitationUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/i/${token}`;
}
