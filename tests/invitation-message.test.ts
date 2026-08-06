import { describe, expect, it } from "vitest";
import { buildInvitationShareText, defaultInviteMessage } from "@/lib/invitation-message";

describe("invitation share message", () => {
  it("appends the invitation URL to custom messages", () => {
    const text = buildInvitationShareText("Hola familia", "https://example.com/i/abc");

    expect(text).toContain("Hola familia");
    expect(text).toContain("Tu invitación:");
    expect(text).toContain("https://example.com/i/abc");
  });

  it("uses the default message when custom message is empty", () => {
    const text = buildInvitationShareText("", "https://example.com/i/abc");

    expect(text).toContain(defaultInviteMessage);
  });
});
