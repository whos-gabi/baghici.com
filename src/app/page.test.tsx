import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { render } from "@/test/render";

describe("home page", () => {
  const page = render(<Home />);

  it("renders the sections in the agreed order", () => {
    expect([...page.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
      "top",
      "about",
      "philosophy",
      "services",
      "work",
      "lab",
      "contact",
    ]);
  });

  it("has exactly one h1", () => {
    expect(page.querySelectorAll("h1")).toHaveLength(1);
  });

  it("every in-page link points at an element that exists", () => {
    const ids = new Set([...page.querySelectorAll("[id]")].map((el) => el.id));
    for (const a of page.querySelectorAll('a[href^="#"]')) {
      const href = a.getAttribute("href") ?? "";
      expect(ids.has(href.slice(1)), href).toBe(true);
    }
  });

  it("every WhatsApp link is the booking link and opens safely in a new tab", () => {
    const links = [...page.querySelectorAll('a[href^="https://wa.me/"]')];
    expect(links).toHaveLength(3); // nav, hero, contact
    for (const a of links) {
      expect(a.getAttribute("href")).toBe(whatsappHref(site.contact));
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("only the email fallback uses mailto", () => {
    expect([...page.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute("href"))).toEqual([
      "mailto:office@baghici.com",
    ]);
  });

  it("every image has alt text", () => {
    for (const img of page.querySelectorAll("img")) {
      expect(img.getAttribute("alt"), img.getAttribute("src") ?? "").toBeTruthy();
    }
  });

  it("contains none of the banned words", () => {
    const all = (page.textContent ?? "").toLowerCase();
    for (const banned of ["pilot", "deployed", "rolled out", "used by schools", "in classrooms", "unlaunched"]) {
      expect(all, banned).not.toContain(banned);
    }
  });
});
