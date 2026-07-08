import { describe, expect, it } from "vitest";
import { rsvpStatusSchema } from "@/lib/validation";

describe("rsvp status validation", () => {
  it("accepts the documented statuses", () => {
    expect(rsvpStatusSchema.parse("pending")).toBe("pending");
    expect(rsvpStatusSchema.parse("confirmed")).toBe("confirmed");
    expect(rsvpStatusSchema.parse("declined")).toBe("declined");
  });

  it("rejects unknown statuses", () => {
    expect(() => rsvpStatusSchema.parse("maybe")).toThrow();
  });
});
