// Copy-link button in the blog share row.

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".hextra-blog-share-copy").forEach(function (button) {
    // Captured once: re-reading it on click would pick up the copied label
    // when the button is pressed again before the timeout fires.
    const originalLabel = button.getAttribute("aria-label");
    const copiedLabel = button.dataset.copiedLabel || "Copied!";
    let resetTimer;

    button.addEventListener("click", function () {
      // The address the reader is actually on, not the build-time permalink,
      // which is only correct when the site was built with its real baseURL.
      // Origin and path only, so tracking parameters and heading anchors
      // picked up on the way in are not passed along.
      const url = window.location.origin + window.location.pathname;

      navigator.clipboard
        .writeText(url)
        .then(function () {
          button.classList.add("copied");
          button.setAttribute("aria-label", copiedLabel);
          button.setAttribute("title", copiedLabel);

          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            button.classList.remove("copied");
            button.setAttribute("aria-label", originalLabel);
            button.setAttribute("title", originalLabel);
          }, 1000);
        })
        .catch(function (err) {
          console.error("Failed to copy link: ", err);
        });
    });
  });
});
