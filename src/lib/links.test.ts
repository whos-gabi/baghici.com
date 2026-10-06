import { describe, expect, it } from "vitest";
import { mailtoHref, whatsappHref } from "./links";

describe("whatsappHref", () => {
  it("builds a wa.me link with the message URL-encoded", () => {
    expect(
      whatsappHref({
        whatsappNumber: "40730792946",
        whatsappText: "Hi! I'd like to book a virtual coffee chat.",
      }),
    ).toBe("https://wa.me/40730792946?text=Hi!%20I'd%20like%20to%20book%20a%20virtual%20coffee%20chat.");
  });

  it("keeps only digits in the number, as wa.me requires", () => {
    expect(whatsappHref({ whatsappNumber: "+40 730 792 946", whatsappText: "Hi" })).toBe(
      "https://wa.me/40730792946?text=Hi",
    );
  });
});

describe("mailtoHref", () => {
  it("returns a plain mailto link without a subject", () => {
    expect(mailtoHref("office@baghici.com")).toBe("mailto:office@baghici.com");
  });

  it("URL-encodes the subject", () => {
    expect(mailtoHref("office@baghici.com", "Coffee chat")).toBe(
      "mailto:office@baghici.com?subject=Coffee%20chat",
    );
  });
});
