# Baghici Creative Technologies Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Builder's Hub" bento page at baghici.com with the Baghici Creative Technologies studio site, faithfully ported from the approved "Night Shift" mockup.

**Architecture:** One static Next.js App Router page composed of one server component per section, plus three small client components (nav menu, ticker pause, reveal-on-scroll). All copy lives in `src/content/site.ts`; shared design tokens and utilities live in `src/app/globals.css`; section styles live in CSS Modules ported 1:1 from the mockup.

**Tech Stack:** Next.js 14.2.10 (App Router), React 18.2, TypeScript 5, CSS Modules, `next/font/google`, `next/image`; tests with Vitest 5 + happy-dom + `react-dom/server`.

**Spec:** `docs/superpowers/specs/2026-10-06-bct-redesign-design.md` (visual source of truth: `docs/superpowers/specs/2026-10-06-bct-redesign/mockup-night-shift.html`; copy source of truth: `docs/superpowers/specs/2026-10-06-bct-redesign/copy.json`).

## Global Constraints

- Work on branch `redesign/creative-technologies`. Never push.
- Package manager is **Yarn 1 through corepack**: always `corepack yarn <cmd>`. Never `npm install` (it would create `package-lock.json`). `yarn.lock` must stay the only lockfile.
- Do not upgrade `next`, `react`, `react-dom`, `typescript` or `eslint`.
- No new runtime dependencies. New devDependencies only in Task 1.
- Copy is verbatim from `copy.json`. Banned words anywhere in content or UI: `pilot`, `deployed`, `rolled out`, `used by schools`, `in classrooms`, `unlaunched`, `synergy`, `cutting-edge`, `best-in-class`.
- Contact: WhatsApp number `40730792946`, prefilled text `Hi! I'd like to book a virtual coffee chat.`, email `office@baghici.com`. Every "Book a virtual coffee chat" CTA opens WhatsApp in a new tab with `rel="noopener noreferrer"`.
- Section order and ids: `top`, `about`, `philosophy`, `services`, `work`, `lab`, `contact`.
- Do NOT modify: `public/app-ads.txt`, `public/magnetron.io/privacy.html`, `next.config.mjs`, `src/app/icon.png`, `src/app/favicon.ico`.
- CSS values (sizes, clamps, colors, shadows, keyframes, breakpoints) are ported 1:1 from the mockup. Class names change to camelCase CSS Module names as written in this plan.
- Commit only your own paths, so parallel tasks never sweep up each other's work: `git add <paths> && git commit -m "<msg>" -- <paths>`. If git reports `index.lock`, wait 2 seconds and retry (max 5 tries). Every commit message ends with a blank line and `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

```
vitest.config.mts                 test runner config (Task 1)
vitest.setup.ts                   next/image mock for tests (Task 1)
src/test/render.ts                render(<X/>) -> HTMLElement, text() helper (Task 1)
src/lib/links.ts                  whatsappHref, mailtoHref (Task 1)
src/lib/format.ts                 pad2 (Task 1)
src/content/site.ts               all copy, people, projects, contact, UI labels, navItem() (Task 2)
public/img/*                      photos and logos (Task 2)
src/app/globals.css               tokens, base, shared utilities (Task 3)
src/app/layout.tsx                fonts, metadata, GA, .js class (Task 3)
src/components/site/ui/Button.tsx         link-button with arrow icon (Task 3)
src/components/site/ui/Hud.tsx            "[01] ABOUT" label (Task 3)
src/components/site/ui/Brand.tsx(+css)    logo mark + wordmark link (Task 3)
src/components/site/ui/Duo.tsx            duotone photo figure (Task 3)
src/components/site/ui/Reveal.tsx         client: reveal-on-scroll observer (Task 3)
src/components/site/Nav.tsx(+css)         client: sticky nav + mobile menu (Task 4)
src/components/site/Hero.tsx(+css)        hero + party card (Task 4)
src/components/site/Ticker.tsx(+css)      client: services marquee + pause (Task 4)
src/components/site/About.tsx(+css)       (Task 5)
src/components/site/Philosophy.tsx(+css)  (Task 5)
src/components/site/Services.tsx(+css)    (Task 6)
src/components/site/Work.tsx(+css)        (Task 6)
src/components/site/Lab.tsx(+css)         (Task 7)
src/components/site/Contact.tsx(+css)     (Task 7)
src/components/site/Footer.tsx(+css)      (Task 7)
src/app/page.tsx                  composes everything (Task 8)
```

Execution order: Task 1 → Task 2 → Task 3 → Tasks 4, 5, 6, 7 (independent, may run in parallel) → Task 8.

---

### Task 1: Test tooling and link helpers

**Files:**
- Modify: `package.json` (scripts, devDependencies), `yarn.lock`
- Create: `vitest.config.mts`, `vitest.setup.ts`, `src/test/render.ts`, `src/lib/links.ts`, `src/lib/links.test.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`

**Interfaces:**
- Produces: `render(element: ReactElement): HTMLElement`, `text(node: Element | null | undefined): string` from `@/test/render`; `whatsappHref({ whatsappNumber, whatsappText }): string`, `mailtoHref(email: string, subject?: string): string` from `@/lib/links`; `pad2(n: number): string` from `@/lib/format`.

- [ ] **Step 1: Install dependencies and the test toolchain**

```bash
corepack yarn install --frozen-lockfile
corepack yarn add -D vitest@^5.0.3 vite@^8.3.3 @vitejs/plugin-react@^6.1.2 happy-dom@^20.14.5 @types/node@^22
```

Then add the scripts to `package.json` (keep the existing ones):

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Create `vitest.config.mts`**

```ts
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    // CSS is not processed in tests; CSS Module imports return the class name itself (styles.hero === "hero").
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import { createElement } from "react";
import { vi } from "vitest";

type ImgProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
};

// next/image needs the Next runtime; in tests a plain <img> with the same src/alt is what we assert on.
vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, className, sizes }: ImgProps) =>
    createElement("img", { src, alt, width, height, className, sizes }),
}));
```

- [ ] **Step 4: Create `src/test/render.ts`**

```ts
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Server-renders an element and returns a detached container to query with the DOM API. */
export function render(element: ReactElement): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(element);
  return host;
}

/** Text content with whitespace collapsed, for readable assertions. */
export function text(node: Element | null | undefined): string {
  return (node?.textContent ?? "").replace(/\s+/g, " ").trim();
}
```

- [ ] **Step 5: Write the failing tests**

`src/lib/links.test.ts`:

```ts
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
```

`src/lib/format.test.ts`:

```ts
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
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `corepack yarn test src/lib`
Expected: FAIL, both files report that `./links` and `./format` cannot be resolved.

- [ ] **Step 7: Implement**

`src/lib/links.ts`:

```ts
export type WhatsappContact = { whatsappNumber: string; whatsappText: string };

export function whatsappHref({ whatsappNumber, whatsappText }: WhatsappContact): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappText)}`;
}

export function mailtoHref(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}
```

`src/lib/format.ts`:

```ts
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `corepack yarn test src/lib`
Expected: PASS, 6 tests.

- [ ] **Step 9: Commit**

```bash
git add package.json yarn.lock vitest.config.mts vitest.setup.ts src/test/render.ts src/lib/links.ts src/lib/links.test.ts src/lib/format.ts src/lib/format.test.ts
git commit -m "Add Vitest setup and link/format helpers" -- package.json yarn.lock vitest.config.mts vitest.setup.ts src/test/render.ts src/lib/links.ts src/lib/links.test.ts src/lib/format.ts src/lib/format.test.ts
```

Note: `package.json` already carries an uncommitted rename (`"name": "baghici-works"` to `"baghici-com"`) made by the owner. It is intentional and gets committed together with this task.

---

### Task 2: Content model and assets

**Files:**
- Create: `src/content/site.ts`, `src/content/site.test.ts`, `public/img/teodora.jpg`, `public/img/gabi.jpg`, `public/img/magnetron.png`, `public/img/toyou.png`, `public/img/mnir.png`

**Interfaces:**
- Consumes: nothing from earlier tasks at runtime (tests use Vitest from Task 1).
- Produces (from `@/content/site`):
  - types `Img = { src; alt; width; height }`, `NavAnchor`, `NavItem = { label; anchor }`, `Person`, `Project`, `Contact = { whatsappNumber; whatsappText; email }`, `Segment = { text; strong? }`
  - `site` object with keys `brand`, `meta`, `nav`, `contact`, `hero`, `about`, `philosophy`, `services`, `work`, `lab`, `contactSection`, `footer`, `ui` (exact shape below)
  - `navItem(anchor: NavAnchor): { index: number; label: string }` (1-based index)

- [ ] **Step 1: Copy the assets**

```bash
SRC=.superpowers/brainstorm/63687-1791297816/content
mkdir -p public/img
cp "$SRC/teodora.jpg" public/img/teodora.jpg
cp "$SRC/gabi.jpg" public/img/gabi.jpg
cp "$SRC/magnetron.png" public/img/magnetron.png
cp "$SRC/toyou.png" public/img/toyou.png
cp "$SRC/mnir-on-dark.png" public/img/mnir.png
sips -g pixelWidth -g pixelHeight public/img/*
```

Expected sizes: teodora 492x469, gabi 1173x1200, magnetron 512x512, toyou 512x512, mnir 474x106. If any differs, use the real numbers in `site.ts` below.

- [ ] **Step 2: Write the failing test `src/content/site.test.ts`**

```ts
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `corepack yarn test src/content`
Expected: FAIL, `./site` cannot be resolved.

- [ ] **Step 4: Create `src/content/site.ts`**

```ts
export type Img = { src: string; alt: string; width: number; height: number };

export type NavAnchor = "about" | "philosophy" | "services" | "work" | "lab" | "contact";
export type NavItem = { label: string; anchor: NavAnchor };

export type Person = {
  slot: string;
  hudLabel: string;
  name: string;
  role: string;
  tag: string;
  bio: string;
  photo: Img;
  /** Shorter alt text for the small hero "party" thumbnail. */
  partyAlt: string;
  /** Crop so both faces sit at the same height in the square duotone frame. */
  crop: { position: string; zoom: number };
};

export type Project = {
  name: string;
  category: string;
  subtitle: string;
  logo?: Img;
  monogram?: "tank-arena" | "two-hands";
  href?: string;
};

export type Contact = { whatsappNumber: string; whatsappText: string; email: string };

export type Segment = { text: string; strong?: boolean };

const nav: NavItem[] = [
  { label: "About", anchor: "about" },
  { label: "Philosophy", anchor: "philosophy" },
  { label: "Services", anchor: "services" },
  { label: "Work", anchor: "work" },
  { label: "Lab", anchor: "lab" },
  { label: "Contact", anchor: "contact" },
];

const people: Person[] = [
  {
    slot: "P1",
    hudLabel: "Biz Dev",
    name: "Teodora",
    role: "Business Development",
    tag: "Sells it. Means it.",
    bio: "Teodora loves building businesses. She's driven and set on leading an amazing team. She believes in sales done right: ethical, value-driven, never pushy. She blends the technical with the creative, so your idea makes sense to builders and buyers alike.",
    photo: {
      src: "/img/teodora.jpg",
      alt: "Portrait of Teodora, Business Development, in front of a basilica in Venice",
      width: 492,
      height: 469,
    },
    partyAlt: "Teodora smiling in front of a Venetian basilica",
    crop: { position: "50% 40%", zoom: 1 },
  },
  {
    slot: "P2",
    hudLabel: "Builder",
    name: "Gabi",
    role: "Systems Thinker & Builder",
    tag: "Has a system for that.",
    bio: "Gabi is the team's builder and a systems thinker to the core. Hand over a messy problem with no textbook answer and Gabi comes back with an unconventional fix that works. Problem-solver, through and through.",
    photo: {
      src: "/img/gabi.jpg",
      alt: "Portrait of Gabi, Systems Thinker and Builder, seated at a desk in a parliament-style chamber",
      width: 1173,
      height: 1200,
    },
    partyAlt: "Gabi seated at a desk in a chamber with green leather seats",
    crop: { position: "52% 40%", zoom: 1.24 },
  },
];

const projects: Project[] = [
  {
    name: "Magnetron.io",
    category: "Mobile game",
    subtitle: "Our own mobile arcade game",
    logo: {
      src: "/img/magnetron.png",
      alt: "Magnetron.io app icon: a metallic sphere with a purple glow",
      width: 512,
      height: 512,
    },
  },
  {
    name: "to you.",
    category: "App",
    subtitle: "Beauty services app, launching soon",
    logo: { src: "/img/toyou.png", alt: "to you. app icon: pink ty. lettering on black", width: 512, height: 512 },
  },
  {
    name: "Tank Arena",
    category: "Browser game",
    subtitle: "3D game, no install needed",
    monogram: "tank-arena",
    href: "https://tank-arena-gilt.vercel.app",
  },
  {
    name: "Two Hands",
    category: "Landing page",
    subtitle: "Client work for a massage studio",
    monogram: "two-hands",
    href: "https://masajtwohands.com",
  },
];

const contact: Contact = {
  whatsappNumber: "40730792946",
  whatsappText: "Hi! I'd like to book a virtual coffee chat.",
  email: "office@baghici.com",
};

const philosophyBody: Segment[] = [
  {
    text: "We've built history games for the National History Museum of Romania. We research how AI can improve education. And we ship mobile games while a trend is still hot. ",
  },
  { text: "That's not a contradiction. It's the point.", strong: true },
  {
    text: " Impact work taught us to create long-term value. The games market taught us speed, monetization and how cash flow really works. ",
  },
  { text: "Your business needs both. We bring both.", strong: true },
];

export const site = {
  brand: { name: "Baghici Creative Technologies", short: "Baghici", sub: "Creative Technologies" },
  meta: {
    title: "Baghici Creative Technologies | Tech Partners for Founders",
    description:
      "Two 22-year-old builders from Romania. We turn business problems into working tech for founders: CRMs, landing pages, automation, web and mobile apps.",
  },
  nav,
  contact,
  hero: {
    eyebrow: "Two 22-year-olds. Zero corporate fluff.",
    h1: { lead: "You bring the problem.", accent: "We ship the", underline: "system." },
    sub: "We solve business problems with tech, systems and creativity. CRMs, landing pages, automation and apps for founders who move fast, built by two digital natives who do too.",
    ctaPrimary: "Book a virtual coffee chat",
    ctaSecondary: "See our work",
  },
  about: {
    eyebrow: "The dynamic duo",
    heading: "Two people. Two superpowers.",
    intro:
      "We're 22 and grew up online. We learn new tools the week they drop, move fast and stay hungry. Our age isn't a footnote. It's our edge.",
    people,
    together:
      "Teodora sees the business. Gabi sees the system. You get both in the same conversation: a plan that sells, tech that holds up, nothing lost in translation.",
  },
  philosophy: {
    eyebrow: "Our philosophy",
    heading: { lead: "Purpose meets", accent: "profit." },
    body: philosophyBody,
    pillars: [
      { label: "Purpose", line: "Digital projects for education and culture, like our work with MNIR." },
      { label: "Lab", line: "Internal R&D testing how AI could help close the public-private education gap." },
      { label: "Profit", line: "Trend-driven mobile games, shipped fast. Our pragmatic growth engine." },
    ],
  },
  services: {
    eyebrow: "What we can build for you",
    heading: "Less busywork. More business.",
    intro:
      "You don't need a bloated proposal. You need the fix for your bottleneck. Here's what we build, and what it does for you.",
    items: [
      {
        title: "Custom CRMs",
        benefit: "Stop running sales out of spreadsheets and DMs. Get a CRM shaped around how you actually sell.",
        details: ["Built around your pipeline", "Your data, your rules", "No features you'll never use"],
      },
      {
        title: "High-converting landing pages",
        benefit: "Pages with one job: turning visitors into leads, sign-ups or sales. Fast, clear and mobile-first.",
        details: ["Clear message, clean design", "Fast on every device", "Built to test and iterate"],
      },
      {
        title: "Automation systems",
        benefit: "Hand the repetitive work to software. Get your hours back for the work only you can do.",
        details: ["Connects the tools you use", "Automates follow-ups and reports", "Runs while you sleep"],
      },
      {
        title: "Custom internal systems",
        benefit: "When off-the-shelf software doesn't fit, we build the tool your operations actually need.",
        details: ["Inventory, operations, dashboards", "Designed around your workflow", "Like our museum warehouse system"],
      },
      {
        title: "Web & mobile apps",
        benefit:
          "From first prototype to an app in your customers' hands. Built by a team that ships its own products.",
        details: ["Lean MVPs, fast iterations", "Web and mobile, one team", "Built to grow with you"],
      },
    ],
  },
  work: {
    eyebrow: "Selected work",
    heading: "Proof, not promises.",
    intro:
      "Impact work, our own products and client projects. Different worlds, same approach: understand the problem, build the system, ship it.",
    mnir: {
      title: "National History Museum of Romania (MNIR)",
      subtitle: "Featured collaboration: education and operations",
      logo: { src: "/img/mnir.png", alt: "MNIR, National History Museum of Romania logo", width: 474, height: 106 },
      items: [
        { title: "Interactive history games", line: "Interactive games that make history click for kids.", icon: "game" },
        {
          title: "Smart warehouse system",
          line: "A custom warehouse management system, built for the museum.",
          icon: "warehouse",
        },
      ] as { title: string; line: string; icon: "game" | "warehouse" }[],
    },
    projects,
  },
  lab: {
    eyebrow: "Innovation lab",
    heading: "Rethinking school, one prototype at a time.",
    intro:
      "Our internal R&D, where we design and test AI architectures for education. The goal: show that public schooling can get better and narrow the gap with private education. Think of it as our homework.",
    items: [
      {
        title: "Adaptive learning prototypes",
        line: "Lab prototypes exploring AI that meets each student at their level, not the class average.",
      },
      {
        title: "Closing the public-private gap",
        line: "Internal research into how AI could give public-school students the support private schools offer.",
      },
      {
        title: "Architectures for tomorrow's schools",
        line: "Architectures we're testing in-house for AI tools that could run on public-school budgets.",
      },
    ],
  },
  contactSection: {
    eyebrow: "Let's talk",
    heading: { lead: "Coffee's on us.", accent: "Virtually, anyway." },
    body: "Tell us what you're building and what's slowing you down. We'll listen, ask the right questions and tell you straight what we'd build. No slides, no pressure. Worst case, you leave with fresh ideas.",
    cta: "Book a virtual coffee chat",
    emailLead: "Prefer email? Write to",
  },
  footer: {
    tagline: "Tech, systems and creativity. Built in Romania by two 22-year-olds.",
    copyright: "© 2026 Baghici Creative Technologies",
  },
  ui: {
    skip: "Skip to content",
    brandAria: "Baghici Creative Technologies, back to top",
    primaryNav: "Primary",
    footerNav: "Footer",
    menu: "Menu",
    close: "Close",
    opensWhatsApp: "(opens WhatsApp in a new tab)",
    opensNewTab: "(opens in a new tab)",
    live: "Live",
    party: { ariaLabel: "The team", title: "Party", count: "2 / 2", footer: "Press start", region: "RO" },
    scroll: "Scroll",
    start: "[00] Start",
    ticker: { ariaLabel: "What we build", pause: "Pause motion" },
    together: { ariaLabel: "Together", label: "P1 + P2", separator: "//", mode: "Co-op mode" },
    pillarPrefix: "Pillar",
    servicePrefix: "S/",
    featured: "Featured",
    workPrefix: "W/",
    visit: "Visit ↗",
    monogramSuffix: "monogram",
    labPrefix: "Exp/",
    labStatus: "In the lab",
    channelOpen: "Channel open",
    backToTop: "Back to top ↑",
  },
};

export function navItem(anchor: NavAnchor): { index: number; label: string } {
  const i = nav.findIndex((item) => item.anchor === anchor);
  if (i === -1) throw new Error(`Unknown nav anchor: ${anchor}`);
  return { index: i + 1, label: nav[i].label };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `corepack yarn test src/content`
Expected: PASS, 17 tests. If a copy assertion fails, fix `site.ts` to match `copy.json` exactly, never the other way round.

- [ ] **Step 6: Commit**

```bash
git add src/content/site.ts src/content/site.test.ts public/img
git commit -m "Add site content model and image assets" -- src/content/site.ts src/content/site.test.ts public/img
```

---
### Task 3: Foundation (tokens, layout, fonts, UI primitives)

**Files:**
- Modify (full rewrite): `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/site/ui/Button.tsx`, `src/components/site/ui/Hud.tsx`, `src/components/site/ui/Brand.tsx`, `src/components/site/ui/Brand.module.css`, `src/components/site/ui/Duo.tsx`, `src/components/site/ui/Reveal.tsx`, `src/components/site/ui/ui.test.tsx`

**Interfaces:**
- Consumes: `site`, `Person` from `@/content/site`; `pad2` from `@/lib/format`; `render`, `text` from `@/test/render`.
- Produces:
  - Global CSS classes used by later tasks: `wrap`, `mono`, `btn`, `btn--primary`, `btn--ghost`, `hud`, `hud__idx`, `hud__name`, `hud__bar`, `hud__eyebrow`, `sec`, `sec-head`, `sec-title`, `sec-intro`, `brackets`, `duo`, `reveal-color`, `rec`, `cursor`, `scroll-line`, `vh`, `skip`, `is-in`, `motion-paused` (on `<html>`), `menu-open` (on `<body>`), attribute `data-reveal`.
  - `Button({ href, variant?: "primary" | "ghost", icon?: "up-right" | "down", external?: boolean, srHint?: string, className?: string, children })`
  - `Hud({ index: number, name: string, eyebrow: string })`
  - `Brand()` (link to `#top`)
  - `Duo({ person: Person, alt: string, sizes: string, className?: string })`
  - `RevealObserver()` (client, renders `null`)
  - CSS variables `--font-unbounded`, `--font-instrument-sans`, `--font-jetbrains-mono` set on `<html>`.

- [ ] **Step 1: Write the failing test `src/components/site/ui/ui.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { render, text } from "@/test/render";
import { Brand } from "./Brand";
import { Button } from "./Button";
import { Duo } from "./Duo";
import { Hud } from "./Hud";
import { RevealObserver } from "./Reveal";

describe("Button", () => {
  it("renders a primary link-button with a decorative arrow", () => {
    const a = render(<Button href="#work">Go</Button>).querySelector("a");
    expect(a?.getAttribute("href")).toBe("#work");
    expect(a?.className).toBe("btn btn--primary");
    expect(a?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(a?.hasAttribute("target")).toBe(false);
  });

  it("opens external links in a new tab and adds a screen-reader hint", () => {
    const a = render(
      <Button href="https://wa.me/1" external srHint="(opens WhatsApp in a new tab)" variant="ghost" className="x">
        Chat
      </Button>,
    ).querySelector("a");
    expect(a?.getAttribute("target")).toBe("_blank");
    expect(a?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(a?.className).toBe("btn btn--ghost x");
    expect(text(a)).toBe("Chat (opens WhatsApp in a new tab)");
    expect(a?.querySelector(".vh")).not.toBeNull();
  });
});

describe("Hud", () => {
  it("renders the zero-padded index, the name and the eyebrow", () => {
    const p = render(<Hud index={3} name="Services" eyebrow="What we can build for you" />).querySelector("p.hud");
    expect(text(p?.querySelector(".hud__idx"))).toBe("[03]");
    expect(text(p?.querySelector(".hud__name"))).toBe("Services");
    expect(p?.querySelector(".hud__bar")?.getAttribute("aria-hidden")).toBe("true");
    expect(text(p?.querySelector(".hud__eyebrow"))).toBe("What we can build for you");
  });
});

describe("Brand", () => {
  it("links back to the top with an accessible name", () => {
    const a = render(<Brand />).querySelector("a");
    expect(a?.getAttribute("href")).toBe("#top");
    expect(a?.getAttribute("aria-label")).toBe(site.ui.brandAria);
    expect(text(a)).toBe("Baghici Creative Technologies");
  });
});

describe("Duo", () => {
  it("renders the photo with the person's crop as CSS variables", () => {
    const gabi = site.about.people[1];
    const fig = render(<Duo person={gabi} alt="Gabi" sizes="72px" />).querySelector("figure");
    expect(fig?.className).toBe("duo");
    const style = fig?.getAttribute("style") ?? "";
    expect(style).toContain("--pos:52% 40%");
    expect(style).toContain("--zoom:1.24");
    expect(fig?.querySelector("img")?.getAttribute("src")).toBe("/img/gabi.jpg");
    expect(fig?.querySelector("img")?.getAttribute("alt")).toBe("Gabi");
  });
});

describe("RevealObserver", () => {
  it("renders nothing on the server", () => {
    expect(render(<RevealObserver />).innerHTML).toBe("");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack yarn test src/components/site/ui`
Expected: FAIL, `./Brand`, `./Button`, `./Duo`, `./Hud`, `./Reveal` cannot be resolved.

- [ ] **Step 3: Rewrite `src/app/globals.css`** (ported from mockup lines 14-159, 229, 261-263, 301, 309-310, 326-327, 594-610)

```css
:root{
  --bg:#0A0A0F;
  --bg-2:#0E0E15;
  --surface:#12121B;
  --surface-2:#181824;
  --line:rgba(236,234,244,.08);
  --line-2:rgba(236,234,244,.15);
  --text:#ECEAF4;
  --muted:#A9A6BC;
  --dim:#8C89A2;
  --violet:#8B5CF6;
  --violet-hi:#B39CFF;
  --violet-deep:#7C3AED;
  --violet-ink:#24124F;
  --acid:#C6F432;

  --f-display:var(--font-unbounded), "Arial Black", system-ui, sans-serif;
  --f-body:var(--font-instrument-sans), system-ui, -apple-system, "Segoe UI", sans-serif;
  --f-mono:var(--font-jetbrains-mono), ui-monospace, "SFMono-Regular", Menlo, monospace;

  /* spacing scale */
  --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem; --s-5:1.5rem;
  --s-6:2rem; --s-7:3rem; --s-8:4rem; --s-9:6rem;
  --gutter:clamp(1rem, .4rem + 3vw, 3rem);
  --section:clamp(5rem, 3rem + 7vw, 10rem);
  --radius:14px;
  --nav-h:68px;
  --ease:cubic-bezier(.2,.7,.2,1);
}

*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:calc(var(--nav-h) + 12px);-webkit-text-size-adjust:100%}
body{
  margin:0;background:var(--bg);color:var(--text);
  font-family:var(--f-body);font-size:clamp(1rem,.96rem + .2vw,1.0625rem);line-height:1.65;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  overflow-x:clip;overflow-wrap:break-word;
}
/* film grain + faint scanlines, pure CSS */
body::before{
  content:"";position:fixed;inset:0;z-index:90;pointer-events:none;
  background-image:
    radial-gradient(circle at 30% 30%, rgba(255,255,255,.04) 0 .5px, transparent .9px),
    radial-gradient(circle at 70% 70%, rgba(255,255,255,.025) 0 .5px, transparent .9px),
    radial-gradient(circle at 50% 10%, rgba(0,0,0,.18) 0 .5px, transparent .9px),
    repeating-linear-gradient(0deg, rgba(255,255,255,.01) 0 1px, transparent 1px 3px);
  background-size:3px 3px, 5px 5px, 11px 11px, 100% 3px;
  opacity:.7;
}
img{max-width:100%;display:block;height:auto}
a{color:inherit}
h1,h2,h3,h4{font-family:var(--f-display);font-weight:600;margin:0;letter-spacing:-.025em;line-height:1.08;overflow-wrap:break-word}
p{margin:0}
ul,ol{margin:0;padding:0;list-style:none}
::selection{background:var(--violet-deep);color:#fff}

:focus-visible{outline:2px solid var(--violet-hi);outline-offset:3px;border-radius:4px}

.skip{position:absolute;left:var(--gutter);top:-100px;z-index:200;background:var(--violet-deep);color:#fff;padding:.6rem 1rem;border-radius:8px;font-family:var(--f-mono);font-size:.8rem;text-decoration:none}
.skip:focus{top:12px}

.wrap{width:min(100% - 2*var(--gutter), 1280px);margin-inline:auto}
.mono{font-family:var(--f-mono);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}
.vh{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* ---------- Buttons ---------- */
.btn{
  --pad-y:.95rem; --pad-x:1.35rem;
  display:inline-flex;align-items:center;gap:.7rem;
  padding:var(--pad-y) var(--pad-x);border-radius:10px;
  font-family:var(--f-body);font-weight:600;font-size:1rem;line-height:1.2;
  text-decoration:none;border:1px solid transparent;
  transition:transform .25s var(--ease), box-shadow .25s var(--ease), background-color .25s var(--ease), border-color .25s var(--ease), color .25s;
}
.btn svg{flex:none;transition:transform .25s var(--ease)}
.btn--primary{
  background:var(--violet-deep);color:#fff;
  border-color:rgba(255,255,255,.14);
  box-shadow:0 0 0 1px rgba(139,92,246,.55), 0 10px 40px -8px rgba(139,92,246,.65), inset 0 1px 0 rgba(255,255,255,.18);
}
.btn--primary:hover{background:#8547F0;transform:translateY(-2px);box-shadow:0 0 0 1px rgba(167,139,250,.8), 0 16px 56px -8px rgba(139,92,246,.85), inset 0 1px 0 rgba(255,255,255,.22)}
.btn--primary:hover svg{transform:translate(2px,-2px)}
.btn--ghost{color:var(--text);border-color:var(--line-2);background:rgba(255,255,255,.02)}
.btn--ghost:hover{border-color:var(--violet-hi);color:#fff;background:rgba(139,92,246,.08)}
.btn--ghost:hover svg{transform:translateY(2px)}
.btn:active{transform:translateY(0)}

/* ---------- HUD section labels ---------- */
.hud{
  display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;
  font-family:var(--f-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);
  margin-bottom:var(--s-5);
}
.hud__idx{color:var(--acid)}
.hud__name{color:var(--text)}
.hud__bar{flex:0 0 2.5rem;height:1px;background:var(--line-2)}
.hud__eyebrow{color:var(--violet-hi)}

/* ---------- Sections ---------- */
.sec{position:relative;padding-block:var(--section);border-top:1px solid var(--line)}
.sec-head{
  display:grid;gap:var(--s-5) var(--s-8);
  grid-template-columns:minmax(0,1fr);
  margin-bottom:clamp(2.5rem, 1.5rem + 4vw, 5rem);
}
@media (min-width:900px){
  .sec-head{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:end}
}
.sec-title{font-size:clamp(1.85rem, 1rem + 3.4vw, 3.75rem);max-width:16ch}
.sec-intro{color:var(--muted);font-size:clamp(1.02rem,.95rem + .3vw,1.15rem);max-width:46ch}

/* corner brackets helper */
.brackets{position:relative}
.brackets::before,.brackets::after{
  content:"";position:absolute;width:14px;height:14px;pointer-events:none;
  border-color:var(--violet-hi);border-style:solid;opacity:.8;
}
.brackets::before{top:-6px;left:-6px;border-width:1px 0 0 1px}
.brackets::after{bottom:-6px;right:-6px;border-width:0 1px 1px 0}

/* ---------- Duotone photos ---------- */
.duo{
  position:relative;margin:0;aspect-ratio:1/1;overflow:hidden;
  background:var(--violet-ink);border-radius:10px;isolation:isolate;
}
.duo img{
  width:100%;height:100%;object-fit:cover;
  object-position:var(--pos,50% 50%);
  transform:scale(var(--zoom,1));transform-origin:var(--origin,50% 40%);
  filter:grayscale(1) contrast(1.12) brightness(.9);
  transition:filter .6s var(--ease), transform .8s var(--ease);
}
.duo::after{
  content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(165deg,#A78BFA 0%, #6A45D8 50%, #22114F 100%);
  mix-blend-mode:color;opacity:.8;transition:opacity .6s var(--ease);
}
.duo::before{
  content:"";position:absolute;inset:0;z-index:2;pointer-events:none;
  background:linear-gradient(180deg, transparent 55%, rgba(10,10,15,.45));
  transition:opacity .6s var(--ease);
}
.reveal-color:hover .duo img,.reveal-color:focus-within .duo img{filter:none;transform:scale(calc(var(--zoom,1) + .03))}
.reveal-color:hover .duo::after,.reveal-color:focus-within .duo::after{opacity:0}
.reveal-color:hover .duo::before,.reveal-color:focus-within .duo::before{opacity:.4}

/* ---------- Blinking live dot, cursor, scroll line ---------- */
.rec{display:inline-flex;align-items:center;gap:.4rem;color:var(--acid);font-size:.66rem}
.rec::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--acid);box-shadow:0 0 0 3px rgba(198,244,50,.15);animation:blink 1.6s steps(2,start) infinite}
@keyframes blink{to{visibility:hidden}}
.cursor{display:inline-block;width:.55em;height:1em;background:var(--violet-hi);vertical-align:-2px;margin-left:.2rem;animation:blink 1.1s steps(2,start) infinite}
.scroll-line{display:inline-block;width:1px;height:22px;background:linear-gradient(var(--violet-hi),transparent);animation:drop 2s var(--ease) infinite}
@keyframes drop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
/* WCAG 2.2.2: the ticker's pause button toggles .motion-paused on <html> */
.motion-paused .rec::before,.motion-paused .cursor,.motion-paused .scroll-line{animation-play-state:paused}

/* mobile menu open: lock page scroll */
@media (max-width:1199px){
  body.menu-open{overflow:hidden}
}

/* ---------- Reveal ---------- */
.js [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .8s var(--ease), transform .8s var(--ease)}
.js [data-reveal].is-in{opacity:1;transform:none}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}
  .js [data-reveal]{opacity:1;transform:none}
  .rec::before,.cursor,.scroll-line{animation:none}
}
```

- [ ] **Step 4: Rewrite `src/app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://baghici.com"),
  title: site.meta.title,
  description: site.meta.description,
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    type: "website",
    url: "https://baghici.com",
    siteName: site.brand.name,
  },
  twitter: { card: "summary", title: site.meta.title, description: site.meta.description },
};

export const viewport: Viewport = { themeColor: "#0A0A0F" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The inline script below adds the "js" class before hydration, hence suppressHydrationWarning.
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Reveal animations only hide content when JS is available to show it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WN07WSC84E" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WN07WSC84E');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create the UI primitives**

`src/components/site/ui/Button.tsx`:

```tsx
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  icon?: "up-right" | "down";
  external?: boolean;
  /** Visually hidden suffix for screen readers, e.g. "(opens WhatsApp in a new tab)". */
  srHint?: string;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  icon = "up-right",
  external = false,
  srHint,
  className,
  children,
}: ButtonProps) {
  const classes = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");
  const newTab = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={classes} href={href} {...newTab}>
      {children}
      {srHint ? <span className="vh"> {srHint}</span> : null}
      {icon === "up-right" ? <ArrowUpRight /> : <ArrowDown />}
    </a>
  );
}

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 2v10M3 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
```

`src/components/site/ui/Hud.tsx`:

```tsx
import { pad2 } from "@/lib/format";

type HudProps = { index: number; name: string; eyebrow: string };

export function Hud({ index, name, eyebrow }: HudProps) {
  return (
    <p className="hud">
      <span className="hud__idx">{`[${pad2(index)}]`}</span>
      <span className="hud__name">{name}</span>
      <span className="hud__bar" aria-hidden="true" />
      <span className="hud__eyebrow">{eyebrow}</span>
    </p>
  );
}
```

`src/components/site/ui/Brand.module.css` (mockup lines 172-177):

```css
.brand{display:inline-flex;align-items:center;gap:.7rem;text-decoration:none;min-width:0;border-radius:8px}
.mark{flex:none;width:34px;height:34px}
.text{display:flex;flex-direction:column;line-height:1;min-width:0}
.name{font-family:var(--f-display);font-weight:700;font-size:1rem;letter-spacing:-.01em}
.sub{font-family:var(--f-mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:.35rem;white-space:nowrap}
@media (max-width:360px){.sub{font-size:.56rem;letter-spacing:.06em}}
```

`src/components/site/ui/Brand.tsx`:

```tsx
import { site } from "@/content/site";
import styles from "./Brand.module.css";

export function Brand() {
  return (
    <a className={styles.brand} href="#top" aria-label={site.ui.brandAria}>
      <svg className={styles.mark} viewBox="0 0 34 34" aria-hidden="true">
        <rect x=".5" y=".5" width="33" height="33" rx="9" fill="#14121F" stroke="#8B5CF6" />
        <path
          d="M11 8.5h7.2a4.3 4.3 0 0 1 0 8.6H11zM11 17.1h8.4a4.2 4.2 0 0 1 0 8.4H11z"
          fill="none"
          stroke="#ECEAF4"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="23.5" y="7" width="3" height="3" fill="#C6F432" />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>{site.brand.short}</span>{" "}
        <span className={styles.sub}>{site.brand.sub}</span>
      </span>
    </a>
  );
}
```

(The `{" "}` keeps "Baghici Creative Technologies" readable as text; it is invisible because `.text` is a flex column.)

`src/components/site/ui/Duo.tsx`:

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Person } from "@/content/site";

type DuoProps = { person: Person; alt: string; sizes: string; className?: string };

export function Duo({ person, alt, sizes, className }: DuoProps) {
  const style = {
    "--pos": person.crop.position,
    "--origin": person.crop.position,
    "--zoom": String(person.crop.zoom),
  } as CSSProperties;
  return (
    <figure className={["duo", className].filter(Boolean).join(" ")} style={style}>
      <Image
        src={person.photo.src}
        alt={alt}
        width={person.photo.width}
        height={person.photo.height}
        sizes={sizes}
      />
    </figure>
  );
}
```

`src/components/site/ui/Reveal.tsx`:

```tsx
"use client";

import { useEffect } from "react";

/** Adds .is-in to every [data-reveal] element as it scrolls into view (mockup lines 1112-1124). */
export function RevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `corepack yarn test src/components/site/ui`
Expected: PASS, 6 tests.

- [ ] **Step 7: Confirm the app still builds with the new layout and fonts**

Run: `corepack yarn build`
Expected: build succeeds. The old bento page still renders (unstyled, since `globals.css` no longer has the Tailwind directives); that is expected on this branch and is replaced in Task 8.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/site/ui
git commit -m "Add design tokens, fonts, layout and UI primitives" -- src/app/globals.css src/app/layout.tsx src/components/site/ui
```

---

### Task 4: Nav, Hero and Ticker

**Files:**
- Create: `src/components/site/Nav.tsx`, `src/components/site/Nav.module.css`, `src/components/site/Hero.tsx`, `src/components/site/Hero.module.css`, `src/components/site/Ticker.tsx`, `src/components/site/Ticker.module.css`, `src/components/site/top.test.tsx`

**Interfaces:**
- Consumes: `site` (`nav`, `contact`, `hero`, `about.people`, `services.items`, `ui`) from `@/content/site`; `whatsappHref` from `@/lib/links`; `pad2` from `@/lib/format`; `Brand`, `Button`, `Duo` from `./ui/*`; global classes from Task 3.
- Produces: `Nav()` (client, renders `<header id="nav">`), `Hero()` (renders `<section id="top">`, includes `<Ticker />`), `Ticker()` (client).

- [ ] **Step 1: Write the failing test `src/components/site/top.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack yarn test src/components/site/top.test.tsx`
Expected: FAIL, `./Hero`, `./Nav`, `./Ticker` cannot be resolved.

- [ ] **Step 3: Create `src/components/site/Nav.module.css`** (mockup lines 162-171, 179-228)

```css
.nav{position:fixed;inset:0 0 auto 0;z-index:80;height:var(--nav-h)}
/* blur lives on a pseudo-element so it does not become the containing block of the fixed mobile panel */
.nav::before{
  content:"";position:absolute;inset:0;z-index:-1;
  background:rgba(10,10,15,.72);
  -webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);
  border-bottom:1px solid var(--line);
}
.nav.open::before{background:var(--bg)}
.inner{height:100%;display:flex;align-items:center;justify-content:space-between;gap:var(--s-5)}

.panel{display:flex;align-items:center;gap:var(--s-6)}
.links{display:flex;gap:.25rem}
.links a{
  display:inline-flex;align-items:baseline;gap:.4rem;padding:.55rem .7rem;border-radius:8px;
  font-family:var(--f-mono);font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;
  color:var(--muted);text-decoration:none;transition:color .2s, background-color .2s;
}
.links a span{color:var(--dim);font-size:.62rem}
.links a:hover{color:var(--text);background:rgba(255,255,255,.04)}
.links a:hover span{color:var(--acid)}
.cta:global(.btn){--pad-y:.7rem;--pad-x:1rem;font-size:.9rem;box-shadow:0 0 0 1px rgba(139,92,246,.5), 0 6px 24px -8px rgba(139,92,246,.6), inset 0 1px 0 rgba(255,255,255,.16)}

.toggle{
  display:none;align-items:center;gap:.6rem;
  background:transparent;color:var(--text);border:1px solid var(--line-2);border-radius:10px;
  padding:.6rem .8rem;cursor:pointer;font-family:var(--f-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;
}
.toggle:hover{border-color:var(--violet-hi)}
.burger{position:relative;width:18px;height:12px}
.burger i{position:absolute;left:0;right:0;height:1.5px;background:currentColor;border-radius:2px;transition:transform .3s var(--ease), opacity .2s, top .3s var(--ease)}
.burger i:nth-child(1){top:0}
.burger i:nth-child(2){top:5px}
.burger i:nth-child(3){top:10px}
.toggle[aria-expanded="true"] .burger i:nth-child(1){top:5px;transform:rotate(45deg)}
.toggle[aria-expanded="true"] .burger i:nth-child(2){opacity:0}
.toggle[aria-expanded="true"] .burger i:nth-child(3){top:5px;transform:rotate(-45deg)}

@media (max-width:1199px){
  .toggle{display:inline-flex}
  .panel{
    position:fixed;left:0;right:0;top:var(--nav-h);bottom:0;
    flex-direction:column;align-items:stretch;justify-content:space-between;gap:var(--s-6);
    padding:var(--s-6) var(--gutter) calc(var(--s-6) + env(safe-area-inset-bottom));
    background:
      linear-gradient(to right, var(--line) 1px, transparent 1px) 0 0/64px 64px,
      linear-gradient(to bottom, var(--line) 1px, transparent 1px) 0 0/64px 64px,
      var(--bg);
    overflow-y:auto;
    visibility:hidden;opacity:0;transform:translateY(-8px);
    transition:opacity .3s var(--ease), transform .3s var(--ease), visibility 0s linear .3s;
  }
  .nav.open .panel{visibility:visible;opacity:1;transform:none;transition:opacity .3s var(--ease), transform .3s var(--ease), visibility 0s}
  .links{flex-direction:column;gap:0}
  .links li{border-bottom:1px solid var(--line)}
  .links a{
    display:flex;justify-content:space-between;align-items:center;width:100%;padding:1.05rem .25rem;border-radius:0;
    font-family:var(--f-display);font-size:clamp(1.4rem,1rem + 3vw,2.25rem);letter-spacing:-.02em;text-transform:none;color:var(--text);font-weight:500;
  }
  .links a span{font-family:var(--f-mono);font-size:.72rem;letter-spacing:.12em;color:var(--acid);order:2}
  .cta:global(.btn){align-self:stretch;justify-content:center;--pad-y:1rem;font-size:1rem}
}
```

- [ ] **Step 4: Create `src/components/site/Nav.tsx`** (behaviour from mockup lines 1080-1110)

```tsx
"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { whatsappHref } from "@/lib/links";
import { Brand } from "./ui/Brand";
import { Button } from "./ui/Button";
import styles from "./Nav.module.css";

const MOBILE_QUERY = "(max-width: 1199px)";

export function Nav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Lock scroll and make the page behind the full-screen menu inert, so Tab cannot wander behind it.
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    for (const el of [document.getElementById("main"), document.querySelector("footer")]) {
      if (!el) continue;
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Leaving the mobile breakpoint closes the menu.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeOnLinkClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a") && window.matchMedia(MOBILE_QUERY).matches) setOpen(false);
  };

  return (
    <header className={`${styles.nav} ${open ? styles.open : ""}`} id="nav">
      <div className={`wrap ${styles.inner}`}>
        <Brand />

        <button
          ref={toggleRef}
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? site.ui.close : site.ui.menu}</span>
          <span className={styles.burger} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>

        <div className={styles.panel} id="nav-panel" onClick={closeOnLinkClick}>
          <nav aria-label={site.ui.primaryNav}>
            <ul className={styles.links}>
              {site.nav.map((item, i) => (
                <li key={item.anchor}>
                  <a href={`#${item.anchor}`}>
                    <span>{pad2(i + 1)}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button href={whatsappHref(site.contact)} external srHint={site.ui.opensWhatsApp} className={styles.cta}>
            {site.hero.ctaPrimary}
          </Button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Create `src/components/site/Ticker.module.css`** (mockup lines 313-334, 603-607, 610)

```css
.ticker{position:relative;border-block:1px solid var(--line);overflow:hidden;background:var(--bg-2)}
.track{display:flex;width:max-content;animation:tick 38s linear infinite}
.ticker:hover .track{animation-play-state:paused}
:global(.motion-paused) .track{animation-play-state:paused}
/* WCAG 2.2.2: a keyboard/touch way to stop the looping ticker and blinking HUD bits */
.pause{
  position:absolute;top:0;right:0;bottom:0;z-index:1;display:grid;place-items:center;width:3rem;padding:0;
  background:linear-gradient(90deg, rgba(14,14,21,0), var(--bg-2) 35%);border:0;color:var(--muted);cursor:pointer;
}
.pause:hover{color:var(--text)}
.pause:focus-visible{outline-offset:-4px}
.list{display:flex;flex:none}
.list li{
  display:flex;align-items:center;gap:1.4rem;padding:1rem 1.4rem;white-space:nowrap;
  font-family:var(--f-display);font-weight:500;font-size:clamp(.95rem,.85rem + .4vw,1.2rem);color:var(--muted);letter-spacing:-.01em;
}
.list li::after{content:"";width:7px;height:7px;transform:rotate(45deg);border:1px solid var(--violet)}
@keyframes tick{to{transform:translateX(-50%)}}

:global(html:not(.js)) .pause{display:none}

@media (prefers-reduced-motion:reduce){
  /* static ticker: the list must wrap, otherwise everything past the first item is clipped on narrow screens */
  .track{animation:none;width:auto}
  .list[aria-hidden="true"]{display:none}
  .list{flex:1 1 auto;flex-wrap:wrap}
  .list li{white-space:normal;padding-block:.6rem}
  .pause{display:none}
}
```

- [ ] **Step 6: Create `src/components/site/Ticker.tsx`**

```tsx
"use client";

import { useState } from "react";
import { site } from "@/content/site";
import styles from "./Ticker.module.css";

export function Ticker() {
  const [paused, setPaused] = useState(false);
  const titles = site.services.items.map((s) => s.title);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    // Also pauses the blinking live dot, cursor and scroll line (see .motion-paused in globals.css).
    document.documentElement.classList.toggle("motion-paused", next);
  };

  return (
    <div className={styles.ticker} role="group" aria-label={site.ui.ticker.ariaLabel}>
      <button className={styles.pause} type="button" aria-pressed={paused} onClick={toggle}>
        <span className="vh">{site.ui.ticker.pause}</span>
        {paused ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3.5 2v8M8.5 2v8" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
      <div className={styles.track}>
        <ul className={styles.list}>
          {titles.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {titles.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create `src/components/site/Hero.module.css`** (mockup lines 233-311, without `.rec`, `.cursor`, `.scroll-line`, which are global)

```css
.hero{
  position:relative;min-height:100vh;min-height:100svh;
  padding-top:calc(var(--nav-h) + clamp(2.5rem, 1rem + 6vw, 6rem));
  padding-bottom:0;display:flex;flex-direction:column;
  overflow:hidden;
}
.hero::before{
  content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:
    linear-gradient(to right, rgba(236,234,244,.06) 1px, transparent 1px) 0 0/clamp(48px,6vw,88px) clamp(48px,6vw,88px),
    linear-gradient(to bottom, rgba(236,234,244,.06) 1px, transparent 1px) 0 0/clamp(48px,6vw,88px) clamp(48px,6vw,88px);
  -webkit-mask-image:radial-gradient(ellipse 80% 70% at 30% 35%, #000 20%, transparent 75%);
          mask-image:radial-gradient(ellipse 80% 70% at 30% 35%, #000 20%, transparent 75%);
}
.grid{
  flex:1;display:grid;gap:clamp(2.5rem,1rem + 4vw,4.5rem);align-items:center;
  grid-template-columns:minmax(0,1fr);
  padding-bottom:clamp(2.5rem,1.5rem + 3vw,4rem);
}
@media (min-width:1024px){
  .grid{grid-template-columns:minmax(0,1.55fr) minmax(0,.85fr)}
}
.eyebrow{
  display:inline-flex;align-items:center;gap:.65rem;flex-wrap:wrap;
  font-family:var(--f-mono);font-size:.76rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);
  padding:.45rem .75rem;border:1px solid var(--line-2);border-radius:8px;margin-bottom:var(--s-6);
  background:rgba(10,10,15,.6);
}
.title{
  font-size:clamp(2.1rem, .75rem + 5.1vw, 5.25rem);
  font-weight:600;letter-spacing:-.04em;line-height:1.02;max-width:14ch;
}
.l2{display:block;color:var(--violet-hi)}
.l2 em{font-style:normal;position:relative;white-space:nowrap}
.l2 em::after{
  content:"";position:absolute;left:0;right:0;bottom:.04em;height:.08em;
  background:linear-gradient(90deg,var(--violet),transparent);opacity:.8;
}
.sub{margin-top:var(--s-6);max-width:54ch;color:var(--muted);font-size:clamp(1.05rem,.98rem + .35vw,1.22rem);line-height:1.6}
.ctas{display:flex;flex-wrap:wrap;gap:var(--s-4);margin-top:var(--s-7)}

/* party panel */
.party{
  background:linear-gradient(180deg, rgba(24,24,36,.85), rgba(14,14,21,.85));
  border:1px solid var(--line-2);border-radius:var(--radius);
  padding:var(--s-5);max-width:440px;width:100%;justify-self:start;
}
@media (min-width:1024px){.party{justify-self:end}}
.partyHead,.partyFoot{
  display:flex;justify-content:space-between;align-items:center;gap:var(--s-4);
  font-family:var(--f-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);
}
.partyHead{padding-bottom:var(--s-4);border-bottom:1px dashed var(--line-2)}
.partyHead b{color:var(--acid);font-weight:500}
.partyList{display:grid;gap:var(--s-2);padding-block:var(--s-4)}
.partyRow{
  display:grid;grid-template-columns:72px minmax(0,1fr);gap:var(--s-4);align-items:center;
  padding:var(--s-2);border-radius:10px;border:1px solid transparent;transition:border-color .3s, background-color .3s;
}
.partyRow:hover{border-color:var(--line-2);background:rgba(139,92,246,.06)}
.partyRow :global(.duo){border-radius:8px}
.slot{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.14em;color:var(--violet-hi)}
.name{display:block;font-family:var(--f-display);font-weight:600;font-size:1.1rem;letter-spacing:-.01em;margin-block:.15rem}
.role{display:block;color:var(--muted);font-size:.9rem;line-height:1.35}
.partyFoot{padding-top:var(--s-4);border-top:1px dashed var(--line-2)}

.meta{
  display:flex;justify-content:space-between;align-items:center;gap:var(--s-4);
  padding-bottom:var(--s-4);font-family:var(--f-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);
}
.meta a{text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;color:var(--muted)}
.meta a:hover{color:var(--text)}
```

- [ ] **Step 8: Create `src/components/site/Hero.tsx`**

```tsx
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { Ticker } from "./Ticker";
import { Button } from "./ui/Button";
import { Duo } from "./ui/Duo";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero, about, ui } = site;
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className={styles.eyebrow}>
            <span className="rec" aria-hidden="true">
              {ui.live}
            </span>{" "}
            {hero.eyebrow}
          </p>
          <h1 className={styles.title} id="hero-title">
            {hero.h1.lead}{" "}
            <span className={styles.l2}>
              {hero.h1.accent} <em>{hero.h1.underline}</em>
            </span>
          </h1>
          <p className={styles.sub}>{hero.sub}</p>
          <div className={styles.ctas}>
            <Button href={whatsappHref(site.contact)} external srHint={ui.opensWhatsApp}>
              {hero.ctaPrimary}
            </Button>
            <Button href="#work" variant="ghost" icon="down">
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>

        <aside className={`${styles.party} brackets`} aria-label={ui.party.ariaLabel}>
          <div className={styles.partyHead}>
            <span>{ui.party.title}</span>
            <b>{ui.party.count}</b>
          </div>
          <ul className={styles.partyList}>
            {about.people.map((person) => (
              <li key={person.name} className={`${styles.partyRow} reveal-color`}>
                <Duo person={person} alt={person.partyAlt} sizes="72px" />
                <div>
                  <span className={styles.slot}>{person.slot}</span>
                  <span className={styles.name}>{person.name}</span>
                  <span className={styles.role}>{person.role}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.partyFoot}>
            <span>
              {ui.party.footer}
              <span className="cursor" aria-hidden="true" />
            </span>
            <span>{ui.party.region}</span>
          </div>
        </aside>
      </div>

      <div className={`wrap ${styles.meta}`}>
        <a href="#about">
          <span className="scroll-line" aria-hidden="true" />
          {ui.scroll}
        </a>
        <span>{ui.start}</span>
      </div>

      <Ticker />
    </section>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `corepack yarn test src/components/site/top.test.tsx`
Expected: PASS, 9 tests.

- [ ] **Step 10: Commit**

```bash
git add src/components/site/Nav.tsx src/components/site/Nav.module.css src/components/site/Hero.tsx src/components/site/Hero.module.css src/components/site/Ticker.tsx src/components/site/Ticker.module.css src/components/site/top.test.tsx
git commit -m "Add nav, hero and services ticker" -- src/components/site/Nav.tsx src/components/site/Nav.module.css src/components/site/Hero.tsx src/components/site/Hero.module.css src/components/site/Ticker.tsx src/components/site/Ticker.module.css src/components/site/top.test.tsx
```

---

### Task 5: About and Philosophy

**Files:**
- Create: `src/components/site/About.tsx`, `src/components/site/About.module.css`, `src/components/site/Philosophy.tsx`, `src/components/site/Philosophy.module.css`, `src/components/site/about-philosophy.test.tsx`

**Interfaces:**
- Consumes: `site` (`about`, `philosophy`, `ui`), `navItem` from `@/content/site`; `pad2` from `@/lib/format`; `Hud`, `Duo` from `./ui/*`; global classes from Task 3.
- Produces: `About()` (renders `<section id="about">`), `Philosophy()` (renders `<section id="philosophy">`).

- [ ] **Step 1: Write the failing test `src/components/site/about-philosophy.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack yarn test src/components/site/about-philosophy.test.tsx`
Expected: FAIL, `./About` and `./Philosophy` cannot be resolved.

- [ ] **Step 3: Create `src/components/site/About.module.css`** (mockup lines 337-379)

The mockup styled the "together" label and text through `.together p`; here each gets its own class so the label cannot inherit the text's font.

```css
.players{
  display:grid;gap:clamp(2.5rem,1.5rem + 3vw,4rem) clamp(1.5rem,1rem + 2vw,3rem);
  grid-template-columns:minmax(0,1fr);
}
@media (min-width:700px){
  .players{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (min-width:1200px){
  /* fluid thirds: a fixed 2x420px left the Together card ~195px wide at 1200-1280px and its text overflowed */
  .players{grid-template-columns:repeat(2,minmax(0,1fr)) minmax(0,.85fr)}
}
.player{display:flex;flex-direction:column;gap:var(--s-4)}
.frame{width:100%;max-width:440px;margin-bottom:var(--s-3)}
.frame :global(.duo){border-radius:12px}
.hud{
  position:absolute;z-index:3;left:12px;right:12px;top:12px;
  display:flex;justify-content:space-between;
  font-family:var(--f-mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#fff;
}
.hud span{background:rgba(10,10,15,.72);padding:.3rem .5rem;border-radius:6px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.hud span:first-child{color:var(--acid)}
.head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.25rem 1rem}
.player h3{font-size:clamp(1.6rem,1.2rem + 1.4vw,2.2rem);letter-spacing:-.03em}
.role{font-family:var(--f-mono);font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--violet-hi)}
.tag{
  align-self:flex-start;font-family:var(--f-display);font-size:.9rem;font-weight:500;
  padding:.45rem .8rem;border-radius:8px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.35);color:#E4DBFF;
}
.bio{color:var(--muted);max-width:52ch}

.together{
  position:relative;align-self:start;
  border:1px solid var(--line-2);border-radius:var(--radius);padding:clamp(1.5rem,1rem + 2vw,2.25rem);
  background:
    linear-gradient(to right, var(--line) 1px, transparent 1px) 0 0/24px 24px,
    linear-gradient(to bottom, var(--line) 1px, transparent 1px) 0 0/24px 24px,
    var(--bg-2);
}
@media (min-width:700px) and (max-width:1199px){.together{grid-column:1 / -1}}
@media (min-width:1200px){.together{position:sticky;top:calc(var(--nav-h) + 2rem)}}
.togetherLabel{display:flex;align-items:center;gap:.6rem;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:var(--s-5);line-height:1.4}
.togetherLabel b{color:var(--violet-hi);font-weight:500}
.togetherText{font-family:var(--f-display);font-weight:400;font-size:clamp(1.15rem,1rem + .7vw,1.5rem);line-height:1.4;letter-spacing:-.015em;color:var(--text)}
```

- [ ] **Step 4: Create `src/components/site/About.tsx`**

```tsx
import { navItem, site } from "@/content/site";
import { Duo } from "./ui/Duo";
import { Hud } from "./ui/Hud";
import styles from "./About.module.css";

export function About() {
  const { about, ui } = site;
  const meta = navItem("about");
  return (
    <section className="sec" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={about.eyebrow} />
            <h2 className="sec-title" id="about-title">
              {about.heading}
            </h2>
          </div>
          <p className="sec-intro">{about.intro}</p>
        </div>

        <div className={styles.players}>
          {about.people.map((person) => (
            <article key={person.name} className={`${styles.player} reveal-color`} data-reveal>
              <div className={`${styles.frame} brackets`}>
                {/* teodora.jpg is 492px wide: the frame caps at 440px so it is never upscaled. */}
                <Duo person={person} alt={person.photo.alt} sizes="(min-width: 700px) 440px, 100vw" />
                <div className={styles.hud} aria-hidden="true">
                  <span>{person.slot}</span>
                  <span>{person.hudLabel}</span>
                </div>
              </div>
              <div className={styles.head}>
                <h3>{person.name}</h3>
                <p className={styles.role}>{person.role}</p>
              </div>
              <p className={styles.tag}>{person.tag}</p>
              <p className={styles.bio}>{person.bio}</p>
            </article>
          ))}

          <aside className={styles.together} data-reveal aria-label={ui.together.ariaLabel}>
            <p className={styles.togetherLabel}>
              <b>{ui.together.label}</b>
              <span aria-hidden="true">{ui.together.separator}</span>
              {ui.together.mode}
            </p>
            <p className={styles.togetherText}>{about.together}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/components/site/Philosophy.module.css`** (mockup lines 382-411)

```css
.philo{display:grid;gap:clamp(2.5rem,1.5rem + 3vw,4.5rem);grid-template-columns:minmax(0,1fr)}
@media (min-width:1024px){.philo{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:start}}
.title{font-size:clamp(2.2rem,1rem + 5vw,5rem);letter-spacing:-.04em;line-height:1}
.title span{display:block;color:var(--violet-hi)}
.body{font-size:clamp(1.08rem,1rem + .4vw,1.3rem);line-height:1.65;color:var(--muted);max-width:58ch}
.body strong{color:var(--text);font-weight:500}
.spectrum{
  margin-top:clamp(3rem,2rem + 3vw,5rem);
  display:grid;gap:var(--s-4);grid-template-columns:minmax(0,1fr);
  position:relative;
}
@media (min-width:768px){.spectrum{grid-template-columns:repeat(3,minmax(0,1fr));gap:0}}
.pillar{
  position:relative;padding:clamp(1.5rem,1rem + 1.5vw,2.25rem);
  border:1px solid var(--line-2);background:var(--bg-2);border-radius:var(--radius);
  transition:background-color .3s, border-color .3s;
}
@media (min-width:768px){
  .pillar{border-radius:0}
  .pillar + .pillar{border-left:0}
  .pillar:first-child{border-radius:var(--radius) 0 0 var(--radius)}
  .pillar:last-child{border-radius:0 var(--radius) var(--radius) 0}
}
.pillar:hover{background:var(--surface);border-color:rgba(167,139,250,.45)}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:clamp(2rem,1rem + 3vw,4rem);font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.meter{display:flex;gap:3px}
.meter i{width:10px;height:4px;background:var(--line-2);border-radius:1px}
.meter i.on{background:var(--violet)}
.pillar h3{font-size:clamp(1.5rem,1.1rem + 1.3vw,2.1rem);margin-bottom:var(--s-3);letter-spacing:-.03em}
.pillar p{color:var(--muted)}
```

- [ ] **Step 6: Create `src/components/site/Philosophy.tsx`**

```tsx
import { Fragment } from "react";
import { navItem, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Philosophy.module.css";

export function Philosophy() {
  const { philosophy, ui } = site;
  const meta = navItem("philosophy");
  return (
    <section className="sec" id="philosophy" aria-labelledby="philo-title">
      <div className="wrap">
        <div className={styles.philo}>
          <div data-reveal>
            <Hud index={meta.index} name={meta.label} eyebrow={philosophy.eyebrow} />
            <h2 className={styles.title} id="philo-title">
              {philosophy.heading.lead} <span>{philosophy.heading.accent}</span>
            </h2>
          </div>
          <p className={styles.body} data-reveal>
            {philosophy.body.map((segment, i) =>
              segment.strong ? <strong key={i}>{segment.text}</strong> : <Fragment key={i}>{segment.text}</Fragment>,
            )}
          </p>
        </div>

        <ul className={styles.spectrum} data-reveal>
          {philosophy.pillars.map((pillar, i) => (
            <li key={pillar.label} className={styles.pillar}>
              <div className={styles.top}>
                <span>{`${ui.pillarPrefix} ${pad2(i + 1)}`}</span>
                <Meter level={i + 1} />
              </div>
              <h3>{pillar.label}</h3>
              <p>{pillar.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Meter({ level }: { level: number }) {
  return (
    <span className={styles.meter} aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <i key={n} className={n <= level ? styles.on : undefined} />
      ))}
    </span>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `corepack yarn test src/components/site/about-philosophy.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 8: Commit**

```bash
git add src/components/site/About.tsx src/components/site/About.module.css src/components/site/Philosophy.tsx src/components/site/Philosophy.module.css src/components/site/about-philosophy.test.tsx
git commit -m "Add about and philosophy sections" -- src/components/site/About.tsx src/components/site/About.module.css src/components/site/Philosophy.tsx src/components/site/Philosophy.module.css src/components/site/about-philosophy.test.tsx
```

---

### Task 6: Services and Work

**Files:**
- Create: `src/components/site/Services.tsx`, `src/components/site/Services.module.css`, `src/components/site/Work.tsx`, `src/components/site/Work.module.css`, `src/components/site/services-work.test.tsx`

**Interfaces:**
- Consumes: `site` (`services`, `work`, `ui`), `navItem`, type `Project` from `@/content/site`; `pad2` from `@/lib/format`; `Hud` from `./ui/Hud`; global classes from Task 3.
- Produces: `Services()` (renders `<section id="services">`), `Work()` (renders `<section id="work">`).

- [ ] **Step 1: Write the failing test `src/components/site/services-work.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack yarn test src/components/site/services-work.test.tsx`
Expected: FAIL, `./Services` and `./Work` cannot be resolved.

- [ ] **Step 3: Create `src/components/site/Services.module.css`** (mockup lines 414-446)

```css
.svc{border-top:1px solid var(--line-2)}
.row{
  position:relative;display:grid;gap:var(--s-3) var(--s-6);
  grid-template-columns:minmax(0,1fr);
  padding:clamp(1.5rem,1rem + 1.5vw,2.5rem) clamp(.25rem,.1rem + 1vw,1.25rem);
  border-bottom:1px solid var(--line-2);
  transition:background-color .35s var(--ease);
}
.row::before{
  content:"";position:absolute;left:0;top:-1px;height:1px;width:0;background:var(--violet-hi);transition:width .5s var(--ease);
}
.row:hover{background:linear-gradient(90deg, rgba(139,92,246,.08), transparent 70%)}
.row:hover::before{width:100%}
.idx{font-family:var(--f-mono);font-size:.74rem;letter-spacing:.12em;color:var(--violet-hi);padding-top:.35rem}
.title{font-size:clamp(1.3rem,1rem + 1.1vw,1.9rem);letter-spacing:-.025em;line-height:1.15;hyphens:manual}
.benefit{color:var(--text);opacity:.92;max-width:44ch}
.details{display:grid;gap:.45rem}
.details li{display:flex;gap:.6rem;align-items:baseline;font-family:var(--f-mono);font-size:.8rem;letter-spacing:.02em;color:var(--muted);line-height:1.45}
.details li::before{content:"+";color:var(--violet-hi);flex:none}
@media (min-width:768px){
  .row{grid-template-columns:3.5rem minmax(0,1fr) minmax(0,1.1fr)}
  .details{grid-column:3}
  .benefit{grid-column:3}
  .title{grid-row:1 / span 2;grid-column:2}
  .idx{grid-row:1 / span 2}
}
@media (min-width:1200px){
  .row{grid-template-columns:4rem minmax(0,1.05fr) minmax(0,1.1fr) minmax(0,.85fr);align-items:start}
  .title{grid-row:auto}
  .idx{grid-row:auto}
  .benefit{grid-column:3}
  .details{grid-column:4}
}
```

- [ ] **Step 4: Create `src/components/site/Services.tsx`**

```tsx
import { navItem, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Services.module.css";

export function Services() {
  const { services, ui } = site;
  const meta = navItem("services");
  return (
    <section className="sec" id="services" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={services.eyebrow} />
            <h2 className="sec-title" id="svc-title">
              {services.heading}
            </h2>
          </div>
          <p className="sec-intro">{services.intro}</p>
        </div>

        <ol className={styles.svc}>
          {services.items.map((item, i) => (
            <li key={item.title} className={styles.row} data-reveal>
              <span className={styles.idx} aria-hidden="true">{`${ui.servicePrefix}${pad2(i + 1)}`}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.benefit}>{item.benefit}</p>
              <ul className={styles.details}>
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/components/site/Work.module.css`** (mockup lines 449-524)

The mockup's `.tile p` rule also overrode the category's violet color; here the category and subtitle get separate classes so the category stays violet as designed.

```css
.feature{
  position:relative;border-radius:calc(var(--radius) + 4px);
  padding:clamp(1.5rem,1rem + 2.5vw,3.25rem);
  background:
    radial-gradient(120% 80% at 100% 0%, rgba(139,92,246,.16), transparent 55%),
    linear-gradient(180deg, #15122A, #0E0D18);
  border:1px solid rgba(139,92,246,.55);
  box-shadow:0 0 0 1px rgba(139,92,246,.18), 0 30px 90px -40px rgba(139,92,246,.75), inset 0 1px 0 rgba(255,255,255,.06);
  display:grid;gap:clamp(2rem,1rem + 3vw,3.5rem);
  grid-template-columns:minmax(0,1fr);
  margin-bottom:clamp(1.25rem,1rem + 1vw,2rem);
}
@media (min-width:1024px){.feature{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);align-items:stretch}}
.feature::before,.feature::after{
  content:"";position:absolute;width:22px;height:22px;border:1px solid var(--violet-hi);pointer-events:none
}
.feature::before{top:10px;left:10px;border-width:1px 0 0 1px}
.feature::after{bottom:10px;right:10px;border-width:0 1px 1px 0}
.flag{display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:var(--s-6)}
.flag b{color:var(--acid);font-weight:500;border:1px solid rgba(198,244,50,.4);padding:.25rem .5rem;border-radius:5px}
.logo{width:min(100%,300px);height:auto;margin-bottom:var(--s-6)}
.feature h3{font-size:clamp(1.4rem,1rem + 1.6vw,2.35rem);letter-spacing:-.03em;max-width:20ch}
.featureSub{margin-top:var(--s-4);color:var(--violet-hi);font-family:var(--f-mono);font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;line-height:1.5}
.items{display:grid;gap:var(--s-4);grid-template-columns:minmax(0,1fr)}
@media (min-width:640px){.items{grid-template-columns:repeat(2,minmax(0,1fr))}}
.fitem{
  position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:var(--s-6);
  padding:clamp(1.25rem,1rem + 1vw,1.75rem);border-radius:var(--radius);
  background:rgba(10,10,15,.55);border:1px solid var(--line-2);
  transition:border-color .3s, transform .3s var(--ease);
}
.fitem:hover{border-color:rgba(167,139,250,.6);transform:translateY(-3px)}
.icon{width:44px;height:44px;border-radius:10px;display:grid;place-items:center;background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.4);color:var(--violet-hi)}
.fitem h4{font-size:1.15rem;letter-spacing:-.015em;margin-bottom:.5rem;line-height:1.25}
.fitem p{color:var(--muted);font-size:.98rem}

.tiles{display:grid;gap:clamp(1rem,.75rem + 1vw,1.5rem);grid-template-columns:minmax(0,1fr)}
@media (min-width:600px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1200px){.tiles{grid-template-columns:repeat(4,minmax(0,1fr))}}
.tile{
  display:flex;flex-direction:column;border:1px solid var(--line-2);border-radius:var(--radius);
  background:var(--bg-2);overflow:hidden;transition:border-color .3s, transform .3s var(--ease);
}
.tile:hover{border-color:rgba(167,139,250,.55);transform:translateY(-4px)}
.link{display:flex;flex-direction:column;flex:1;color:inherit;text-decoration:none;border-radius:inherit}
.link:focus-visible{outline-offset:-3px}
.media{
  position:relative;aspect-ratio:4/3;display:grid;place-items:center;
  background:
    linear-gradient(to right, var(--line) 1px, transparent 1px) 0 0/22px 22px,
    linear-gradient(to bottom, var(--line) 1px, transparent 1px) 0 0/22px 22px,
    var(--surface);
  border-bottom:1px solid var(--line-2);
}
.media :global(.mono){position:absolute;top:12px;left:14px;color:var(--dim);font-size:.66rem;letter-spacing:.14em}
.media :global(.mono) + :global(.mono){left:auto;right:14px}
.appicon{
  width:clamp(88px,34%,124px);aspect-ratio:1;border-radius:24%;overflow:hidden;
  box-shadow:0 18px 40px -16px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.08);
  transition:transform .5s var(--ease);
}
.tile:hover .appicon{transform:translateY(-4px) rotate(-3deg)}
.appicon img{width:100%;height:100%;object-fit:cover}
.ta{
  display:grid;place-items:center;position:relative;
  background:radial-gradient(circle at 50% 50%, #1F1840, #0B0A14 70%);
}
.ta svg{position:absolute;inset:0;width:100%;height:100%}
.ta span{position:relative;font-family:var(--f-display);font-weight:700;font-size:clamp(1.4rem,1rem + 1vw,1.85rem);letter-spacing:-.04em;color:#fff}
.th{
  display:grid;place-items:center;position:relative;
  background:linear-gradient(160deg,#EDE7FF,#C9B8FF);
}
.th svg{width:80%;height:80%}
.body{padding:clamp(1.15rem,1rem + .6vw,1.5rem);display:flex;flex-direction:column;gap:.45rem}
.cat{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--violet-hi)}
.tile h3{font-size:1.3rem;letter-spacing:-.02em}
.subtitle{color:var(--muted);font-size:.98rem}
```

- [ ] **Step 6: Create `src/components/site/Work.tsx`** (markup and SVGs from mockup lines 870-969)

```tsx
import Image from "next/image";
import { navItem, site, type Project } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Work.module.css";

export function Work() {
  const { work, ui } = site;
  const meta = navItem("work");
  return (
    <section className="sec" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={work.eyebrow} />
            <h2 className="sec-title" id="work-title">
              {work.heading}
            </h2>
          </div>
          <p className="sec-intro">{work.intro}</p>
        </div>

        <article className={styles.feature} data-reveal aria-labelledby="mnir-title">
          <div>
            <p className={styles.flag}>
              <b>{ui.featured}</b>
              <span>{`${ui.workPrefix}${pad2(1)}`}</span>
            </p>
            <Image
              className={styles.logo}
              src={work.mnir.logo.src}
              alt={work.mnir.logo.alt}
              width={work.mnir.logo.width}
              height={work.mnir.logo.height}
              sizes="300px"
            />
            <h3 id="mnir-title">{work.mnir.title}</h3>
            <p className={styles.featureSub}>{work.mnir.subtitle}</p>
          </div>
          <div className={styles.items}>
            {work.mnir.items.map((item) => (
              <div key={item.title} className={styles.fitem}>
                <span className={styles.icon} aria-hidden="true">
                  {item.icon === "game" ? <GameIcon /> : <WarehouseIcon />}
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.line}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <ul className={styles.tiles}>
          {work.projects.map((project, i) => (
            <ProjectTile key={project.name} project={project} number={i + 2} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectTile({ project, number }: { project: Project; number: number }) {
  const { ui } = site;
  const content = (
    <>
      <div className={styles.media}>
        <span className="mono" aria-hidden="true">{`${ui.workPrefix}${pad2(number)}`}</span>
        {project.href ? (
          <span className="mono" aria-hidden="true">
            {ui.visit}
          </span>
        ) : null}
        <ProjectMark project={project} />
      </div>
      <div className={styles.body}>
        <p className={styles.cat}>{project.category}</p>
        <h3>{project.name}</h3>
        <p className={styles.subtitle}>{project.subtitle}</p>
        {project.href ? <span className="vh">{ui.opensNewTab}</span> : null}
      </div>
    </>
  );

  return (
    <li className={styles.tile} data-reveal>
      {project.href ? (
        <a className={styles.link} href={project.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}

function ProjectMark({ project }: { project: Project }) {
  const label = `${project.name} ${site.ui.monogramSuffix}`;
  if (project.logo) {
    return (
      <div className={styles.appicon}>
        <Image
          src={project.logo.src}
          alt={project.logo.alt}
          width={project.logo.width}
          height={project.logo.height}
          sizes="124px"
        />
      </div>
    );
  }
  if (project.monogram === "tank-arena") {
    return (
      <div className={`${styles.appicon} ${styles.ta}`} role="img" aria-label={label}>
        <svg viewBox="0 0 100 100" aria-hidden="true" fill="none">
          <circle cx="50" cy="50" r="34" stroke="#8B5CF6" strokeOpacity=".7" />
          <circle cx="50" cy="50" r="22" stroke="#8B5CF6" strokeOpacity=".35" strokeDasharray="3 4" />
          <path d="M50 6v14M50 80v14M6 50h14M80 50h14" stroke="#B39CFF" strokeWidth="1.4" />
          <path d="M14 26v-12h12M86 26v-12H74M14 74v12h12M86 74v12H74" stroke="#ECEAF4" strokeOpacity=".5" />
        </svg>
        <span aria-hidden="true">TA</span>
      </div>
    );
  }
  return (
    <div className={`${styles.appicon} ${styles.th}`} role="img" aria-label={label}>
      <svg viewBox="0 0 80 80" aria-hidden="true" fill="none">
        <circle cx="30" cy="34" r="17" stroke="#2A1466" strokeWidth="2" />
        <circle cx="50" cy="34" r="17" stroke="#7C3AED" strokeWidth="2" />
        <path d="M40 20.5a17 17 0 0 1 0 27a17 17 0 0 1 0-27z" fill="#7C3AED" fillOpacity=".25" />
        <text
          x="40"
          y="70"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="500"
          fontSize="8"
          fill="#2A1466"
          letterSpacing="1.2"
        >
          TWO·HANDS
        </text>
      </svg>
    </div>
  );
}

function GameIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="7" width="19" height="11" rx="5.5" />
      <path d="M7.5 10.5v4M5.5 12.5h4" />
      <circle cx="16" cy="11.5" r=".9" fill="currentColor" />
      <circle cx="18" cy="13.8" r=".9" fill="currentColor" />
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5 12 4l9 5.5V20H3z" />
      <path d="M7 20v-6h10v6M7 17h10" />
    </svg>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `corepack yarn test src/components/site/services-work.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 8: Commit**

```bash
git add src/components/site/Services.tsx src/components/site/Services.module.css src/components/site/Work.tsx src/components/site/Work.module.css src/components/site/services-work.test.tsx
git commit -m "Add services and work sections" -- src/components/site/Services.tsx src/components/site/Services.module.css src/components/site/Work.tsx src/components/site/Work.module.css src/components/site/services-work.test.tsx
```

---

### Task 7: Lab, Contact and Footer

**Files:**
- Create: `src/components/site/Lab.tsx`, `src/components/site/Lab.module.css`, `src/components/site/Contact.tsx`, `src/components/site/Contact.module.css`, `src/components/site/Footer.tsx`, `src/components/site/Footer.module.css`, `src/components/site/lab-contact-footer.test.tsx`

**Interfaces:**
- Consumes: `site` (`lab`, `contactSection`, `contact`, `footer`, `nav`, `brand`, `ui`), `navItem` from `@/content/site`; `pad2` from `@/lib/format`; `whatsappHref`, `mailtoHref` from `@/lib/links`; `Hud`, `Button`, `Brand` from `./ui/*`; global classes from Task 3.
- Produces: `Lab()` (renders `<section id="lab">`), `Contact()` (renders `<section id="contact">`), `Footer()` (renders `<footer>`).

- [ ] **Step 1: Write the failing test `src/components/site/lab-contact-footer.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { render, text } from "@/test/render";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Lab } from "./Lab";

describe("Lab", () => {
  const lab = render(<Lab />);

  it("is the #lab section with its HUD label and heading", () => {
    expect(lab.querySelector("section#lab")).not.toBeNull();
    expect(text(lab.querySelector(".hud__idx"))).toBe("[05]");
    expect(text(lab.querySelector("h2"))).toBe(site.lab.heading);
    expect(text(lab.querySelector(".sec-intro"))).toBe(site.lab.intro);
  });

  it("lists the three experiments with numbered labels", () => {
    const items = [...lab.querySelectorAll("ul > li")];
    expect(items.map((li) => text(li.querySelector("h3")))).toEqual(site.lab.items.map((item) => item.title));
    expect(items.map((li) => text(li.querySelector("b")))).toEqual(["Exp/01", "Exp/02", "Exp/03"]);
    items.forEach((li, i) => expect(text(li)).toContain(site.lab.items[i].line));
  });
});

describe("Contact", () => {
  const contact = render(<Contact />);

  it("is the #contact section with the split heading", () => {
    expect(contact.querySelector("section#contact")).not.toBeNull();
    expect(text(contact.querySelector(".hud__idx"))).toBe("[06]");
    expect(text(contact.querySelector("h2"))).toBe("Coffee's on us. Virtually, anyway.");
    expect(text(contact)).toContain(site.contactSection.body);
  });

  it("books the coffee chat on WhatsApp and offers email as a fallback", () => {
    const cta = contact.querySelector("a.btn");
    expect(cta?.getAttribute("href")).toBe(whatsappHref(site.contact));
    expect(cta?.getAttribute("target")).toBe("_blank");
    expect(text(cta)).toContain(site.contactSection.cta);
    const mail = contact.querySelector('a[href^="mailto:"]');
    expect(mail?.getAttribute("href")).toBe("mailto:office@baghici.com");
    expect(text(mail?.parentElement)).toBe("Prefer email? Write to office@baghici.com");
  });
});

describe("Footer", () => {
  const footer = render(<Footer />);

  it("repeats the brand, tagline and section links", () => {
    expect(footer.querySelector("footer a[href='#top']")).not.toBeNull();
    expect(text(footer)).toContain(site.footer.tagline);
    const links = [...footer.querySelectorAll('nav[aria-label="Footer"] a')];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(site.nav.map((n) => `#${n.anchor}`));
  });

  it("ends with the copyright and a back-to-top link", () => {
    expect(text(footer)).toContain(site.footer.copyright);
    const back = [...footer.querySelectorAll("a")].find((a) => text(a) === site.ui.backToTop);
    expect(back?.getAttribute("href")).toBe("#top");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack yarn test src/components/site/lab-contact-footer.test.tsx`
Expected: FAIL, `./Contact`, `./Footer`, `./Lab` cannot be resolved.

- [ ] **Step 3: Create `src/components/site/Lab.module.css`** (mockup lines 527-545)

```css
.lab{
  background:
    linear-gradient(to right, rgba(236,234,244,.035) 1px, transparent 1px) 0 0/56px 56px,
    linear-gradient(to bottom, rgba(236,234,244,.035) 1px, transparent 1px) 0 0/56px 56px,
    var(--bg-2);
}
.exps{display:grid;gap:clamp(1rem,.75rem + 1vw,1.5rem);grid-template-columns:minmax(0,1fr)}
@media (min-width:900px){.exps{grid-template-columns:repeat(3,minmax(0,1fr))}}
.exp{
  position:relative;padding:clamp(1.5rem,1rem + 1.5vw,2.25rem);border-radius:var(--radius);
  background:rgba(10,10,15,.75);border:1px dashed rgba(167,139,250,.35);
  display:flex;flex-direction:column;gap:var(--s-4);transition:border-color .3s, background-color .3s;
}
.exp:hover{border-style:solid;border-color:rgba(167,139,250,.65);background:rgba(18,18,27,.9)}
.top{display:flex;justify-content:space-between;align-items:center;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:var(--s-5)}
.top b{color:var(--violet-hi);font-weight:500}
.glyph{width:100%;height:56px;margin-bottom:var(--s-2)}
.exp h3{font-size:clamp(1.15rem,1rem + .5vw,1.4rem);letter-spacing:-.02em;line-height:1.25}
.exp p{color:var(--muted)}
```

- [ ] **Step 4: Create `src/components/site/Lab.tsx`** (glyph SVGs from mockup lines 987-1014)

```tsx
import { navItem, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { Hud } from "./ui/Hud";
import styles from "./Lab.module.css";

export function Lab() {
  const { lab, ui } = site;
  const meta = navItem("lab");
  return (
    <section className={`sec ${styles.lab}`} id="lab" aria-labelledby="lab-title">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div>
            <Hud index={meta.index} name={meta.label} eyebrow={lab.eyebrow} />
            <h2 className="sec-title" id="lab-title">
              {lab.heading}
            </h2>
          </div>
          <p className="sec-intro">{lab.intro}</p>
        </div>

        <ul className={styles.exps}>
          {lab.items.map((item, i) => (
            <li key={item.title} className={styles.exp} data-reveal>
              <div className={styles.top}>
                <b>{`${ui.labPrefix}${pad2(i + 1)}`}</b>
                <span>{ui.labStatus}</span>
              </div>
              <LabGlyph variant={i} />
              <h3>{item.title}</h3>
              <p>{item.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LabGlyph({ variant }: { variant: number }) {
  const common = {
    className: styles.glyph,
    viewBox: "0 0 240 56",
    preserveAspectRatio: "xMinYMid meet",
    "aria-hidden": true,
    fill: "none",
  } as const;

  if (variant === 0) {
    return (
      <svg {...common}>
        <path d="M2 46 C40 46 50 12 92 14 S150 40 190 22 238 10 238 10" stroke="#8B5CF6" strokeWidth="1.5" />
        <g fill="#B39CFF">
          <circle cx="2" cy="46" r="3" />
          <circle cx="92" cy="14" r="3" />
          <circle cx="190" cy="22" r="3" />
        </g>
        <path d="M0 54h240" stroke="rgba(236,234,244,.15)" strokeDasharray="2 4" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg {...common}>
        <rect x="2" y="8" width="90" height="10" rx="2" stroke="#B39CFF" />
        <rect x="2" y="8" width="90" height="10" rx="2" fill="#8B5CF6" fillOpacity=".35" />
        <rect x="2" y="32" width="90" height="10" rx="2" stroke="#B39CFF" />
        <rect x="2" y="32" width="48" height="10" rx="2" fill="#8B5CF6" fillOpacity=".35" />
        <path d="M60 37h28M80 31l8 6-8 6" stroke="#ECEAF4" strokeOpacity=".6" />
        <path d="M110 25h128" stroke="rgba(236,234,244,.15)" strokeDasharray="2 4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <g stroke="#B39CFF">
        <rect x="2" y="4" width="34" height="18" rx="3" />
        <rect x="2" y="34" width="34" height="18" rx="3" />
        <rect x="72" y="19" width="34" height="18" rx="3" />
        <rect x="142" y="19" width="34" height="18" rx="3" stroke="#8B5CF6" />
      </g>
      <path d="M36 13h18v15h18M36 43h18V28M106 28h36" stroke="#ECEAF4" strokeOpacity=".5" />
      <path d="M190 28h48" stroke="rgba(236,234,244,.15)" strokeDasharray="2 4" />
    </svg>
  );
}
```

- [ ] **Step 5: Create `src/components/site/Contact.module.css`** (mockup lines 548-568)

```css
.cta{
  position:relative;text-align:left;
  border:1px solid var(--line-2);border-radius:calc(var(--radius) + 6px);
  padding:clamp(2rem,1rem + 5vw,6rem) clamp(1.25rem,.5rem + 5vw,6rem);
  overflow:hidden;
  background:
    linear-gradient(to right, rgba(236,234,244,.05) 1px, transparent 1px) 0 0/64px 64px,
    linear-gradient(to bottom, rgba(236,234,244,.05) 1px, transparent 1px) 0 0/64px 64px,
    var(--bg-2);
}
.title{font-size:clamp(2rem,.9rem + 4.8vw,5.25rem);letter-spacing:-.04em;line-height:1.02;max-width:15ch}
.title span{color:var(--violet-hi);display:block}
.body{margin-top:var(--s-6);color:var(--muted);font-size:clamp(1.05rem,1rem + .3vw,1.2rem);max-width:56ch}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s-5) var(--s-6);margin-top:var(--s-7)}
.primary:global(.btn){--pad-y:1.15rem;--pad-x:1.6rem;font-size:1.05rem}
.mail{color:var(--muted);font-size:.98rem}
.mail a{color:var(--text);text-decoration:underline;text-decoration-color:rgba(167,139,250,.6);text-underline-offset:4px;text-decoration-thickness:1px;transition:color .2s, text-decoration-color .2s}
.mail a:hover{color:var(--violet-hi);text-decoration-color:currentColor}
.corner{position:absolute;top:clamp(1rem,.5rem + 1.5vw,2rem);right:clamp(1rem,.5rem + 1.5vw,2rem);font-family:var(--f-mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);display:flex;align-items:center;gap:.5rem}
.corner::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--acid)}
@media (max-width:520px){.corner{position:static;margin-bottom:var(--s-5)}}
```

- [ ] **Step 6: Create `src/components/site/Contact.tsx`**

```tsx
import { navItem, site } from "@/content/site";
import { mailtoHref, whatsappHref } from "@/lib/links";
import { Button } from "./ui/Button";
import { Hud } from "./ui/Hud";
import styles from "./Contact.module.css";

export function Contact() {
  const { contactSection, contact, ui } = site;
  const meta = navItem("contact");
  return (
    <section className="sec" id="contact" aria-labelledby="cta-title">
      <div className="wrap">
        <div className={styles.cta} data-reveal>
          <span className={styles.corner} aria-hidden="true">
            {ui.channelOpen}
          </span>
          <Hud index={meta.index} name={meta.label} eyebrow={contactSection.eyebrow} />
          <h2 className={styles.title} id="cta-title">
            {contactSection.heading.lead} <span>{contactSection.heading.accent}</span>
          </h2>
          <p className={styles.body}>{contactSection.body}</p>
          <div className={styles.row}>
            <Button href={whatsappHref(contact)} external srHint={ui.opensWhatsApp} className={styles.primary}>
              {contactSection.cta}
            </Button>
            <p className={styles.mail}>
              {contactSection.emailLead} <a href={mailtoHref(contact.email)}>{contact.email}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Create `src/components/site/Footer.module.css`** (mockup lines 571-592)

```css
.foot{border-top:1px solid var(--line);padding-block:clamp(3rem,2rem + 3vw,5rem) var(--s-6)}
.top{display:grid;gap:var(--s-6);grid-template-columns:minmax(0,1fr)}
@media (min-width:900px){.top{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:start}}
.tag{margin-top:var(--s-4);color:var(--muted);max-width:38ch}
.nav{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem}
@media (min-width:900px){.nav{justify-content:flex-end}}
.nav a{font-family:var(--f-mono);font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);text-decoration:none;padding:.35rem 0;border-radius:4px}
.nav a:hover{color:var(--text)}
.mark{
  margin-top:clamp(2.5rem,2rem + 3vw,5rem);
  font-family:var(--f-display);font-weight:700;letter-spacing:-.05em;line-height:.85;
  font-size:clamp(3rem,15vw,12.5rem);white-space:nowrap;
  color:transparent;-webkit-text-stroke:1px rgba(167,139,250,.35);
  user-select:none;
}
.bottom{
  display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--s-3) var(--s-5);
  margin-top:var(--s-5);padding-top:var(--s-5);border-top:1px solid var(--line);
  font-family:var(--f-mono);font-size:.72rem;letter-spacing:.06em;color:var(--dim);
}
.bottom a{color:var(--muted);text-decoration:none}
.bottom a:hover{color:var(--text)}
```

- [ ] **Step 8: Create `src/components/site/Footer.tsx`**

```tsx
import { site } from "@/content/site";
import { Brand } from "./ui/Brand";
import styles from "./Footer.module.css";

export function Footer() {
  const { footer, nav, brand, ui } = site;
  return (
    <footer className={styles.foot}>
      <div className="wrap">
        <div className={styles.top}>
          <div>
            <Brand />
            <p className={styles.tag}>{footer.tagline}</p>
          </div>
          <nav aria-label={ui.footerNav}>
            <ul className={styles.nav}>
              {nav.map((item) => (
                <li key={item.anchor}>
                  <a href={`#${item.anchor}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={styles.mark} aria-hidden="true">
          {brand.short}
        </p>
        <div className={styles.bottom}>
          <span>{footer.copyright}</span>
          <a href="#top">{ui.backToTop}</a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `corepack yarn test src/components/site/lab-contact-footer.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 10: Commit**

```bash
git add src/components/site/Lab.tsx src/components/site/Lab.module.css src/components/site/Contact.tsx src/components/site/Contact.module.css src/components/site/Footer.tsx src/components/site/Footer.module.css src/components/site/lab-contact-footer.test.tsx
git commit -m "Add lab, contact and footer sections" -- src/components/site/Lab.tsx src/components/site/Lab.module.css src/components/site/Contact.tsx src/components/site/Contact.module.css src/components/site/Footer.tsx src/components/site/Footer.module.css src/components/site/lab-contact-footer.test.tsx
```

---

### Task 8: Compose the page, remove the old site, verify

**Files:**
- Modify (full rewrite): `src/app/page.tsx`
- Create: `src/app/page.test.tsx`
- Modify: `package.json`, `yarn.lock` (dependency removals)
- Delete: `src/components/bento/`, `src/components/ui/button.tsx`, `src/lib/github.ts`, `src/lib/utils.ts`, `src/app/fonts/`, `tailwind.config.ts`, `postcss.config.mjs`, `public/pfp.png`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, and `public/logo.png` / `public/favicon.png` only if unreferenced (Step 5)

**Interfaces:**
- Consumes: every section component from Tasks 4-7, `RevealObserver` from Task 3, `site` from Task 2, `whatsappHref` from Task 1.
- Produces: the finished static `/` route.

- [ ] **Step 1: Write the failing test `src/app/page.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack yarn test src/app/page.test.tsx`
Expected: FAIL. The current `page.tsx` is the async bento page, so the section-order assertion fails (or the render throws on the async component).

- [ ] **Step 3: Rewrite `src/app/page.tsx`**

```tsx
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Lab } from "@/components/site/Lab";
import { Nav } from "@/components/site/Nav";
import { Philosophy } from "@/components/site/Philosophy";
import { Services } from "@/components/site/Services";
import { RevealObserver } from "@/components/site/ui/Reveal";
import { Work } from "@/components/site/Work";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        {site.ui.skip}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Philosophy />
        <Services />
        <Work />
        <Lab />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `corepack yarn test src/app/page.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 5: Remove the old site and its dependencies**

First check whether anything still references the two generic images:

```bash
grep -rn "logo.png\|favicon.png" src public next.config.mjs || echo "unreferenced"
```

Then remove (add `public/logo.png public/favicon.png` to the `git rm` only if the grep printed `unreferenced`):

```bash
git rm -r -q src/components/bento src/components/ui/button.tsx src/lib/github.ts src/lib/utils.ts src/app/fonts tailwind.config.ts postcss.config.mjs public/pfp.png public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
corepack yarn remove @octokit/rest framer-motion lucide-react clsx tailwind-merge tailwindcss postcss
grep -rn "tailwind\|framer-motion\|lucide-react\|@octokit\|clsx\|tailwind-merge\|GITHUB_TOKEN" src package.json || echo "clean"
```

Expected: the last command prints `clean`.

- [ ] **Step 6: Run the full test suite, lint and a production build**

```bash
corepack yarn test
corepack yarn lint
corepack yarn build
```

Expected: all tests pass; lint reports no errors; the build's route table lists `/` as `○ (Static)`.

- [ ] **Step 7: Verify the URLs that must not change**

```bash
corepack yarn start -p 3100 > /tmp/bct-start.log 2>&1 &
SERVER=$!
sleep 5
curl -sS -i http://localhost:3100/app-ads.txt | sed -n '1p;/content-type/Ip;$p'
curl -sS -o /dev/null -w "privacy %{http_code}\n" http://localhost:3100/magnetron.io/privacy
curl -sS http://localhost:3100/ | grep -c 'id="contact"'
kill $SERVER
```

Expected: `HTTP/1.1 200 OK`, `content-type: text/plain...`, the line `google.com, pub-3331261510845840, DIRECT, f08c47fec0942fa0`; `privacy 200`; `1`.

- [ ] **Step 8: Commit**

```bash
git add -A src/app/page.tsx src/app/page.test.tsx package.json yarn.lock
git commit -m "Compose the new home page and remove the old bento site" -- src/app/page.tsx src/app/page.test.tsx package.json yarn.lock src/components/bento src/components/ui/button.tsx src/lib/github.ts src/lib/utils.ts src/app/fonts tailwind.config.ts postcss.config.mjs public/pfp.png public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

(Add `public/logo.png public/favicon.png` to the pathspec if they were removed in Step 5.)

- [ ] **Step 9: Visual verification against the mockup (orchestrator, in the browser pane)**

With `corepack yarn start -p 3100` running, compare `http://localhost:3100/` against the mockup at 1440, 768 and 375 px wide. At 375 px, run in the page:

```js
({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, h1: document.querySelectorAll("h1").length, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src) })
```

Expected: `scroll === client`, `h1 === 1`, `broken` empty. Also open and close the mobile menu (button, link click, Escape) and toggle the ticker pause.
