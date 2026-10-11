// Mock data for Performance analysis. All values are simulated.

export const PERIODS = [
  { id: "1h", label: "۱ ساعت", points: 12 },
  { id: "24h", label: "۲۴ ساعت", points: 24 },
  { id: "7d", label: "۷ روز", points: 28 },
  { id: "30d", label: "۳۰ روز", points: 30 },
];

export const REQUEST_TYPES = [
  { id: "all", label: "همه" },
  { id: "frontend", label: "Frontend" },
  { id: "admin", label: "Admin" },
  { id: "rest", label: "REST API" },
  { id: "cron", label: "Cron" },
];

export const KPIS = [
  { id: "ttfb", icon: "faBolt", tone: "primary", label: "میانگین TTFB", value: "438ms", trend: "-12ms", prev: "450ms", status: "success" },
  { id: "php", icon: "faCode", tone: "info", label: "PHP Time", value: "186ms", trend: "+4ms", prev: "182ms", status: "warning" },
  { id: "db", icon: "faDatabase", tone: "info", label: "Database Time", value: "92ms", trend: "-8ms", prev: "100ms", status: "success" },
  { id: "ext", icon: "faPlug", tone: "info", label: "External HTTP", value: "71ms", trend: "+15ms", prev: "56ms", status: "danger" },
  { id: "mem", icon: "faMemory", tone: "primary", label: "Peak Memory", value: "84MB", trend: "+2MB", prev: "82MB", status: "warning" },
  { id: "slow", icon: "faHourglassHalf", tone: "warning", label: "Slow Queries", value: "17", trend: "+3", prev: "14", status: "warning" },
  { id: "err", icon: "faTriangleExclamation", tone: "danger", label: "PHP Errors", value: "4", trend: "+1", prev: "3", status: "danger" },
];

function genChart(points, seed) {
  const labels = points <= 12
    ? Array.from({ length: points }, (_, i) => `${toFa(i * 5)}دق`)
    : points <= 24
    ? Array.from({ length: points }, (_, i) => `${toFa(String(i).padStart(2, "0"))}:۰۰`)
    : Array.from({ length: points }, (_, i) => `روز ${toFa(i + 1)}`);
  return labels.map((label, i) => {
    const base = 380 + Math.sin(i / 3 + seed) * 60;
    return {
      label,
      php: Math.round(160 + Math.sin(i / 2 + seed) * 25 + (Math.random() - 0.5) * 15),
      db: Math.round(85 + Math.cos(i / 3 + seed) * 20 + (Math.random() - 0.5) * 10),
      external: Math.round(60 + Math.sin(i / 4 + seed * 2) * 18 + (Math.random() - 0.5) * 12),
      other: Math.round(40 + (Math.random() - 0.5) * 20),
    };
  });
}

export const RESPONSE_CHART = {
  "1h": genChart(12, 1),
  "24h": genChart(24, 2),
  "7d": genChart(28, 3),
  "30d": genChart(30, 4),
};

const impactTone = { normal: "success", medium: "info", high: "warning", critical: "danger" };
const impactLabel = { normal: "عادی", medium: "متوسط", high: "زیاد", critical: "بحرانی" };

function mkPlugin(name, score, php, db, queries, http, hooks, errors, assets, status) {
  return {
    name, score, php, db, queries, http, hooks, errors, assets,
    status, tone: impactTone[status], statusLabel: impactLabel[status],
    version: "۳." + Math.floor(Math.random() * 9) + "." + Math.floor(Math.random() * 9),
    icon: name.charAt(0),
  };
}

export const PLUGINS = [
  mkPlugin("WooCommerce", 88, 64, 38, 142, 12, 89, 2, 18, "critical"),
  mkPlugin("Elementor", 74, 52, 14, 68, 4, 54, 1, 24, "high"),
  mkPlugin("Yoast SEO", 61, 28, 19, 51, 3, 32, 0, 9, "high"),
  mkPlugin("Contact Form 7", 47, 18, 8, 22, 2, 18, 1, 5, "medium"),
  mkPlugin("WP Rocket", 42, 14, 6, 18, 1, 24, 0, 7, "medium"),
  mkPlugin("Jetpack", 39, 16, 7, 24, 6, 28, 1, 12, "medium"),
  mkPlugin("Rank Math", 34, 12, 9, 19, 2, 16, 0, 6, "normal"),
  mkPlugin("Mailchimp", 28, 9, 4, 12, 5, 11, 0, 4, "normal"),
  mkPlugin("Wordfence", 25, 11, 5, 16, 3, 19, 0, 3, "normal"),
  mkPlugin("Akismet", 18, 6, 3, 9, 2, 8, 0, 2, "normal"),
];

export const PLUGIN_TABS = [
  { id: "overview", label: "نمای کلی" },
  { id: "database", label: "Database" },
  { id: "hooks", label: "Hooks" },
  { id: "http", label: "HTTP" },
  { id: "assets", label: "Assets" },
  { id: "errors", label: "Errors" },
  { id: "history", label: "History" },
];

export function pluginDetail(name) {
  const p = PLUGINS.find((x) => x.name === name) || PLUGINS[0];
  const days = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];
  return {
    overview: {
      score: p.score,
      execContribution: `${toFa(Math.round(p.php * 0.4))}ms`,
      phpTime: `${toFa(p.php)}ms`,
      dbContribution: `${toFa(p.db)}ms`,
      extContribution: `${toFa(p.http)}ms`,
      memImpact: `${toFa(8 + Math.floor(p.score / 10))}MB`,
      requestsSampled: toFa(1200 + p.score * 30),
      miniChart: days.map((d, i) => ({ d, score: Math.max(10, p.score + Math.round(Math.sin(i) * 8)) })),
    },
    database: {
      cards: [
        { label: "Queries", value: toFa(p.queries * 8) },
        { label: "Query Time", value: `${toFa(p.db)}ms` },
        { label: "Slow Queries", value: toFa(Math.floor(p.queries / 10)) },
        { label: "Duplicate Queries", value: toFa(Math.floor(p.queries / 6)) },
      ],
      rows: [
        { q: "SELECT * FROM wp_posts WHERE post_type = 'product'", dur: "12ms", occ: toFa(48), type: "SELECT", status: "slow" },
        { q: "UPDATE wp_options SET option_value = ... WHERE option_name = 'wc_cache'", dur: "8ms", occ: toFa(12), type: "UPDATE", status: "ok" },
        { q: "SELECT meta_value FROM wp_postmeta WHERE post_id IN (...)", dur: "24ms", occ: toFa(86), type: "SELECT", status: "slow" },
        { q: "INSERT INTO wp_actionscheduler_logs (...)", dur: "3ms", occ: toFa(34), type: "INSERT", status: "ok" },
        { q: "SELECT COUNT(*) FROM wp_woocommerce_order_items", dur: "15ms", occ: toFa(22), type: "SELECT", status: "dup" },
      ],
    },
    hooks: [
      { hook: "init", callback: `${name}_init`, dur: "4ms", occ: toFa(1), impact: "low" },
      { hook: "wp_loaded", callback: `${name}_loaded`, dur: "7ms", occ: toFa(1), impact: "medium" },
      { hook: "wp_enqueue_scripts", callback: `${name}_enqueue`, dur: "12ms", occ: toFa(1), impact: "medium" },
      { hook: "woocommerce_before_checkout", callback: `${name}_before_checkout`, dur: "18ms", occ: toFa(3), impact: "high" },
      { hook: "the_content", callback: `${name}_filter_content`, dur: "6ms", occ: toFa(14), impact: "medium" },
      { hook: "wp_head", callback: `${name}_head`, dur: "9ms", occ: toFa(1), impact: "low" },
    ],
    http: [
      { dest: "api.example.com", reqs: toFa(124), avg: "180ms", fails: toFa(2), last: "۲ دقیقه پیش" },
      { dest: "license.example.com", reqs: toFa(38), avg: "320ms", fails: toFa(5), last: "۱۵ دقیقه پیش" },
      { dest: "updates.example.com", reqs: toFa(12), avg: "240ms", fails: toFa(0), last: "۱ ساعت پیش" },
    ],
    assets: {
      cards: [
        { label: "JS Files", value: toFa(Math.floor(p.assets / 3)) },
        { label: "CSS Files", value: toFa(Math.floor(p.assets / 2)) },
        { label: "Total Size", value: `${toFa(p.assets * 14)}KB` },
        { label: "Requests", value: toFa(p.assets) },
      ],
      rows: [
        { file: `${name.toLowerCase()}.js`, type: "JS", size: "48KB", loc: "Header", blocking: "render-blocking" },
        { file: `${name.toLowerCase()}.css`, type: "CSS", size: "32KB", loc: "Header", blocking: "render-blocking" },
        { file: `${name.toLowerCase()}-admin.js`, type: "JS", size: "24KB", loc: "Footer", blocking: "deferred" },
        { file: `${name.toLowerCase()}-style.css`, type: "CSS", size: "18KB", loc: "Footer", blocking: "async" },
      ],
    },
    errors: {
      cards: [
        { label: "Fatal", value: toFa(p.errors > 2 ? 1 : 0), tone: "danger" },
        { label: "Warning", value: toFa(p.errors), tone: "warning" },
        { label: "Deprecated", value: toFa(Math.floor(p.errors / 2) + 1), tone: "info" },
        { label: "Notice", value: toFa(p.errors + 2), tone: "primary" },
      ],
      rows: [
        { err: "Undefined index: product_id", file: `${name}/includes/class-product.php`, line: toFa(142), occ: toFa(18), last: "۵ دقیقه پیش" },
        { err: "Deprecated: wp_enqueue_style", file: `${name}/class-assets.php`, line: toFa(67), occ: toFa(9), last: "۲۰ دقیقه پیش" },
        { err: "Warning: Cannot modify header", file: `${name}/class-output.php`, line: toFa(33), occ: toFa(4), last: "۱ ساعت پیش" },
      ],
    },
    history: {
      chart: days.map((d, i) => ({ d, score: Math.max(10, p.score + Math.round(Math.sin(i / 1.5) * 10)) })),
      changes: [
        { label: "بهبود یافته", value: toFa(3), tone: "success" },
        { label: "بدتر شده", value: toFa(1), tone: "danger" },
        { label: "پایدار", value: toFa(3), tone: "primary" },
      ],
    },
  };
}

export const PROFILING_PAGES = [
  { id: "home", label: "صفحه اصلی" },
  { id: "shop", label: "فروشگاه" },
  { id: "product", label: "صفحه محصول" },
  { id: "cart", label: "سبد خرید" },
  { id: "checkout", label: "تسویه حساب" },
  { id: "account", label: "حساب کاربری" },
  { id: "rest", label: "REST API" },
  { id: "admin", label: "Admin" },
  { id: "custom", label: "Custom URL" },
];

export const PROFILING_DURATIONS = [
  { id: "1r", label: "۱ درخواست" },
  { id: "5r", label: "۵ درخواست" },
  { id: "10r", label: "۱۰ درخواست" },
  { id: "30s", label: "۳۰ ثانیه" },
  { id: "60s", label: "۶۰ ثانیه" },
];

export const PROFILING_LIVE = [
  { page: "Homepage", ms: 420 },
  { page: "Shop", ms: 730 },
  { page: "Checkout", ms: 1400 },
  { page: "Product", ms: 510 },
  { page: "Account", ms: 380 },
];

function toFa(v) { return String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(+d)); }