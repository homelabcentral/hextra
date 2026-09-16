// The section must not be in the banner.js (body) file because it can create a quick flash.

// {{- if site.Params.banner }}
// Guarded for the same reason as theme.js in this bundle: a SecurityError from
// blocked storage would abort the whole head script.
let bannerClosed = null;
try {
  bannerClosed = localStorage.getItem("{{ site.Params.banner.key | default `banner-closed` }}");
} catch (err) {
  // Blocked storage: show the banner, which is what a first visit does anyway.
}

if (bannerClosed) {
  document.documentElement.style.setProperty("--hextra-banner-height", "0px");
  document.documentElement.classList.add("hextra-banner-hidden");
  document.documentElement.dataset.hextraBanner = "hidden";
} else {
  document.documentElement.dataset.hextraBanner = "visible";
}
// {{- end }}
