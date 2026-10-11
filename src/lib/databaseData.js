// Mock data for Database health & performance. All values are simulated.

function toFa(v) { return String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(+d)); }

export const KPIS = [
  { id: "size", icon: "faDatabase", tone: "primary", label: "حجم دیتابیس", value: "1.84 GB", status: "warning" },
  { id: "tables", icon: "faTable", tone: "info", label: "تعداد جداول", value: "126", status: "success" },
  { id: "autoload", icon: "faMemory", tone: "warning", label: "Autoload Size", value: "4.8 MB", status: "warning" },
  { id: "transients", icon: "faClock", tone: "warning", label: "Expired Transients", value: "384", status: "warning" },
  { id: "revisions", icon: "faCopy", tone: "info", label: "Revisions", value: "1,284", status: "warning" },
  { id: "slow", icon: "faHourglassHalf", tone: "danger", label: "Slow Queries", value: "17", status: "danger" },
  { id: "orphan", icon: "faGhost", tone: "warning", label: "Orphan Data", value: "328", status: "warning" },
];

export const HEALTH_SCORE = { score: 81, status: "نیازمند بررسی", tone: "warning", recommendations: 6 };

const tblTone = { ok: "success", warn: "warning", crit: "danger" };
const tblLabel = { ok: "سالم", warn: "هشدار", crit: "بحرانی" };

export const TABLES = [
  { name: "wp_posts", rows: "48,290", data: "612MB", index: "84MB", total: "696MB", status: "warn" },
  { name: "wp_postmeta", rows: "318,740", data: "428MB", index: "56MB", total: "484MB", status: "crit" },
  { name: "wp_options", rows: "1,820", data: "4.8MB", index: "1.2MB", total: "6MB", status: "warn" },
  { name: "wp_woocommerce_order_itemmeta", rows: "92,100", data: "184MB", index: "24MB", total: "208MB", status: "warn" },
  { name: "wp_actionscheduler_logs", rows: "148,300", data: "96MB", index: "12MB", total: "108MB", status: "crit" },
  { name: "wp_comments", rows: "12,400", data: "38MB", index: "8MB", total: "46MB", status: "ok" },
  { name: "wp_users", rows: "3,210", data: "4MB", index: "2MB", total: "6MB", status: "ok" },
  { name: "wp_termmeta", rows: "8,600", data: "6MB", index: "1MB", total: "7MB", status: "ok" },
].map((t) => ({ ...t, tone: tblTone[t.status], statusLabel: tblLabel[t.status] }));

export const AUTOLOAD = {
  current: "4.8 MB",
  recommended: "کمتر از ۱ MB",
  status: "هشدار",
  progress: 78,
  options: [
    { name: "woocommerce_settings", size: "1.2MB", source: "WooCommerce", autoload: "بله", status: "crit" },
    { name: "theme_options", size: "840KB", source: "Theme", autoload: "بله", status: "warn" },
    { name: "plugin_cache_data", size: "620KB", source: "Plugin", autoload: "بله", status: "warn" },
    { name: "site_transient", size: "480KB", source: "WordPress", autoload: "بله", status: "warn" },
    { name: "wpseo_options", size: "380KB", source: "Yoast SEO", autoload: "بله", status: "ok" },
    { name: "widget_options", size: "240KB", source: "WordPress", autoload: "بله", status: "ok" },
    { name: "rewrite_rules", size: "180KB", source: "WordPress", autoload: "بله", status: "ok" },
  ].map((o) => ({ ...o, tone: tblTone[o.status] })),
};

const sevTone = { ok: "success", low: "info", warn: "warning", crit: "danger" };
const sevLabel = { ok: "عادی", low: "کم", warn: "هشدار", crit: "بحرانی" };

export const DIAGNOSTICS = [
  { id: "transients", label: "Expired Transients", count: "384", size: "12MB", sev: "warn", detail: "ترانزنت‌های منقضی‌شده که فضای دیتابیس اشغال می‌کنند." },
  { id: "postmeta", label: "Orphaned Post Meta", count: "186", size: "8MB", sev: "warn", detail: "متاداده‌های مرتبط با پست‌های حذف‌شده." },
  { id: "usermeta", label: "Orphaned User Meta", count: "42", size: "1MB", sev: "low", detail: "متاداده‌های کاربران حذف‌شده." },
  { id: "termmeta", label: "Orphaned Term Meta", count: "28", size: "0.5MB", sev: "low", detail: "متاداده‌های ترم‌های حذف‌شده." },
  { id: "revisions", label: "Revisions", count: "1,284", size: "84MB", sev: "warn", detail: "بازنگری‌های اضافی پست‌ها." },
  { id: "autodrafts", label: "Auto Drafts", count: "96", size: "6MB", sev: "low", detail: "پیش‌نویس‌های خودکار ذخیره‌شده." },
  { id: "spam", label: "Spam Comments", count: "312", size: "4MB", sev: "warn", detail: "کامنت‌های علامت‌گذاری‌شده به‌عنوان اسپم." },
  { id: "trash", label: "Trash Comments", count: "48", size: "1MB", sev: "low", detail: "کامنت‌های در سطل زباله." },
  { id: "options", label: "Unused Options", count: "328", size: "18MB", sev: "crit", detail: "گزینه‌های افزونه‌های حذف‌شده که باقی مانده‌اند." },
].map((d) => ({ ...d, tone: sevTone[d.sev], statusLabel: sevLabel[d.sev] }));

export const SLOW_QUERIES = [
  { id: 1, q: "SELECT * FROM wp_postmeta WHERE meta_key = '_wc...' AND meta_value LIKE '%...%'", source: "WooCommerce", dur: "1.2s", occ: toFa(48), last: "۵ دقیقه پیش", page: "/shop/", tone: "danger" },
  { id: 2, q: "SELECT p.* FROM wp_posts p WHERE p.post_type = 'product' AND p.post_status = 'publish' ORDER BY p.post_date DESC", source: "WooCommerce", dur: "840ms", occ: toFa(32), last: "۱۲ دقیقه پیش", page: "/shop/", tone: "danger" },
  { id: 3, q: "SELECT option_name, option_value FROM wp_options WHERE autoload = 'yes'", source: "WordPress Core", dur: "320ms", occ: toFa(184), last: "۱ دقیقه پیش", page: "همه صفحات", tone: "warning" },
  { id: 4, q: "SELECT COUNT(*) FROM wp_actionscheduler_actions WHERE status = 'pending'", source: "Plugin", dur: "280ms", occ: toFa(64), last: "۳ دقیقه پیش", page: "wp-cron.php", tone: "warning" },
  { id: 5, q: "SELECT * FROM wp_comments WHERE comment_post_ID IN (...) AND comment_approved = '1'", source: "Theme", dur: "240ms", occ: toFa(22), last: "۸ دقیقه پیش", page: "/blog/", tone: "warning" },
  { id: 6, q: "UPDATE wp_options SET option_value = '...' WHERE option_name = '_site_transient_timeout'", source: "WordPress Core", dur: "180ms", occ: toFa(96), last: "۲ دقیقه پیش", page: "wp-cron.php", tone: "warning" },
];

export function slowQueryDetail(id) {
  const q = SLOW_QUERIES.find((x) => x.id === id) || SLOW_QUERIES[0];
  return {
    ...q,
    fullQuery: q.q + " LIMIT 100 OFFSET 0 /* mock full query */",
    callSource: `do_action('wp_loaded') → ${q.source}::get_data()`,
    affectedPage: q.page,
  };
}

const days = Array.from({ length: 14 }, (_, i) => `روز ${toFa(i + 1)}`);
export const CHARTS = {
  size: days.map((d, i) => ({ d, mb: Math.round(1800 + i * 3 + Math.sin(i) * 8) })),
  queryTime: days.map((d, i) => ({ d, ms: Math.round(90 + Math.sin(i / 2) * 25 + (Math.random() - 0.5) * 15) })),
  autoload: days.map((d, i) => ({ d, mb: +(4.2 + i * 0.05 + Math.sin(i / 3) * 0.2).toFixed(1) })),
};