import { describe, expect, it } from "vitest";
import { normalizeSearchText } from "@/lib/text";

describe("text normalization", () => {
  it("ignores accents, case, and repeated spaces", () => {
    expect(normalizeSearchText("  Cèsar   López ")).toBe("cesar lopez");
  });
});
