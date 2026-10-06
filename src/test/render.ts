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
