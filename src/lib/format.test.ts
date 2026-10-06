import { describe, expect, it } from "vitest";
import { pad2 } from "./format";

describe("pad2", () => {
  it("zero-pads single digits", () => {
    expect(pad2(1)).toBe("01");
  });

  it("leaves two-digit numbers alone", () => {
    expect(pad2(12)).toBe("12");
  });
});
