(() => {
  const cfg = {"baidu":"","ga4":"G-83DKFE85FQ","umamiSrc":"","umamiId":"","leadTarget":"https://www.1bgp.com/"};
  const load = (src, attrs = {}) => {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
  };

  if (cfg.baidu) {
    window._hmt = window._hmt || [];
    load("https://hm.baidu.com/hm.js?" + cfg.baidu);
  }
  if (cfg.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", cfg.ga4);
    load("https://www.googletagmanager.com/gtag/js?id=" + cfg.ga4);
  }
  if (cfg.umamiSrc && cfg.umamiId) {
    load(cfg.umamiSrc, { "data-website-id": cfg.umamiId, defer: "" });
  }

  // Count clicks that leave the site: lead clicks (to the lead target) separately from other outbound links.
  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[href]");
    if (!link || link.host === location.host) return;
    const isLead = cfg.leadTarget && link.href.startsWith(cfg.leadTarget);
    const name = isLead ? "lead_click" : "outbound_click";
    const label = (link.textContent || "").trim().slice(0, 60) + " | " + location.pathname;
    if (cfg.baidu && window._hmt) window._hmt.push(["_trackEvent", name, link.href, label]);
    if (cfg.ga4 && window.gtag) window.gtag("event", name, { link_url: link.href, link_text: label, transport_type: "beacon" });
    if (window.umami && window.umami.track) window.umami.track(name, { url: link.href, page: location.pathname });
  }, { capture: true });
})();
