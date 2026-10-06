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
