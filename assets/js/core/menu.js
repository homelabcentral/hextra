// Mobile navigation drawers.
//
// Two of them, independent. The hamburger at the inline end drops the site
// navigation down from the top (`.hextra-sidebar-container`); on blog pages the
// site title slides the identity rail in from the inline start
// (`.hextra-blog-rail`), which is a sticky column from `md` up and has nowhere
// to go below it. Opening either closes the other, since both take the screen.

document.addEventListener("DOMContentLoaded", function () {
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const drawers = [];

  // `createDrawer` handles the two presentations through `openClass`: the
  // sidebar toggles the Tailwind transform utilities it has always used, the
  // rail toggles a single class that `blog.css` turns into the slide.
  function createDrawer(control, panel, options = {}) {
    if (!control || !panel) return null;

    const { openClass = null, backdrop = null } = options;
    // The hamburger animates its icon to an X - `navbar.css` keys that off
    // `svg.open` under `.hextra-hamburger-menu`. The site title has no such
    // icon, so open state is tracked here rather than read back off the SVG.
    const icon = control.classList.contains("hextra-hamburger-menu") ? control.querySelector("svg") : null;
    let open = false;
    let backdropTimer = null;

    const drawer = {
      control,
      panel,
      isOpen() {
        return open;
      },
      // On mobile the panel is off-screen, so hide it from assistive tech
      syncAriaHidden() {
        if (mobileQuery.matches) {
          panel.setAttribute("aria-hidden", open ? "false" : "true");
        } else {
          panel.removeAttribute("aria-hidden");
        }
      },
      toggle(options = {}) {
        const { focusOnOpen = true } = options;

        // Only one panel at a time: both cover the viewport.
        if (!open) {
          drawers.forEach((other) => {
            if (other !== drawer && other.isOpen()) other.toggle({ focusOnOpen: false });
          });
        }

        open = !open;
        if (icon) icon.classList.toggle("open", open);

        if (openClass) {
          panel.classList.toggle(openClass, open);
        } else {
          panel.classList.toggle("hx:max-md:[transform:translate3d(0,-100%,0)]", !open);
          panel.classList.toggle("hx:max-md:[transform:translate3d(0,0,0)]", open);
        }

        if (backdrop) {
          window.clearTimeout(backdropTimer);
          if (open) {
            backdrop.hidden = false;
            // Unhiding and adding the class in one frame gives the fade nothing
            // to animate from, so the class waits for the next one.
            requestAnimationFrame(() => backdrop.classList.add("hextra-blog-rail-backdrop--open"));
          } else {
            backdrop.classList.remove("hextra-blog-rail-backdrop--open");
            backdropTimer = window.setTimeout(() => {
              backdrop.hidden = true;
            }, 300);
          }
        }

        // While a panel is open, the page behind it must not scroll
        const anyOpen = drawers.some((entry) => entry.isOpen());
        document.body.classList.toggle("hx:overflow-hidden", anyOpen);
        document.body.classList.toggle("hx:md:overflow-auto", anyOpen);

        control.setAttribute("aria-expanded", open ? "true" : "false");
        drawers.forEach((entry) => entry.syncAriaHidden());

        // Move focus into the panel when opening, restore when closing
        if (open) {
          if (focusOnOpen) {
            const firstFocusable = panel.querySelector('a, button, input, [tabindex="0"]');
            if (firstFocusable) firstFocusable.focus();
          }
        } else {
          control.focus();
        }
      },
    };

    control.addEventListener("click", (e) => {
      // The site title is a real link to the home page and stays one from `md`
      // up, and if scripting never runs. Only the mobile toggle intercepts it.
      if (control.tagName === "A" && !mobileQuery.matches) return;

      e.preventDefault();
      // Pointer-initiated clicks on mobile should not force focus into the search input,
      // which opens the software keyboard immediately.
      drawer.toggle({ focusOnOpen: e.detail === 0 });
    });

    if (backdrop) {
      backdrop.addEventListener("click", () => {
        if (drawer.isOpen()) drawer.toggle();
      });
    }

    // Dismiss on an in-page link, which scrolls behind the open panel
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (link.getAttribute("href") && link.getAttribute("href").startsWith("#")) {
          // Only dismiss overlay on mobile view
          if (window.innerWidth < 768) {
            drawer.toggle();
          }
        }
      });
    });

    drawers.push(drawer);
    return drawer;
  }

  createDrawer(document.querySelector(".hextra-hamburger-menu"), document.querySelector(".hextra-sidebar-container"));
  createDrawer(document.querySelector(".hextra-blog-rail-toggle"), document.querySelector(".hextra-blog-rail"), {
    openClass: "hextra-blog-rail--open",
    backdrop: document.querySelector(".hextra-blog-rail-backdrop"),
  });

  if (drawers.length === 0) return;

  // Set initial state
  drawers.forEach((drawer) => drawer.syncAriaHidden());
  mobileQuery.addEventListener("change", () => drawers.forEach((drawer) => drawer.syncAriaHidden()));

  // Close on Escape key (mobile only)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.getElementById("hextra-search-dialog")?.open) return;
    if (!mobileQuery.matches) return;
    const openDrawer = drawers.find((drawer) => drawer.isOpen());
    if (openDrawer) openDrawer.toggle();
  });
});
