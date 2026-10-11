// Mock data for Page Monitor, Critical URLs, and Uptime. All values are simulated.

function toFa(v) { return String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(+d)); }

export const PAGE_KPIS = [
  { id: "total", icon: "faLink", tone: "primary", label: "کل URL ها", value: "500", status: "success" },
  { id: "healthy", icon: "faCircleCheck", tone: "success", label: "سالم", value: "492", status: "success" },
  { id: "redirect", icon: "faShare", tone: "info", label: "Redirect", value: "3", status: "info" },
  { id: "4xx", icon: "faCircleExclamation", tone: "warning", label: "4xx", value: "3", status: "warning" },
  { id: "5xx", icon: "faCircleXmark", tone: "danger", label: "5xx", value: "2", status: "danger" },
  { id: "timeout", icon: "faClock", tone: "danger", label: "Timeout", value: "1", status: "danger" },
  { id: "avg", icon: "faGaugeHigh", tone: "primary", label: "Average Response", value: "482ms", status: "success" },
];

const httpTone = { 200: "success", 301: "info", 302: "info", 401: "warning", 403: "warning", 404: "warning", 429: "warning", 500: "danger", 502: "danger", 503: "danger", 504: "danger", 0: "danger" };

export const PAGES = [
  { url: "/", type: "Page", status: 200, ms: 380, redirect: "—", last: "۱ دقیقه پیش", monitoring: true },
  { url: "/shop/", type: "Page", status: 200, ms: 630, redirect: "—", last: "۱ دقیقه پیش", monitoring: true },
  { url: "/product/example/", type: "Product", status: 200, ms: 710, redirect: "—", last: "۲ دقیقه پیش", monitoring: true },
  { url: "/contact/", type: "Page", status: 503, ms: 1800, redirect: "—", last: "۳۰ ثانیه پیش", monitoring: true },
  { url: "/account/", type: "Page", status: 403, ms: 240, redirect: "—", last: "۱ دقیقه پیش", monitoring: true },
  { url: "/old-page/", type: "Page", status: 404, ms: 330, redirect: "—", last: "۵ دقیقه پیش", monitoring: true },
  { url: "/blog/", type: "Page", status: 200, ms: 420, redirect: "—", last: "۲ دقیقه پیش", monitoring: true },
  { url: "/blog/sample-post/", type: "Post", status: 200, ms: 390, redirect: "—", last: "۳ دقیقه پیش", monitoring: true },
  { url: "/category/news/", type: "Category", status: 200, ms: 450, redirect: "—", last: "۴ دقیقه پیش", monitoring: true },
  { url: "/wp-json/", type: "API", status: 200, ms: 120, redirect: "—", last: "۱ دقیقه پیش", monitoring: true },
  { url: "/wp-json/wp/v2/posts", type: "API", status: 200, ms: 180, redirect: "—", last: "۱ دقیقه پیش", monitoring: true },
  { url: "/checkout/", type: "Page", status: 200, ms: 890, redirect: "—", last: "۲ دقیقه پیش", monitoring: true },
  { url: "/cart/", type: "Page", status: 200, ms: 340, redirect: "—", last: "۲ دقیقه پیش", monitoring: true },
  { url: "/moved-page/", type: "Page", status: 301, ms: 90, redirect: "/new-page/", last: "۱۰ دقیقه پیش", monitoring: true },
  { url: "/wp-admin/", type: "System", status: 401, ms: 210, redirect: "—", last: "۵ دقیقه پیش", monitoring: true },
  { url: "/xmlrpc.php", type: "System", status: 405, ms: 150, redirect: "—", last: "۵ دقیقه پیش", monitoring: false },
  { url: "/slow-endpoint/", type: "API", status: 504, ms: 30000, redirect: "—", last: "۸ دقیقه پیش", monitoring: true },
  { url: "/custom-landing/", type: "Custom", status: 200, ms: 520, redirect: "—", last: "۳ دقیقه پیش", monitoring: true },
];

export function pageDetail(url) {
  const p = PAGES.find((x) => x.url === url) || PAGES[0];
  const checks = Array.from({ length: 20 }, (_, i) => ({
    time: `${toFa(i * 3)} دقیقه پیش`,
    status: i === 7 || i === 14 ? (p.status >= 500 ? 503 : 404) : 200,
    ms: Math.round(p.ms + (Math.random() - 0.5) * 200),
  }));
  return {
    ...p,
    breakdown: {
      dns: Math.round(20 + Math.random() * 30),
      conn: Math.round(40 + Math.random() * 40),
      ssl: Math.round(30 + Math.random() * 30),
      ttfb: Math.round(p.ms * 0.5),
      download: Math.round(p.ms * 0.3),
      total: p.ms,
    },
    pageSize: `${toFa(120 + Math.floor(Math.random() * 80))}KB`,
    redirectCount: p.status === 301 ? 1 : 0,
    ssl: p.status === 0 ? "خطا" : "فعال",
    checks,
    redirectChain: p.status === 301
      ? [{ from: p.url, to: p.redirect, status: 301 }]
      : [{ from: p.url, to: p.url, status: p.status }],
  };
}

export const PAGE_FILTERS = [
  { id: "all", label: "همه" },
  { id: "200", label: "200" },
  { id: "3xx", label: "3xx" },
  { id: "401", label: "401" },
  { id: "403", label: "403" },
  { id: "404", label: "404" },
  { id: "429", label: "429" },
  { id: "500", label: "500" },
  { id: "502", label: "502" },
  { id: "503", label: "503" },
  { id: "504", label: "504" },
  { id: "timeout", label: "Timeout" },
];

export const PAGE_TYPES = [
  { id: "all", label: "همه انواع" },
  { id: "Page", label: "Page" },
  { id: "Post", label: "Post" },
  { id: "Product", label: "Product" },
  { id: "Category", label: "Category" },
  { id: "API", label: "API" },
  { id: "System", label: "System" },
  { id: "Custom", label: "Custom" },
];

export const RESPONSE_FILTERS = [
  { id: "all", label: "همه سرعت‌ها" },
  { id: "fast", label: "Fast" },
  { id: "normal", label: "Normal" },
  { id: "slow", label: "Slow" },
  { id: "vslow", label: "Very Slow" },
];

export { httpTone };

export const CRITICAL_URLS = [
  { id: 1, name: "صفحه اصلی", url: "/", type: "Page", expected: 200, interval: 60, timeout: 10, threshold: 3, sms: true, dashboard: true, monitoring: true, status: 200, ms: 380 },
  { id: 2, name: "فروشگاه", url: "/shop/", type: "Page", expected: 200, interval: 60, timeout: 10, threshold: 3, sms: true, dashboard: true, monitoring: true, status: 200, ms: 630 },
  { id: 3, name: "سبد خرید", url: "/cart/", type: "Page", expected: 200, interval: 120, timeout: 15, threshold: 2, sms: false, dashboard: true, monitoring: true, status: 200, ms: 340 },
  { id: 4, name: "تسویه حساب", url: "/checkout/", type: "Page", expected: 200, interval: 60, timeout: 10, threshold: 2, sms: true, dashboard: true, monitoring: true, status: 200, ms: 890 },
  { id: 5, name: "حساب کاربری", url: "/account/", type: "Page", expected: 200, interval: 300, timeout: 15, threshold: 3, sms: false, dashboard: true, monitoring: true, status: 403, ms: 240 },
  { id: 6, name: "REST API", url: "/wp-json/", type: "API", expected: 200, interval: 60, timeout: 5, threshold: 3, sms: true, dashboard: true, monitoring: true, status: 200, ms: 120 },
  { id: 7, name: "wp-cron.php", url: "/wp-cron.php", type: "System", expected: 200, interval: 300, timeout: 30, threshold: 2, sms: false, dashboard: true, monitoring: true, status: 200, ms: 90 },
];

export const UPTIME = {
  cards: [
    { label: "Uptime 24h", value: "99.98%", tone: "success" },
    { label: "Uptime 7d", value: "99.95%", tone: "success" },
    { label: "Uptime 30d", value: "99.88%", tone: "warning" },
    { label: "Uptime 90d", value: "99.82%", tone: "warning" },
  ],
  downtime: "8m 34s",
  incidents: toFa(2),
  timeline: Array.from({ length: 90 }, (_, i) => {
    const r = Math.random();
    if (i === 42 || i === 43) return "down";
    if (r < 0.05) return "warn";
    return "up";
  }),
  incidentsList: [
    { started: "۲ روز پیش ۱۴:۲۰", ended: "۲ روز پیش ۱۴:۲۸", dur: "8m 34s", http: 503, url: "/contact/", status: "resolved", tone: "success" },
    { started: "۵ روز پیش ۰۹:۱۵", ended: "۵ روز پیش ۰۹:۱۸", dur: "3m 12s", http: 502, url: "/shop/", status: "resolved", tone: "success" },
  ],
};