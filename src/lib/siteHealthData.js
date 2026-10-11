// Mock data for the site health page. All values are simulated.

export const HEALTH_SCORE = { score: 96, status: "خوب", tone: "success" };

export const HEALTH_SUMMARY = [
  { key: "wordpress", label: "WordPress", value: "6.6.2", tone: "success", status: "به‌روز", icon: "faCode" },
  { key: "server", label: "Server", value: "Nginx", tone: "success", status: "سالم", icon: "faServer" },
  { key: "php", label: "PHP", value: "8.2.12", tone: "success", status: "سالم", icon: "faServer" },
  { key: "database", label: "Database", value: "MariaDB 10.11", tone: "success", status: "سالم", icon: "faDatabase" },
  { key: "rest", label: "REST API", value: "۱۲۰ms", tone: "success", status: "در دسترس", icon: "faPlug" },
  { key: "cron", label: "Cron", value: "۲ ساعت تأخیر", tone: "warning", status: "هشدار", icon: "faClock" },
  { key: "ssl", label: "SSL", value: "۸۷ روز", tone: "success", status: "معتبر", icon: "faLock" },
  { key: "dns", label: "DNS", value: "۱۸ms", tone: "success", status: "سالم", icon: "faGlobe" },
];

// Flat diagnostics with status/current/recommended/severity
export const DIAGNOSTICS = [
  // WordPress
  { section: "WordPress", label: "WordPress Version", current: "6.6.2", recommended: "6.6.2", severity: "success", status: "به‌روز" },
  { section: "WordPress", label: "WordPress Updates", current: "هسته به‌روز", recommended: "به‌روز", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Plugin Updates", current: "۲ افزونه نیازمند بروزرسانی", recommended: "۰ افزونه", severity: "warning", status: "هشدار" },
  { section: "WordPress", label: "Theme Updates", current: "همه به‌روز", recommended: "به‌روز", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Debug Mode", current: "غیرفعال", recommended: "غیرفعال در تولید", severity: "success", status: "سالم" },
  { section: "WordPress", label: "WP_DEBUG", current: "false", recommended: "false", severity: "success", status: "سالم" },
  { section: "WordPress", label: "WP_DEBUG_LOG", current: "true", recommended: "false در تولید", severity: "warning", status: "هشدار" },
  { section: "WordPress", label: "WP_DEBUG_DISPLAY", current: "false", recommended: "false", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Site URL", current: "https://example.com", recommended: "HTTPS", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Home URL", current: "https://example.com", recommended: "HTTPS", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Permalinks", current: "/%postname%/", recommended: "نام‌محور", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Timezone", current: "Asia/Tehran", recommended: "هماهنگ با سرور", severity: "success", status: "سالم" },
  { section: "WordPress", label: "HTTPS", current: "فعال", recommended: "فعال", severity: "success", status: "سالم" },
  { section: "WordPress", label: "Filesystem Permissions", current: "wp-config: ۶۴۴", recommended: "۶۴۴", severity: "success", status: "سالم" },
  // PHP
  { section: "PHP", label: "PHP Version", current: "8.2.12", recommended: "8.2+", severity: "success", status: "سالم" },
  { section: "PHP", label: "memory_limit", current: "256MB", recommended: "256MB+", severity: "success", status: "سالم" },
  { section: "PHP", label: "max_execution_time", current: "120s", recommended: "60s+", severity: "success", status: "سالم" },
  { section: "PHP", label: "upload_max_filesize", current: "64MB", recommended: "64MB+", severity: "success", status: "سالم" },
  { section: "PHP", label: "post_max_size", current: "64MB", recommended: "64MB+", severity: "success", status: "سالم" },
  { section: "PHP", label: "max_input_vars", current: "1000", recommended: "1000+", severity: "success", status: "سالم" },
  { section: "PHP", label: "OPcache", current: "فعال", recommended: "فعال", severity: "success", status: "سالم" },
  { section: "PHP", label: "display_errors", current: "Off", recommended: "Off", severity: "success", status: "سالم" },
  // Server
  { section: "Server", label: "Web Server", current: "Nginx 1.26", recommended: "پشتیبانی‌شده", severity: "success", status: "سالم" },
  { section: "Server", label: "Server response time", current: "۳۸۰ms", recommended: "زیر ۵۰۰ms", severity: "success", status: "سالم" },
  { section: "Server", label: "Disk usage", current: "۸۲٪", recommended: "زیر ۷۵٪", severity: "warning", status: "هشدار" },
  { section: "Server", label: "Disk free space", current: "۱۸GB", recommended: "بالای ۲۰٪", severity: "warning", status: "هشدار" },
  { section: "Server", label: "Server timezone", current: "UTC", recommended: "Asia/Tehran", severity: "warning", status: "هشدار" },
  { section: "Server", label: "HTTPS", current: "فعال", recommended: "فعال", severity: "success", status: "سالم" },
  { section: "Server", label: "Compression", current: "Gzip فعال", recommended: "فعال", severity: "success", status: "سالم" },
  { section: "Server", label: "HTTP/2", current: "فعال", recommended: "فعال", severity: "success", status: "سالم" },
  { section: "Server", label: "HTTP/3", current: "غیرفعال", recommended: "اختیاری", severity: "info", status: "نیازمند بررسی" },
  // Database
  { section: "Database", label: "Database connection", current: "پایدار · ۱۸ms", recommended: "زیر ۵۰ms", severity: "success", status: "سالم" },
  { section: "Database", label: "Database version", current: "MariaDB 10.11", recommended: "10.11+", severity: "success", status: "سالم" },
  { section: "Database", label: "Database size", current: "۱۸۴MB", recommended: "زیر ۵۰۰MB", severity: "success", status: "سالم" },
  { section: "Database", label: "Table count", current: "۴۸ جدول", recommended: "—", severity: "success", status: "سالم" },
  { section: "Database", label: "Autoload size", current: "4.8 MB", recommended: "کمتر از 1 MB", severity: "warning", status: "هشدار" },
  { section: "Database", label: "Slow queries", current: "۳ کوئری کند", recommended: "۰ کوئری", severity: "warning", status: "هشدار" },
  { section: "Database", label: "Expired transients", current: "۱۲۰ مورد", recommended: "۰ مورد", severity: "warning", status: "هشدار" },
  { section: "Database", label: "Revisions", current: "۸۹۰ بازبینی", recommended: "پاک‌سازی دوره‌ای", severity: "info", status: "نیازمند بررسی" },
];

export const STORAGE = { total: 100, used: 82, free: 18, unit: "GB" };

export const REST_ENDPOINTS = [
  { endpoint: "/wp-json/", status: 200, time: "118ms", ok: true },
  { endpoint: "/wp-json/wp/v2/posts", status: 200, time: "142ms", ok: true },
  { endpoint: "/wp-json/wp/v2/users", status: 200, time: "131ms", ok: true },
  { endpoint: "/wp-json/wp/v2/pages", status: 200, time: "156ms", ok: true },
  { endpoint: "/wp-json/wp/v2/categories", status: 401, time: "—", ok: false },
];

export const LOOPBACK = { status: "سالم", responseTime: "۲۱۰ms", lastCheck: "۲ دقیقه پیش", ok: true };

export const CRON = {
  status: "هشدار", ok: false,
  lastRun: "۲ ساعت و ۱۵ دقیقه پیش",
  delayed: 3, failed: 1,
  nextEvent: "wp_version_check · ۱۴:۳۰",
};

export const SSL = {
  status: "معتبر", ok: true,
  issuer: "Let's Encrypt R3",
  validFrom: "۱۴۰۳/۰۷/۲۲",
  expires: "۱۴۰۳/۱۰/۲۰",
  daysRemaining: 87,
};

export const DNS = {
  status: "سالم", ok: true,
  a: "185.199.108.153",
  aaaa: "2606:50c0:8000::153",
  mx: "mail.example.com",
  ns: "ns1.cloudflare.com",
  lastChange: "بدون تغییر در ۲۴ ساعت",
};

export const EMAIL = {
  mail: "wp_mail() فعال", smtp: "تنظیم‌نشده",
  lastSuccess: "۵ ساعت پیش",
  lastFailed: "۲ روز پیش — DKIM نامعتبر",
};

export const CACHE = [
  { label: "Page Cache", value: "فعال · ۸۸٪", tone: "success", status: "فعال" },
  { label: "Object Cache", value: "غیرفعال", tone: "warning", status: "پیشنهادی" },
  { label: "Redis", value: "غیرفعال", tone: "warning", status: "غیرفعال" },
  { label: "OPcache", value: "فعال", tone: "success", status: "فعال" },
  { label: "Browser Cache", value: "فعال", tone: "success", status: "فعال" },
  { label: "CDN", value: "Cloudflare", tone: "success", status: "فعال" },
];