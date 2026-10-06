"use client";

import { useEffect } from "react";
import { REVEAL_READY_CLASS } from "@/lib/reveal";

/** Adds .is-in to every [data-reveal] element as it scrolls into view (the mockup's "reveal on scroll" script). */
export function RevealObserver() {
  useEffect(() => {
    const html = document.documentElement;
    // Tells the head failsafe (revealHeadScript) that reveals are handled, so it leaves "js" in place.
    html.classList.add(REVEAL_READY_CLASS);
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No "js" here means the failsafe gave up waiting for hydration and the sections are already showing.
    const failsafeFired = !html.classList.contains("js");
    if (failsafeFired || reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      // JS did arrive after all: restore "js" for what depends on it, like the ticker's pause button.
      // It goes back after .is-in, so nothing hides again.
      html.classList.add("js");
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
