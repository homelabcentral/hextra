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

    const { openClass = null, backdrop = null, ariaOnMobile = false } = options;
    // `ariaOnMobile` controls are links that only behave as a disclosure below
    // `md`; above it the panel they name is a permanently visible column and
    // activating them navigates. Their disclosure ARIA therefore cannot be
    // emitted at build time - it is added and removed here with the breakpoint.
    const ariaControls = control.dataset.drawerControls || panel.id || null;
    const ariaLabel = control.dataset.drawerLabel || null;
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
      // The control's own ARIA. A control that is only a disclosure below `md`
      // drops the whole set above it, so assistive tech announces a plain link
      // to the home page rather than a collapsed menu that will never open.
      syncControlAria() {
        if (ariaOnMobile && !mobileQuery.matches) {
          control.removeAttribute("aria-controls");
          control.removeAttribute("aria-expanded");
          control.removeAttribute("aria-label");
          return;
        }
        if (ariaOnMobile) {
          if (ariaControls) control.setAttribute("aria-controls", ariaControls);
          // Renames the control for what it actually does here: the site title
          // is the wrong name for a button that opens blog navigation.
          if (ariaLabel) control.setAttribute("aria-label", ariaLabel);
        }
        control.setAttribute("aria-expanded", open ? "true" : "false");
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
        const { focusOnOpen = true, restoreFocus = true } = options;

        // Only one panel at a time: both cover the viewport. The other drawer
        // closes without restoring focus to its own control - that control is
        // now behind a backdrop, and focus belongs with whatever opened this
        // one.
        if (!open) {
          drawers.forEach((other) => {
            if (other !== drawer && other.isOpen()) other.toggle({ restoreFocus: false });
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

        drawer.syncControlAria();
        drawers.forEach((entry) => entry.syncAriaHidden());

        // Move focus into the panel when opening, restore when closing
        if (open) {
          if (focusOnOpen) {
            const firstFocusable = panel.querySelector('a, button, input, [tabindex="0"]');
            if (firstFocusable) firstFocusable.focus();
          }
        } else if (restoreFocus) {
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

    // Dismiss on an in-page link, which scrolls behind the open panel.
    // Guarded on `isOpen`, like the backdrop above: `toggle()` on its own would
    // *open* a closed panel from a link inside it, which the rail can reach -
    // its links stay in the document while it is off-canvas.
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (link.getAttribute("href") && link.getAttribute("href").startsWith("#")) {
          // Only dismiss overlay on mobile view
          if (window.innerWidth < 768 && drawer.isOpen()) {
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
    ariaOnMobile: true,
  });

  if (drawers.length === 0) return;

  // Set initial state
  const syncAria = () =>
    drawers.forEach((drawer) => {
      drawer.syncAriaHidden();
      drawer.syncControlAria();
    });
  syncAria();

  // Crossing the breakpoint closes whatever is open before the ARIA is
  // re-synced. Both panels become ordinary layout above `md` - a column and a
  // navigation bar - so an open drawer has nothing left to close it: the
  // backdrop stays over the page, `<body>` keeps `overflow-hidden`, and the
  // hamburger keeps announcing itself expanded while it is `md:hidden`.
  // Focus is not restored, since the control it would go back to may itself
  // have just been hidden by the breakpoint.
  mobileQuery.addEventListener("change", () => {
    drawers.forEach((drawer) => {
      if (drawer.isOpen()) drawer.toggle({ restoreFocus: false });
    });
    syncAria();
  });

  // Close on Escape key (mobile only)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.getElementById("hextra-search-dialog")?.open) return;
    if (!mobileQuery.matches) return;
    const openDrawer = drawers.find((drawer) => drawer.isOpen());
    if (openDrawer) openDrawer.toggle();
  });
});
