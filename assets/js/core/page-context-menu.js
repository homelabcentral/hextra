document.addEventListener("DOMContentLoaded", () => {
  // Pre-fetch markdown content for all copy buttons to avoid Safari NotAllowedError
  // Safari requires clipboard writes to happen synchronously within user gesture
  const copyButtons = document.querySelectorAll(".hextra-page-context-menu-copy");
  const contentCache = new Map();

  // Pre-fetch content for each button on page load
  copyButtons.forEach((button) => {
    const url = button.dataset.url;
    if (url) {
      fetch(url)
        .then((response) => {
          if (response.ok) return response.text();
          throw new Error("Failed to fetch");
        })
        .then((markdown) => contentCache.set(url, markdown))
        .catch((error) => console.error("Failed to pre-fetch markdown:", error));
    }
  });

  // Initialize copy buttons with synchronous clipboard access
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.dataset.url;
      const markdown = contentCache.get(url);

      if (markdown) {
        // Synchronous clipboard write initiation - works in Safari
        navigator.clipboard
          .writeText(markdown)
          .then(() => {
            button.classList.add("copied");
            setTimeout(() => button.classList.remove("copied"), 1000);
          })
          .catch((error) => console.error("Failed to copy markdown:", error));
      } else {
        // Fallback: fetch and copy (may fail in Safari if content not pre-fetched)
        fetch(url)
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch");
            return response.text();
          })
          .then((text) => {
            contentCache.set(url, text);
            return navigator.clipboard.writeText(text);
          })
          .then(() => {
            button.classList.add("copied");
            setTimeout(() => button.classList.remove("copied"), 1000);
          })
          .catch((error) => console.error("Failed to copy markdown:", error));
      }
    });
  });

  // Dropdown open/close plus keyboard navigation. This is a role="menu"
  // widget, so a screen reader switches to application mode on entry and hands
  // the arrow keys to the widget rather than scrolling the page - a menu that
  // ignores them strands anything below the fold of its own scroll container.
  // The behaviour mirrors assets/js/core/nav-menu.js so the theme's menus are
  // consistent.
  const hiddenClass = "hx:hidden";
  const dropdownToggles = document.querySelectorAll(".hextra-page-context-menu-toggle");

  const closeDropdown = (container, focusToggle = false) => {
    if (!container) return;

    const toggle = container.querySelector(".hextra-page-context-menu-toggle");
    const menu = container.querySelector(".hextra-page-context-menu-dropdown");

    if (!toggle || !menu) return;

    const chevron = toggle.querySelector("[data-chevron]");
    toggle.dataset.state = "closed";
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.add(hiddenClass);
    if (chevron) {
      chevron.style.transform = "";
    }
    if (focusToggle) {
      toggle.focus();
    }
  };

  const openDropdown = (toggle, focusTarget = "none") => {
    const container = toggle.closest(".hextra-page-context-menu");
    const menu = container && container.querySelector(".hextra-page-context-menu-dropdown");

    if (!menu) return;

    // Close all other dropdowns first.
    dropdownToggles.forEach((other) => {
      if (other !== toggle) {
        closeDropdown(other.closest(".hextra-page-context-menu"));
      }
    });

    const chevron = toggle.querySelector("[data-chevron]");
    toggle.dataset.state = "open";
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.remove(hiddenClass);
    if (chevron) {
      chevron.style.transform = "rotate(180deg)";
    }

    if (focusTarget !== "none") {
      const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
      if (items.length > 0) {
        const target = focusTarget === "last" ? items[items.length - 1] : items[0];
        target.focus();
      }
    }
  };

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = toggle.closest(".hextra-page-context-menu");
      if (toggle.dataset.state === "open") {
        closeDropdown(container);
      } else {
        openDropdown(toggle);
      }
    });

    toggle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openDropdown(toggle, "first");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        openDropdown(toggle, "last");
      }
    });
  });

  document.querySelectorAll(".hextra-page-context-menu-dropdown[role=menu]").forEach((menu) => {
    menu.addEventListener("keydown", (e) => {
      const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
      if (items.length === 0) return;

      // -1 when focus is inside the menu but not on a row. Not the toggle:
      // that is a DOM sibling of this <ul>, so its keydown never bubbles here
      // and it has its own handler. The case that does reach this listener is
      // the panel itself holding focus - it is a scroll container
      // (`overflow-auto` under a `max-h-80`), and Firefox makes those
      // keyboard-focusable. Hence the explicit -1 arms rather than a plain
      // modulo: ArrowDown from the panel goes to the first row, ArrowUp to the
      // last.
      const currentIndex = items.indexOf(document.activeElement);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          items[currentIndex === -1 ? 0 : (currentIndex + 1) % items.length].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          items[currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length].focus();
          break;
        case "Home":
          e.preventDefault();
          items[0].focus();
          break;
        case "End":
          e.preventDefault();
          items[items.length - 1].focus();
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown(menu.closest(".hextra-page-context-menu"), true);
          break;
        case " ":
          // An ARIA role does not change native key handling. The two built-in
          // rows are <button role="menuitem">, which browsers activate on both
          // Enter and Space; the custom links are <a role="menuitem">, which
          // activate on Enter only - Space scrolls the page behind the open
          // menu instead. So Space worked on the rows above a link row and did
          // nothing on the link row itself, in one widget. WCAG 2.1.1.
          //
          // Only the anchors need the handler; forwarding Space for the
          // buttons would double-fire against the browser's own default.
          if (currentIndex !== -1 && items[currentIndex].tagName === "A") {
            e.preventDefault();
            items[currentIndex].click();
          }
          break;
        case "Tab":
          // Deliberately no preventDefault: Tab has to keep moving, it is the
          // documented way out of a menu. Closing first and focusing the
          // toggle makes sequential navigation resume from the menu button,
          // so Tab lands on whatever follows the widget and Shift+Tab on
          // whatever precedes it. Without this the panel stayed open,
          // aria-expanded stayed "true", and the menu floated over the
          // content Tab had moved to.
          closeDropdown(menu.closest(".hextra-page-context-menu"), true);
          break;
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    // Check if click is outside any dropdown container
    const isOutside = !e.target.closest(".hextra-page-context-menu");
    if (isOutside) {
      dropdownToggles.forEach((toggle) => {
        closeDropdown(toggle.closest(".hextra-page-context-menu"));
      });
    }
  });

  // Close dropdown on Escape key and return focus to toggle
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownToggles.forEach((toggle) => {
        if (toggle.dataset.state === "open") {
          closeDropdown(toggle.closest(".hextra-page-context-menu"), true);
        }
      });
    }
  });

  // Handle dropdown menu copy action
  document.querySelectorAll('.hextra-page-context-menu-dropdown button[data-action="copy"]').forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const container = btn.closest(".hextra-page-context-menu");
      if (!container) return;

      const copyBtn = container.querySelector(".hextra-page-context-menu-copy");
      if (!copyBtn) return;

      // focusToggle, same as the Escape paths: closeDropdown sets display:none
      // on a menu that still holds focus, and the HTML focus-fixup algorithm
      // then resets document.activeElement to <body>. copyBtn.click() does not
      // move focus either, so without this a keyboard user lands nowhere and
      // the next Tab restarts from the top of the document.
      closeDropdown(container, true);
      copyBtn.click();
    });
  });

  // Handle dropdown menu view action
  document.querySelectorAll('.hextra-page-context-menu-dropdown button[data-action="view"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = btn.closest(".hextra-page-context-menu");
      if (!container) return;

      const url = btn.dataset.url;
      if (!url) return;

      closeDropdown(container, true);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  // Custom links from site.Params.page.contextMenu.links render as
  // <a role="menuitem"> with no data-action, so neither handler above matches
  // them, and the outside-click guard treats a click inside the menu as inside
  // by definition. Without this they were the one menuitem kind that left the
  // menu open: an external link opened its new tab and the original tab kept
  // data-state="open", aria-expanded="true", the panel visible and the chevron
  // rotated until the user clicked elsewhere or pressed Escape.
  //
  // No preventDefault - the link still navigates. An internal link unloads the
  // page and the close is moot; an external one leaves a tidy tab behind.
  document.querySelectorAll('.hextra-page-context-menu-dropdown a[role="menuitem"]').forEach((link) => {
    link.addEventListener("click", () => {
      closeDropdown(link.closest(".hextra-page-context-menu"), true);
    });
  });
});
