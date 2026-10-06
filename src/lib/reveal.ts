/** Class RevealObserver puts on <html> once it runs, telling the head failsafe that reveals are handled. */
export const REVEAL_READY_CLASS = "reveal-ready";

/** How long the head failsafe waits for RevealObserver before it shows hidden content anyway. */
export const REVEAL_FAILSAFE_MS = 3000;

/**
 * Inline <head> script. It adds "js" to <html> before first paint, which hides [data-reveal] sections until
 * they scroll into view. RevealObserver only runs after the client bundle hydrates, so if it has not started
 * within REVEAL_FAILSAFE_MS (slow network, failed chunks) the script removes "js" and the sections show.
 */
export const revealHeadScript =
  "(function(){var d=document.documentElement;d.classList.add('js');" +
  `setTimeout(function(){if(!d.classList.contains('${REVEAL_READY_CLASS}'))d.classList.remove('js')},${REVEAL_FAILSAFE_MS})})()`;
