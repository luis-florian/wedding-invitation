import { describe, expect, it } from "vitest";
import { buildInvitationUrl, createGuestToken } from "@/lib/tokens";

describe("guest tokens", () => {
  it("creates URL-safe non-trivial tokens", () => {
    const token = createGuestToken();
    expect(token.length).toBeGreaterThanOrEqual(24);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("builds invitation URLs from the configured site", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    expect(buildInvitationUrl("abc")).toBe("https://example.com/i/abc");
  });
});
