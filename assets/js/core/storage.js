// Guarded localStorage access, shared by every core module that remembers a
// preference: theme.js, tabs.js, banner.js.
//
// localStorage throws SecurityError rather than returning null when storage is
// blocked - a third-party iframe, Chrome's "block all cookies", some privacy
// modes. scripts/core.html concatenates all of js/core/*.js into one main.js,
// so a throw at the top level of any module aborts every module that sorts
// after it: an unguarded read in tabs.js took the theme toggle and the TOC
// scroll spy down with it. These wrappers keep the failure local to the
// feature that wanted to persist something.
//
// This file must keep a name that sorts before the modules that read storage
// at load time, because resources.Match returns them in that order and the
// bundle runs top to bottom - storage.js before tabs.js and theme.js.
// banner.js sorts earlier but only touches storage inside a click handler, so
// it resolves the global long after the bundle has finished. js/head/*.js is a
// separate bundle and guards its two accesses inline instead.
window.hextraStorage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // Blocked storage: the preference does not persist, and that is all.
    }
  },
};
