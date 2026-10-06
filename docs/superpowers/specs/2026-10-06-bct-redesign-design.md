# Baghici Creative Technologies — site redesign

- **Date:** 2026-10-06
- **Status:** approved (brainstorming with Gabi)
- **Branch:** `redesign/creative-technologies`
- **Visual source of truth:** [`2026-10-06-bct-redesign/mockup-night-shift.html`](2026-10-06-bct-redesign/mockup-night-shift.html) (direction B, "Night Shift")
- **Copy source of truth:** [`2026-10-06-bct-redesign/copy.json`](2026-10-06-bct-redesign/copy.json)

## Goal

Replace the current single-person "Builder's Hub" bento page at baghici.com with the site of **Baghici Creative Technologies**, a two-person studio (Teodora + Gabi, both 22) that sells B2B tech services to young entrepreneurs, and uses its museum work, R&D and own games as proof of craft.

## Decisions

| Topic | Decision |
|---|---|
| Primary job of the site | Studio that sells services. Convert founders into conversations. Games and MNIR are proof, not equal tracks. |
| Audience | Young entrepreneurs: startups, early-stage founders, modern businesses. |
| Language | English only. |
| Visual direction | B, "Night Shift": dark, Magnetron violet, game-HUD micro-labels, the duo shown as a co-op "party". |
| Implementation | Native Next.js port: one React component per section, CSS Modules ported faithfully from the mockup, all text in one typed content file. |
| Primary CTA | "Book a virtual coffee chat" opens **WhatsApp** (`wa.me/40730792946`) with a prefilled message. Email `office@baghici.com` is the secondary channel, shown in the contact section. |
| Portfolio | MNIR (featured: interactive history games for kids + smart warehouse system), Magnetron.io, to you., Tank Arena, Two Hands. Each project gets at most one subtitle. |
| GitHub feed | Removed. The page no longer fetches anything at runtime. |

### Honesty constraints (carry into any future copy edits)

- No invented numbers, testimonials, client quotes, partners, awards or timelines.
- Lab items are internal research / lab prototypes / architectures tested in-house. Never "pilot", "deployed", "used by schools".
- Magnetron.io: no download counts or store-availability claims (the Play listing was not public at the time of writing).

## Architecture

Single static route `/`, rendered at build time (no `force-dynamic`, no edge runtime, no runtime data fetching).

```
src/
├── app/
│   ├── layout.tsx            fonts (next/font), metadata from site.ts, Google Analytics
│   ├── page.tsx              composes the sections in order
│   └── globals.css           design tokens, reset, background grain/scanlines/grid, shared utilities
├── content/
│   └── site.ts               ALL copy, people, projects, contact; typed
├── lib/
│   └── links.ts              whatsappHref(), mailtoHref()
└── components/site/
    ├── Nav.tsx               client: mobile menu (Escape closes, focus handled)
    ├── Hero.tsx              incl. the "party" card
    ├── Ticker.tsx            client: services marquee with a pause control
    ├── About.tsx
    ├── Philosophy.tsx
    ├── Services.tsx
    ├── Work.tsx              MNIR featured card + 4 project tiles
    ├── Lab.tsx
    ├── Contact.tsx           final CTA (id="contact")
    ├── Footer.tsx
    ├── ui/Hud.tsx            "[01] ABOUT" section label
    ├── ui/Button.tsx         primary / ghost link-buttons
    ├── ui/Reveal.tsx         client: IntersectionObserver reveal-on-scroll
    └── *.module.css          one per component, ported from the mockup
```

- Every component is a server component except `Nav`, `Ticker` and `Reveal`.
- Section order and ids: `top` (hero), `about`, `philosophy`, `services`, `work`, `lab`, `contact`. Nav anchors point to these ids.
- Components contain **no hardcoded copy**. Every visible string comes from `src/content/site.ts`. UI micro-labels from the mockup (e.g. `[01]`, `Party 2 / 2`, `Press start`, `Pause motion`) also live in `site.ts` under a `ui` key, so all text is editable in one place.

## Content model (`src/content/site.ts`)

Typed to mirror `copy.json`, plus:

```ts
export type Person = { name: string; role: string; tag: string; bio: string; photo: { src: string; alt: string; width: number; height: number } };
export type Project = { name: string; category: string; subtitle: string; logo?: { src: string; alt: string }; monogram?: string; href?: string };
export type Contact = { whatsappNumber: string; whatsappText: string; email: string };
```

- `contact.whatsappNumber = "40730792946"`, `contact.whatsappText = "Hi! I'd like to book a virtual coffee chat."`, `contact.email = "office@baghici.com"`.
- `lib/links.ts`: `whatsappHref(contact)` returns `https://wa.me/<number>?text=<encodeURIComponent(text)>`; `mailtoHref(email, subject?)`.
- WhatsApp links open in a new tab with `rel="noopener noreferrer"`.
- Projects: Tank Arena has `href: "https://tank-arena-gilt.vercel.app"` and Two Hands has `href: "https://masajtwohands.com"` (both verified live). Magnetron.io, to you. and MNIR have no link.

## Styling

- Tokens copied 1:1 from the mockup's `:root` into `globals.css` (`--bg #0A0A0F`, `--surface`, `--line`, `--text #ECEAF4`, `--muted #A9A6BC`, `--dim`, `--violet #8B5CF6`, `--violet-hi`, `--violet-deep`, `--violet-ink`, `--acid #C6F432`, spacing scale, `--gutter`, `--section`, `--radius`, `--nav-h`, `--ease`).
- Font families are exposed as CSS variables by `next/font/google` (`Unbounded`, `Instrument Sans`, `JetBrains Mono`), self-hosted at build time. No runtime request to Google Fonts.
- Each component's CSS Module is ported from the mockup's corresponding rules. Class names may be shortened, but values (sizes, clamps, colors, shadows, keyframes) are kept.
- Tailwind is removed if, after the port, no Tailwind class remains (expected: none). Remove `tailwind.config.ts`, `postcss.config.mjs`, the `@tailwind` directives and the dependency.

## Behavior

- **Reveal:** elements fade/slide in once when entering the viewport. With `prefers-reduced-motion: reduce`, or without JS, content is visible immediately (no hidden-by-default state that depends on JS).
- **Ticker:** CSS marquee of the five service titles. It has a visible "Pause motion" toggle (`aria-pressed`). It is static under reduced motion. The duplicated track is `aria-hidden`.
- **Nav:** sticky. On small screens the menu toggles with a button (`aria-expanded`, `aria-controls`), closes on Escape, on link click and on resize to desktop.
- **Photos:** violet duotone by default, full color on hover/focus-within; same square crop for both people. `teodora.jpg` is 492px wide, so it is never rendered wider than ~460 CSS px.

## Assets

`public/img/`:

| File | Source |
|---|---|
| `teodora.jpg` | photo sent in chat (492x469) |
| `gabi.jpg` | photo sent in chat, resized to 1200px |
| `magnetron.png` | `~/git/Magnetron.io/assets/icons/icon_1024.png`, resized to 512 |
| `toyou.png` | `~/git/to-you/app/assets/images/icon.png`, resized to 512 |
| `mnir.png` | mnir.ro `logo_mnir_tr.png` (white wordmark, for dark surfaces) |

All rendered via `next/image` with explicit `sizes`.

## Metadata and analytics

- `metadata.title` / `description` / OpenGraph from `site.meta_title` / `site.meta_description`; `<html lang="en">`.
- Google Analytics (`G-WN07WSC84E`) stays exactly as it is today.

## Removals

- `src/components/bento/*`, `src/components/ui/button.tsx`, `src/lib/github.ts`, `src/lib/utils.ts` (if unused).
- Dependencies: `@octokit/rest`, `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, plus Tailwind tooling (see Styling).
- `public/pfp.png`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, and `public/logo.png` / `public/favicon.png` if nothing references them.
- The `GITHUB_TOKEN` / `GITHUB_USERNAME` env vars become unused (owner can remove them from Vercel).

## Must stay exactly as-is

- `public/app-ads.txt`, served at `https://baghici.com/app-ads.txt` (AdMob).
- `public/magnetron.io/privacy.html` and the `/magnetron.io/privacy` rewrite in `next.config.mjs` (registered in Google Play Console and App Store Connect).
- `src/app/icon.png`, `src/app/favicon.ico` (a new mark is out of scope).

## Verification

1. `npm run build` and `npm run lint` pass with no errors.
2. `next start`, then side-by-side visual comparison with the mockup at 1440, 768 and 375 px in the browser pane.
3. Automated check at 375 px: `document.documentElement.scrollWidth === clientWidth` (no horizontal scroll); exactly one `h1`; every `img` loads.
4. Every CTA resolves to the WhatsApp URL; nav anchors resolve to section ids; mobile menu opens/closes, closes on Escape.
5. `curl` against `next start`: `/app-ads.txt` returns 200 `text/plain` with the AdMob line, and `/magnetron.io/privacy` returns 200 with the policy.
6. Grep `src/` for the words `pilot`, `deployed`, `used by schools`: no matches.

## Out of scope

New logo / favicon, contact form, Cal.com booking, per-project pages, blog, second language, OG image design.

## Open items (do not block launch)

- Higher-resolution photo of Teodora.
- Confirm with MNIR that their logo may appear on the site.
- The owner's description of "to you." was cut off ("...for"); the subtitle stays "Beauty services app, launching soon" until clarified.
- Headline alternatives, if the owner wants to swap the H1: "Old enough to ship. Young enough to stay hungry." / "Built by digital natives for founders who move fast." / "Real business problems. Fixed with tech that works."
