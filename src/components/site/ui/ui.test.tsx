import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/content/site";
import { REVEAL_READY_CLASS } from "@/lib/reveal";
import { mount, render, text } from "@/test/render";
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

describe("RevealObserver in the browser", () => {
  const html = document.documentElement;
  let intersect: (el: Element) => void;

  beforeEach(() => {
    // Only reports an intersection when the test calls intersect(), so "not yet in view" is observable.
    class FakeIntersectionObserver {
      private readonly targets = new Set<Element>();
      constructor(private readonly callback: IntersectionObserverCallback) {
        intersect = (el) => {
          if (!this.targets.has(el)) return;
          const entry = { isIntersecting: true, target: el } as IntersectionObserverEntry;
          this.callback([entry], this as unknown as IntersectionObserver);
        };
      }
      observe(el: Element) {
        this.targets.add(el);
      }
      unobserve(el: Element) {
        this.targets.delete(el);
      }
      disconnect() {
        this.targets.clear();
      }
    }
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    html.classList.remove("js", REVEAL_READY_CLASS);
  });

  const page = () => (
    <>
      <section data-reveal="" />
      <RevealObserver />
    </>
  );

  it("tells the head failsafe it is running, then reveals sections as they scroll into view", () => {
    html.classList.add("js");
    const { container, unmount } = mount(page());
    const section = container.querySelector("section");
    expect(html.classList.contains(REVEAL_READY_CLASS)).toBe(true);
    expect(section?.classList.contains("is-in")).toBe(false);
    if (section) intersect(section);
    expect(section?.classList.contains("is-in")).toBe(true);
    unmount();
  });

  it("after the head failsafe removed js, keeps every section shown and puts js back", () => {
    const { container, unmount } = mount(page());
    expect(container.querySelector("section")?.classList.contains("is-in")).toBe(true);
    expect(html.classList.contains("js")).toBe(true);
    expect(html.classList.contains(REVEAL_READY_CLASS)).toBe(true);
    unmount();
  });
});
