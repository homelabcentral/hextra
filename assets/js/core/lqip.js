// Low-quality image placeholders.
//
// `utils/page-image.html` inlines a 16px-wide copy of a cover as
// `--hextra-lqip`, and the stylesheets paint it as the image's own
// background so the real pixels cover it as they arrive. They only cover it
// where the image is opaque: a screenshot with rounded corners, a drop shadow
// or any alpha channel keeps the blurred stand-in showing around its edges
// long after it has loaded. Nothing in CSS can tell "still loading" from
// "loaded and transparent", so the property is removed once the image is in.
//
// A failed image keeps its placeholder - a blur is a better broken state than
// an empty box.

function clearPlaceholder(target) {
  if (target instanceof HTMLImageElement && target.style.getPropertyValue("--hextra-lqip")) {
    target.style.removeProperty("--hextra-lqip");
  }
}

// Capture phase: `load` does not bubble, and a lazy image fires it whenever it
// scrolls into view, long after this listener is attached.
document.addEventListener("load", (e) => clearPlaceholder(e.target), true);

document.addEventListener("DOMContentLoaded", function () {
  // This script is deferred, so an image served from cache can already be
  // complete and will never fire `load` for the listener above.
  document.querySelectorAll("img[style*='--hextra-lqip']").forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      clearPlaceholder(img);
    }
  });
});
