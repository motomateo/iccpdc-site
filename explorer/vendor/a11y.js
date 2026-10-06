/* ICCPDC — shared accessibility helper (explorer + map).
   Elements that act as buttons but are not <button>/<a href> (chips, cards, photo thumbnails, text units) get
   role="button" + tabindex="0" as they are rendered, and Enter / Space activates them like a click. */
(() => {
const SEL = ".chip, .step, .item[data-st], .li[data-st], .bitem, [data-ph], [data-b], [data-topic], [data-bsel], .text .u, .layer-row[data-k]";
const NATIVE = el => el.matches("a[href], button, input, select, textarea, label") || el.closest("button");
function decorate(root) {
  if (!root || !root.querySelectorAll) return;
  const els = root.matches && root.matches(SEL) ? [root, ...root.querySelectorAll(SEL)] : root.querySelectorAll(SEL);
  for (const el of els) {
    if (NATIVE(el) || el.hasAttribute("tabindex")) continue;
    el.setAttribute("role", "button"); el.tabIndex = 0;
    if (el.classList.contains("chip") && el.classList.contains("off")) el.setAttribute("aria-pressed", "false");
    else if (el.classList.contains("chip") && el.closest(".chips[id^=f-]")) el.setAttribute("aria-pressed", "true");
  }
}
document.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest && e.target.closest('[role="button"]:not(button)');
  if (!el || el !== e.target) return;
  e.preventDefault(); el.click();
});
const start = () => { decorate(document.body); new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(decorate))).observe(document.body, {childList: true, subtree: true}); };
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
