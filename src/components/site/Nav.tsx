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
    // Safari 12-13 only has the older addListener API; calling addEventListener there would crash the page.
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
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
