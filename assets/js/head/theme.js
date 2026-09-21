// The section must not be in the theme.js (body) file because it can create a quick flash (switch between light and dark).

// Transitions are suppressed around the class flip, but only once the page has
// been painted. The first call runs from the head, before there is anything on
// screen to transition, and `requestAnimationFrame` is not guaranteed to fire
// before the user sees the page - so the guard keeps the very first theme
// application synchronous and unconditional. See `hextra-theme-switching` in
// styles.css for what the class does and why it is needed.
let hextraThemeApplied = false;

function setTheme(theme) {
  const root = document.documentElement;
  const suppressTransitions = hextraThemeApplied;

  if (suppressTransitions) {
    root.classList.add("hextra-theme-switching");
  }

  root.classList.remove("light", "dark");

  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  root.classList.add(theme);
  root.style.colorScheme = theme;

  if (suppressTransitions) {
    // Reading a layout property forces the new colours to be computed now,
    // while the suppression is still in effect. Without it the class could be
    // removed before the browser has recalculated, and every transition would
    // start from the old value after all.
    void root.offsetHeight;
    requestAnimationFrame(() => root.classList.remove("hextra-theme-switching"));
  }

  hextraThemeApplied = true;
}

// Guarded inline rather than through core/storage.js: this is the head bundle,
// which is deliberately separate and runs before it. localStorage throws
// SecurityError when storage is blocked - a third-party iframe, Chrome's "block
// all cookies" - and js/head/*.js is concatenated into one file, so an
// unguarded throw here would take banner.js down with it and leave the page
// with no theme class at all.
let storedTheme = null;
try {
  storedTheme = localStorage.getItem("color-theme");
} catch (err) {
  // Blocked storage: fall back to the configured default.
}

setTheme(storedTheme ?? "{{ site.Params.theme.default | default `system`}}");
