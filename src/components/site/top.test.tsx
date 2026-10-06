import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { render, text } from "@/test/render";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import { Ticker } from "./Ticker";

describe("Nav", () => {
  const nav = render(<Nav />);

  it("links to the six sections with zero-padded numbers", () => {
    const links = [...nav.querySelectorAll('nav[aria-label="Primary"] a')];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#about",
      "#philosophy",
      "#services",
      "#work",
      "#lab",
      "#contact",
    ]);
    expect(links.map((a) => text(a))).toEqual([
      "01About",
      "02Philosophy",
      "03Services",
      "04Work",
      "05Lab",
      "06Contact",
    ]);
  });

  it("has a collapsed menu toggle wired to the panel", () => {
    const button = nav.querySelector("button");
    expect(button?.getAttribute("aria-expanded")).toBe("false");
    expect(button?.getAttribute("aria-controls")).toBe("nav-panel");
    expect(text(button)).toBe("Menu");
    expect(nav.querySelector("#nav-panel")).not.toBeNull();
  });

  it("CTA opens WhatsApp in a new tab", () => {
    const cta = nav.querySelector('a[href^="https://wa.me/"]');
    expect(cta?.getAttribute("href")).toBe(whatsappHref(site.contact));
    expect(cta?.getAttribute("target")).toBe("_blank");
    expect(text(cta)).toContain(site.hero.ctaPrimary);
  });
});

describe("Hero", () => {
  const hero = render(<Hero />);

  it("is the #top section with the approved h1", () => {
    expect(hero.querySelector("section#top")).not.toBeNull();
    expect(hero.querySelectorAll("h1")).toHaveLength(1);
    expect(text(hero.querySelector("h1"))).toBe("You bring the problem. We ship the system.");
    expect(text(hero.querySelector("p"))).toBe(`${site.ui.live} ${site.hero.eyebrow}`);
  });

  it("primary CTA opens WhatsApp, secondary jumps to #work", () => {
    const [primary, secondary] = [...hero.querySelectorAll("a.btn")];
    expect(primary.getAttribute("href")).toBe(whatsappHref(site.contact));
    expect(text(primary)).toContain(site.hero.ctaPrimary);
    expect(secondary.getAttribute("href")).toBe("#work");
    expect(text(secondary)).toBe(site.hero.ctaSecondary);
  });

  it("shows both party members with their photos", () => {
    const party = hero.querySelector('aside[aria-label="The team"]');
    expect([...(party?.querySelectorAll("img") ?? [])].map((img) => img.getAttribute("src"))).toEqual([
      "/img/teodora.jpg",
      "/img/gabi.jpg",
    ]);
    expect(text(party)).toContain("Teodora");
    expect(text(party)).toContain("Systems Thinker & Builder");
  });

  it("includes the services ticker", () => {
    expect(hero.querySelector('[role="group"][aria-label="What we build"]')).not.toBeNull();
  });
});

describe("Ticker", () => {
  const ticker = render(<Ticker />);

  it("lists the five services twice, the duplicate hidden from assistive tech", () => {
    const lists = ticker.querySelectorAll("ul");
    expect(lists).toHaveLength(2);
    expect([...lists[0].querySelectorAll("li")].map((li) => text(li))).toEqual(
      site.services.items.map((s) => s.title),
    );
    expect(lists[1].getAttribute("aria-hidden")).toBe("true");
  });

  it("has an unpressed pause toggle with an accessible name", () => {
    const button = ticker.querySelector("button");
    expect(button?.getAttribute("aria-pressed")).toBe("false");
    expect(text(button)).toBe("Pause motion");
  });
});
