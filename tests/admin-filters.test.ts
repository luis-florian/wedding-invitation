import { describe, expect, it } from "vitest";
import { parseGuestView, parseStatusFilter } from "@/lib/admin-filters";

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
});
