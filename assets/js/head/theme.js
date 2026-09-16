// The section must not be in the theme.js (body) file because it can create a quick flash (switch between light and dark).

function setTheme(theme) {
  document.documentElement.classList.remove("light", "dark");

  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
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
