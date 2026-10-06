import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react-dom/test-utils";

// Lets React flush effects and updates inside act() without warning that the environment is not set up for it.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Server-renders an element and returns a detached container to query with the DOM API. */
export function render(element: ReactElement): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(element);
  return host;
}

/** Client-renders an element into the document and runs its effects, so client behaviour can be tested. */
export function mount(element: ReactElement): { container: HTMLElement; unmount: () => void } {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(element));
  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

export { act };

/** Text content with whitespace collapsed, for readable assertions. */
export function text(node: Element | null | undefined): string {
  return (node?.textContent ?? "").replace(/\s+/g, " ").trim();
}
