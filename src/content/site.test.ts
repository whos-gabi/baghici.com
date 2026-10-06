import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navItem, site } from "./site";

const copy = JSON.parse(
  readFileSync(join(process.cwd(), "docs/superpowers/specs/2026-10-06-bct-redesign/copy.json"), "utf8"),
);
const joinWords = (...parts: string[]) => parts.join(" ");
const wordCount = (s: string) => s.trim().split(/\s+/).length;

describe("site content matches the approved copy verbatim", () => {
  it("brand and meta", () => {
    expect(site.brand.name).toBe(copy.brand);
    expect(site.meta.title).toBe(copy.meta_title);
    expect(site.meta.description).toBe(copy.meta_description);
  });

  it("nav", () => {
    expect(site.nav).toEqual(copy.nav);
  });

  it("hero", () => {
    expect(site.hero.eyebrow).toBe(copy.hero.eyebrow);
    expect(joinWords(site.hero.h1.lead, site.hero.h1.accent, site.hero.h1.underline)).toBe(copy.hero.h1);
    expect(site.hero.sub).toBe(copy.hero.sub);
    expect(site.hero.ctaPrimary).toBe(copy.hero.cta_primary);
    expect(site.hero.ctaSecondary).toBe(copy.hero.cta_secondary);
  });

  it("about", () => {
    expect(site.about.eyebrow).toBe(copy.about.eyebrow);
    expect(site.about.heading).toBe(copy.about.heading);
    expect(site.about.intro).toBe(copy.about.intro);
    expect(site.about.together).toBe(copy.about.together);
    expect(site.about.people.map(({ name, role, bio, tag }) => ({ name, role, bio, tag }))).toEqual(
      copy.about.people,
    );
  });

  it("philosophy", () => {
    expect(site.philosophy.eyebrow).toBe(copy.philosophy.eyebrow);
    expect(joinWords(site.philosophy.heading.lead, site.philosophy.heading.accent)).toBe(copy.philosophy.heading);
    expect(site.philosophy.body.map((s) => s.text).join("")).toBe(copy.philosophy.body);
    expect(site.philosophy.pillars).toEqual(copy.philosophy.pillars);
  });

  it("services", () => {
    expect(site.services.eyebrow).toBe(copy.services.eyebrow);
    expect(site.services.heading).toBe(copy.services.heading);
    expect(site.services.intro).toBe(copy.services.intro);
    expect(site.services.items).toEqual(copy.services.items);
  });

  it("work", () => {
    expect(site.work.eyebrow).toBe(copy.work.eyebrow);
    expect(site.work.heading).toBe(copy.work.heading);
    expect(site.work.intro).toBe(copy.work.intro);
    expect(site.work.mnir.title).toBe(copy.work.mnir.title);
    expect(site.work.mnir.subtitle).toBe(copy.work.mnir.subtitle);
    expect(site.work.mnir.items.map(({ title, line }) => ({ title, line }))).toEqual(copy.work.mnir.items);
    expect(site.work.projects.map(({ name, subtitle, category }) => ({ name, subtitle, category }))).toEqual(
      copy.work.projects,
    );
  });

  it("lab", () => {
    expect(site.lab.eyebrow).toBe(copy.lab.eyebrow);
    expect(site.lab.heading).toBe(copy.lab.heading);
    expect(site.lab.intro).toBe(copy.lab.intro);
    expect(site.lab.items).toEqual(copy.lab.items);
  });

  it("contact section", () => {
    expect(site.contactSection.eyebrow).toBe(copy.final_cta.eyebrow);
    expect(joinWords(site.contactSection.heading.lead, site.contactSection.heading.accent)).toBe(
      copy.final_cta.heading,
    );
    expect(site.contactSection.body).toBe(copy.final_cta.body);
    expect(site.contactSection.cta).toBe(copy.final_cta.cta);
    expect(joinWords(site.contactSection.emailLead, site.contact.email)).toBe(copy.final_cta.email_line);
  });

  it("footer", () => {
    expect(site.footer.tagline).toBe(copy.footer.tagline);
    expect(site.footer.copyright).toBe(copy.footer.copyright);
  });
});

describe("content rules from the spec", () => {
  it("nav anchors are exactly the six section ids, in order", () => {
    expect(site.nav.map((n) => n.anchor)).toEqual(["about", "philosophy", "services", "work", "lab", "contact"]);
  });

  it("navItem returns a 1-based index and the label", () => {
    expect(navItem("about")).toEqual({ index: 1, label: "About" });
    expect(navItem("contact")).toEqual({ index: 6, label: "Contact" });
  });

  it("contact details are the agreed ones", () => {
    expect(site.contact).toEqual({
      whatsappNumber: "40730792946",
      whatsappText: "Hi! I'd like to book a virtual coffee chat.",
      email: "office@baghici.com",
    });
  });

  it("every project has exactly one of logo or monogram, and a subtitle of at most 6 words", () => {
    for (const p of site.work.projects) {
      expect(Boolean(p.logo) !== Boolean(p.monogram), p.name).toBe(true);
      expect(wordCount(p.subtitle), p.name).toBeLessThanOrEqual(6);
    }
  });

  it("only Tank Arena and Two Hands link out", () => {
    expect(site.work.projects.filter((p) => p.href).map((p) => [p.name, p.href])).toEqual([
      ["Tank Arena", "https://tank-arena-gilt.vercel.app"],
      ["Two Hands", "https://masajtwohands.com"],
    ]);
  });

  it("uses none of the banned words", () => {
    const all = JSON.stringify(site).toLowerCase();
    for (const banned of [
      "pilot",
      "deployed",
      "rolled out",
      "used by schools",
      "in classrooms",
      "unlaunched",
      "synergy",
      "cutting-edge",
      "best-in-class",
    ]) {
      expect(all, banned).not.toContain(banned);
    }
  });

  it("every referenced image exists in public/", () => {
    const srcs = [
      ...site.about.people.map((p) => p.photo.src),
      site.work.mnir.logo.src,
      ...site.work.projects.flatMap((p) => (p.logo ? [p.logo.src] : [])),
    ];
    for (const src of srcs) {
      expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
    }
  });
});
