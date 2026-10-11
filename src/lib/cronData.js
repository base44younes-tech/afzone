// Mock data for Cron & Tasks monitoring. All values are simulated.

function toFa(v) { return String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(+d)); }

export const KPIS = [
  { id: "total", icon: "faListCheck", tone: "primary", label: "کل وظایف", value: "184", status: "success" },
  { id: "pending", icon: "faClock", tone: "info", label: "در انتظار", value: "41", status: "info" },
  { id: "overdue", icon: "faTriangleExclamation", tone: "warning", label: "Overdue", value: "7", status: "warning" },
  { id: "failed", icon: "faCircleXmark", tone: "danger", label: "Failed", value: "3", status: "danger" },
  { id: "long", icon: "faHourglassHalf", tone: "warning", label: "Long Running", value: "5", status: "warning" },
  { id: "next", icon: "faForward", tone: "primary", label: "Next Run", value: "42 sec", status: "success" },
];

const stTone = { healthy: "success", pending: "info", overdue: "warning", failed: "danger", long: "warning" };
const stLabel = { healthy: "سالم", pending: "در انتظار", overdue: "دیرکرد", failed: "خطا", long: "طولانی" };

export const TASKS = [
  { hook: "wp_version_check", source: "WordPress", schedule: "twicedaily", next: "۲ ساعت", last: "۱۰ ساعت پیش", dur: "1.2s", status: "healthy" },
  { hook: "woocommerce_cleanup_sessions", source: "WooCommerce", schedule: "daily", next: "۸ ساعت", last: "۱۶ ساعت پیش", dur: "0.8s", status: "healthy" },
  { hook: "action_scheduler_run_queue", source: "Plugin", schedule: "every_minute", next: "42 ثانیه", last: "۱۸ ثانیه پیش", dur: "3.4s", status: "long" },
  { hook: "yguard_scan_event", source: "YGuard", schedule: "twicedaily", next: "۵ ساعت", last: "۷ ساعت پیش", dur: "12.4s", status: "healthy" },
  { hook: "plugin_daily_sync", source: "Plugin", schedule: "daily", next: "۲ ساعت", last: "۲۲ ساعت پیش", dur: "0.4s", status: "healthy" },
  { hook: "wp_scheduled_delete", source: "WordPress", schedule: "daily", next: "۳ ساعت", last: "۲۱ ساعت پیش", dur: "0.2s", status: "healthy" },
  { hook: "wp_update_plugins", source: "WordPress", schedule: "twicedaily", next: "۱ ساعت", last: "۱۱ ساعت پیش", dur: "2.1s", status: "overdue" },
  { hook: "wp_update_themes", source: "WordPress", schedule: "twicedaily", next: "۱ ساعت", last: "۱۱ ساعت پیش", dur: "1.8s", status: "overdue" },
  { hook: "woocommerce_scheduled_sales", source: "WooCommerce", schedule: "daily", next: "۶ ساعت", last: "۱۸ ساعت پیش", dur: "0.6s", status: "healthy" },
  { hook: "wp_site_health_scheduled_check", source: "WordPress", schedule: "weekly", next: "۳ روز", last: "۴ روز پیش", dur: "4.2s", status: "failed" },
  { hook: "yguard_report_weekly", source: "YGuard", schedule: "weekly", next: "۲ روز", last: "۵ روز پیش", dur: "1.1s", status: "healthy" },
  { hook: "recovery_mode_clean_expired_keys", source: "WordPress", schedule: "daily", next: "۹ ساعت", last: "۱۵ ساعت پیش", dur: "0.1s", status: "failed" },
].map((t) => ({ ...t, tone: stTone[t.status], statusLabel: stLabel[t.status] }));

export const FILTERS = [
  { id: "all", label: "همه" },
  { id: "healthy", label: "سالم" },
  { id: "overdue", label: "Overdue" },
  { id: "failed", label: "Failed" },
  { id: "long", label: "Long Running" },
];

export const SOURCE_FILTERS = [
  { id: "all", label: "همه منابع" },
  { id: "WordPress", label: "WordPress" },
  { id: "Plugin", label: "Plugin" },
  { id: "WooCommerce", label: "WooCommerce" },
  { id: "YGuard", label: "YGuard" },
];

export function cronDetail(hook) {
  const t = TASKS.find((x) => x.hook === hook) || TASKS[0];
  const history = Array.from({ length: 8 }, (_, i) => ({
    time: `${toFa(i * 6)} ساعت پیش`,
    dur: `${(Math.random() * 4 + 0.2).toFixed(1)}s`,
    status: i === 3 || i === 6 ? "failed" : "healthy",
  }));
  return {
    ...t,
    args: "$arg = array(); $hook = '" + t.hook + "'",
    avgDur: `${(Math.random() * 3 + 0.5).toFixed(1)}s`,
    failCount: t.status === "failed" ? toFa(3) : toFa(0),
    history,
  };
}

export const WOO_ACTIONS = {
  cards: [
    { label: "Pending", value: toFa(41), tone: "info" },
    { label: "Complete", value: toFa(1284), tone: "success" },
    { label: "Failed", value: toFa(3), tone: "danger" },
    { label: "Overdue", value: toFa(7), tone: "warning" },
  ],
  rows: [
    { hook: "woocommerce_run_action", group: "async-pending", status: "pending", date: "۲ دقیقه پیش", attempts: toFa(0), dur: "—" },
    { hook: "woocommerce_scheduled_sales", group: "daily", status: "complete", date: "۱۸ ساعت پیش", attempts: toFa(1), dur: "0.6s" },
    { hook: "woocommerce_cleanup_sessions", group: "maintenance", status: "complete", date: "۱۶ ساعت پیش", attempts: toFa(1), dur: "0.8s" },
    { hook: "woocommerce_generate_cart_fragments", group: "async", status: "failed", date: "۳۰ دقیقه پیش", attempts: toFa(3), dur: "5.2s" },
    { hook: "woocommerce_send_transactional_email", group: "email", status: "pending", date: "۱ دقیقه پیش", attempts: toFa(0), dur: "—" },
  ].map((r) => ({ ...r, tone: stTone[r.status], statusLabel: stLabel[r.status] })),
};

export const CRON_HEALTH = {
  lastSuccess: "۲ دقیقه پیش",
  lastFailure: "۳۰ دقیقه پیش",
  loopback: "فعال",
  delay: "18 دقیقه",
  warning: "WP-Cron با ۱۸ دقیقه تأخیر اجرا شده است.",
  recommendation: "پیشنهاد می‌شود WP-Cron از طریق Server Cron فعال شود.",
};