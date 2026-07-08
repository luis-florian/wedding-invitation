import { describe, expect, it } from "vitest";
import { canEditSide } from "@/lib/permissions";

describe("admin permissions", () => {
  it("allows editing own side only", () => {
    expect(canEditSide("groom", "groom")).toBe(true);
    expect(canEditSide("bride", "bride")).toBe(true);
    expect(canEditSide("groom", "bride")).toBe(false);
    expect(canEditSide("bride", "groom")).toBe(false);
  });
});
