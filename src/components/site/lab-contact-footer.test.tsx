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
