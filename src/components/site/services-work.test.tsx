import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { render, text } from "@/test/render";
import { Services } from "./Services";
import { Work } from "./Work";

describe("Services", () => {
  const services = render(<Services />);

  it("is the #services section with its HUD label and heading", () => {
    expect(services.querySelector("section#services")).not.toBeNull();
    expect(text(services.querySelector(".hud__idx"))).toBe("[03]");
    expect(text(services.querySelector("h2"))).toBe(site.services.heading);
  });

  it("lists the five services as numbered rows with benefit and details", () => {
    const rows = [...services.querySelectorAll("ol > li")];
    expect(rows).toHaveLength(5);
    site.services.items.forEach((item, i) => {
      const row = rows[i];
      expect(text(row.querySelector("span"))).toBe(`S/0${i + 1}`);
      expect(text(row.querySelector("h3"))).toBe(item.title);
      expect(text(row)).toContain(item.benefit);
      expect([...row.querySelectorAll("ul > li")].map((li) => text(li))).toEqual(item.details);
    });
  });
});

describe("Work", () => {
  const work = render(<Work />);

  it("is the #work section with its HUD label and heading", () => {
    expect(work.querySelector("section#work")).not.toBeNull();
    expect(text(work.querySelector(".hud__idx"))).toBe("[04]");
    expect(text(work.querySelector("h2"))).toBe(site.work.heading);
  });

  it("features MNIR with its logo and both projects", () => {
    const feature = work.querySelector('article[aria-labelledby="mnir-title"]');
    expect(feature?.querySelector("img")?.getAttribute("src")).toBe("/img/mnir.png");
    expect(feature?.querySelector("img")?.getAttribute("alt")).toBe(site.work.mnir.logo.alt);
    expect(text(feature?.querySelector("#mnir-title"))).toBe(site.work.mnir.title);
    expect(text(feature)).toContain(site.work.mnir.subtitle);
    expect([...(feature?.querySelectorAll("h4") ?? [])].map((h) => text(h))).toEqual([
      "Interactive history games",
      "Smart warehouse system",
    ]);
  });

  it("shows the four projects in order with category and subtitle", () => {
    const tiles = [...work.querySelectorAll("ul > li")];
    expect(tiles.map((li) => text(li.querySelector("h3")))).toEqual([
      "Magnetron.io",
      "to you.",
      "Tank Arena",
      "Two Hands",
    ]);
    site.work.projects.forEach((project, i) => {
      expect(text(tiles[i])).toContain(project.category);
      expect(text(tiles[i])).toContain(project.subtitle);
      expect(text(tiles[i])).toContain(`W/0${i + 2}`);
    });
  });

  it("uses logos for Magnetron.io and to you., monograms for the others", () => {
    const tiles = [...work.querySelectorAll("ul > li")];
    expect(tiles[0].querySelector("img")?.getAttribute("src")).toBe("/img/magnetron.png");
    expect(tiles[1].querySelector("img")?.getAttribute("src")).toBe("/img/toyou.png");
    expect(tiles[2].querySelector('[role="img"]')?.getAttribute("aria-label")).toBe("Tank Arena monogram");
    expect(tiles[3].querySelector('[role="img"]')?.getAttribute("aria-label")).toBe("Two Hands monogram");
  });

  it("links only Tank Arena and Two Hands, in a new tab", () => {
    const tiles = [...work.querySelectorAll("ul > li")];
    expect(tiles[0].querySelector("a")).toBeNull();
    expect(tiles[1].querySelector("a")).toBeNull();
    for (const [i, href] of [
      [2, "https://tank-arena-gilt.vercel.app"],
      [3, "https://masajtwohands.com"],
    ] as const) {
      const a = tiles[i].querySelector("a");
      expect(a?.getAttribute("href")).toBe(href);
      expect(a?.getAttribute("target")).toBe("_blank");
      expect(a?.getAttribute("rel")).toBe("noopener noreferrer");
      expect(text(a)).toContain("(opens in a new tab)");
    }
  });
});
