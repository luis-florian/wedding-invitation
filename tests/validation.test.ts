import { describe, expect, it } from "vitest";
import { adminNoteFormSchema, rsvpStatusSchema } from "@/lib/validation";

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

describe("admin note validation", () => {
  it("accepts one note per admin side", () => {
    expect(adminNoteFormSchema.parse({ side: "groom", body: "Llevar sobres" })).toEqual({
      side: "groom",
      body: "Llevar sobres"
    });
  });

  it("rejects notes for unknown sides", () => {
    expect(() => adminNoteFormSchema.parse({ side: "planner", body: "" })).toThrow();
  });
});
