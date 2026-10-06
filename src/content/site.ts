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
