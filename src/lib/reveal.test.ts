import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { REVEAL_FAILSAFE_MS, REVEAL_READY_CLASS, revealHeadScript } from "./reveal";

const html = document.documentElement;
const runHeadScript = () => Function(revealHeadScript)();

describe("revealHeadScript", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    html.classList.remove("js", REVEAL_READY_CLASS);
  });

  it("marks <html> with js before first paint", () => {
    runHeadScript();
    expect(html.classList.contains("js")).toBe(true);
  });

  it("removes js, showing hidden sections, if RevealObserver has not started by the deadline", () => {
    runHeadScript();
    vi.advanceTimersByTime(REVEAL_FAILSAFE_MS - 1);
    expect(html.classList.contains("js")).toBe(true);
    vi.advanceTimersByTime(1);
    expect(html.classList.contains("js")).toBe(false);
  });

  it("keeps js once RevealObserver has started", () => {
    runHeadScript();
    html.classList.add(REVEAL_READY_CLASS);
    vi.advanceTimersByTime(REVEAL_FAILSAFE_MS);
    expect(html.classList.contains("js")).toBe(true);
  });
});
