import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { render, text } from "@/test/render";
import { About } from "./About";
import { Philosophy } from "./Philosophy";

describe("About", () => {
  const about = render(<About />);

  it("is the #about section with its HUD label and heading", () => {
    expect(about.querySelector("section#about")).not.toBeNull();
    expect(text(about.querySelector(".hud__idx"))).toBe("[01]");
    expect(text(about.querySelector(".hud__name"))).toBe("About");
    expect(text(about.querySelector(".hud__eyebrow"))).toBe(site.about.eyebrow);
    expect(text(about.querySelector("h2"))).toBe(site.about.heading);
    expect(text(about.querySelector(".sec-intro"))).toBe(site.about.intro);
  });

  it("renders one card per person with photo, role, tag and bio", () => {
    const cards = [...about.querySelectorAll("article")];
    expect(cards).toHaveLength(2);
    site.about.people.forEach((person, i) => {
      const card = cards[i];
      expect(text(card.querySelector("h3"))).toBe(person.name);
      expect(card.querySelector("img")?.getAttribute("src")).toBe(person.photo.src);
      expect(card.querySelector("img")?.getAttribute("alt")).toBe(person.photo.alt);
      expect(text(card)).toContain(person.role);
      expect(text(card)).toContain(person.tag);
      expect(text(card)).toContain(person.bio);
    });
  });

  it("closes with the together card", () => {
    const together = about.querySelector('aside[aria-label="Together"]');
    expect(text(together)).toContain("Co-op mode");
    expect(text(together)).toContain(site.about.together);
  });
});

describe("Philosophy", () => {
  const philosophy = render(<Philosophy />);

  it("is the #philosophy section with the split heading", () => {
    expect(philosophy.querySelector("section#philosophy")).not.toBeNull();
    expect(text(philosophy.querySelector(".hud__idx"))).toBe("[02]");
    expect(text(philosophy.querySelector("h2"))).toBe("Purpose meets profit.");
  });

  it("renders the body with the two emphasised sentences", () => {
    const body = philosophy.querySelector("h2")?.closest("div")?.nextElementSibling;
    expect(text(body)).toBe(site.philosophy.body.map((s) => s.text).join("").trim());
    expect([...(body?.querySelectorAll("strong") ?? [])].map((s) => text(s))).toEqual([
      "That's not a contradiction. It's the point.",
      "Your business needs both. We bring both.",
    ]);
  });

  it("renders the three pillars with numbered labels and rising meters", () => {
    const pillars = [...philosophy.querySelectorAll("ul > li")];
    expect(pillars.map((li) => text(li.querySelector("h3")))).toEqual(["Purpose", "Lab", "Profit"]);
    expect(pillars.map((li) => text(li.querySelector("div > span")))).toEqual([
      "Pillar 01",
      "Pillar 02",
      "Pillar 03",
    ]);
    expect(pillars.map((li) => li.querySelectorAll("i.on").length)).toEqual([1, 2, 3]);
  });
});
