import { describe, expect, it } from "vitest";
import {
  parseGuestView,
  parseInvitationSentFilter,
  parseStatusFilter
} from "@/lib/admin-filters";

describe("admin filters", () => {
  it("parses guest views", () => {
    expect(parseGuestView("groom")).toBe("groom");
    expect(parseGuestView("bride")).toBe("bride");
    expect(parseGuestView("all")).toBe("all");
    expect(parseGuestView("other")).toBe("all");
  });

  it("parses status filters", () => {
    expect(parseStatusFilter("pending")).toBe("pending");
    expect(parseStatusFilter("confirmed")).toBe("confirmed");
    expect(parseStatusFilter("declined")).toBe("declined");
    expect(parseStatusFilter("other")).toBeUndefined();
  });

  it("parses invitation sent filters", () => {
    expect(parseInvitationSentFilter("true")).toBe(true);
    expect(parseInvitationSentFilter("false")).toBe(false);
    expect(parseInvitationSentFilter("other")).toBeUndefined();
  });
});
