// Mock data for Alert Center, Alert Rules, Notification Channels & SMS settings.
// All values are simulated — no backend logic.

export const toFa = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(+d));

// ── Alert KPIs ──────────────────────────────────────────────
export const ALERT_KPIS = [
  { id: "open", icon: "faBell", tone: "primary", label: "هشدارهای باز", value: 18 },
  { id: "critical", icon: "faCircleExclamation", tone: "danger", label: "بحرانی", value: 3 },
  { id: "high", icon: "faTriangleExclamation", tone: "warning", label: "مهم", value: 5 },
  { id: "medium", icon: "faCircleInfo", tone: "info", label: "هشدار", value: 7 },
  { id: "low", icon: "faCircleCheck", tone: "success", label: "اطلاعاتی", value: 3 },
  { id: "resolved", icon: "faCircleCheck", tone: "success", label: "حل‌شده امروز", value: 12 },
];

// ── Alert Tabs ──────────────────────────────────────────────
export const ALERT_TABS = [
  { id: "open", label: "باز", count: 18 },
  { id: "acknowledged", label: "تأییدشده", count: 4 },
  { id: "resolved", label: "حل‌شده", count: 12 },
  { id: "ignored", label: "نادیده‌گرفته‌شده", count: 2 },
  { id: "snoozed", label: "Snoozed", count: 1 },
  { id: "all", label: "همه", count: 37 },
];

// ── Alert Categories ─────────────────────────────────────────
export const ALERT_CATEGORIES = [
  "امنیت", "HTTP", "Performance", "Database", "WordPress",
  "Files", "Cron", "SSL", "DNS", "Email", "Storage",
];

// ── Severities ──────────────────────────────────────────────
export const SEVERITIES = [
  { id: "critical", label: "Critical", tone: "danger", color: "oklch(var(--destructive))" },
  { id: "high", label: "High", tone: "warning", color: "oklch(var(--warning))" },
  { id: "medium", label: "Medium", tone: "info", color: "oklch(var(--info))" },
  { id: "low", label: "Low", tone: "success", color: "oklch(var(--success))" },
  { id: "info", label: "Info", tone: "primary", color: "oklch(var(--primary))" },
];

export const severityMap = Object.fromEntries(SEVERITIES.map((s) => [s.id, s]));

// ── Notification Channels ────────────────────────────────────
export const NOTIF_CHANNELS = ["Dashboard", "SMS", "Email", "Telegram", "Webhook"];

// ── Alerts ──────────────────────────────────────────────────
export const ALERTS = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "صفحه اصلی پاسخ 503 می‌دهد",
    category: "HTTP",
    component: "Homepage",
    source: "Uptime Monitor",
    firstDetected: "۱۴:۲۱",
    lastDetected: "۱۴:۲۶",
    occurrences: 5,
    status: "open",
    notified: ["Dashboard", "SMS"],
    description: "صفحه اصلی سایت در ۵ بررسی متوالی پاسخ HTTP 503 برگردانده است. احتمالاً سرور دچار اختلال شده یا منابع کافی در دسترس نیست.",
    affectedResources: ["example.com/", "PHP-FPM Pool", "Nginx Worker"],
    evidence: [
      { type: "HTTP Response", value: "503 Service Unavailable" },
      { type: "Response Time", value: "30,000ms (timeout)" },
      { type: "Check Interval", value: "1 minute" },
    ],
    recommendedActions: [
      "بررسی وضعیت PHP-FPM و تعداد workerهای فعال",
      "بررسی لاگ‌های Nginx و error_log",
      "افزایش منابع سرور یا راه‌اندازی مجدد سرویس وب",
    ],
  },
  {
    id: "ALT-002",
    severity: "critical",
    title: "Request Flood از IP مشکوک",
    category: "امنیت",
    component: "WAF",
    source: "Firewall Monitor",
    firstDetected: "۱۴:۲۲",
    lastDetected: "۱۴:۲۳",
    occurrences: 1,
    status: "acknowledged",
    notified: ["Dashboard", "SMS", "Email"],
    description: "IP 185.xxx.xxx.xxx در ۶۰ ثانیه ۸۲۶ درخواست ارسال کرده است که از Threshold تعریف‌شده (۵۰۰ درخواست) عبور کرده.",
    affectedResources: ["wp-login.php", "xmlrpc.php", "REST API"],
    evidence: [
      { type: "Source IP", value: "185.xxx.xxx.xxx" },
      { type: "Request Count", value: "826 in 60s" },
      { type: "Target Endpoints", value: "wp-login.php, xmlrpc.php" },
    ],
    recommendedActions: [
      "مسدودسازی موقت IP با Temporary Block",
      "افزایش Threshold در صورت ترافیک عادی",
      "بررسی لاگ‌های دسترسی برای الگوهای حمله",
    ],
  },
  {
    id: "ALT-003",
    severity: "high",
    title: "فایل PHP جدید در uploads",
    category: "Files",
    component: "File Integrity",
    source: "File Integrity Monitor",
    firstDetected: "۱۳:۴۵",
    lastDetected: "۱۳:۴۵",
    occurrences: 1,
    status: "open",
    notified: ["Dashboard", "Email"],
    description: "فایل جدید shell.php در مسیر wp-content/uploads/2026/ شناسایی شد. این می‌تواند نشانه آپلود وب‌شل مخرب باشد.",
    affectedResources: ["wp-content/uploads/2026/shell.php"],
    evidence: [
      { type: "File Path", value: "wp-content/uploads/2026/shell.php" },
      { type: "File Size", value: "2.4KB" },
      { type: "Detected By", value: "File Integrity Scan" },
    ],
    recommendedActions: [
      "حذف فایل مشکوک",
      "بررسی دسترسی‌های کاربران دارای آپلود",
      "اسکن کامل سایت با آنتی‌مالور",
    ],
  },
  {
    id: "ALT-004",
    severity: "high",
    title: "SSL تا 12 روز دیگر منقضی می‌شود",
    category: "SSL",
    component: "SSL Certificate",
    source: "SSL Monitor",
    firstDetected: "۰۹:۰۰",
    lastDetected: "۰۹:۰۰",
    occurrences: 1,
    status: "open",
    notified: ["Dashboard", "Email"],
    description: "گواهی SSL سایت example.com در ۱۲ روز آینده منقضی خواهد شد. تمدید گواهی را تنظیم کنید.",
    affectedResources: ["example.com", "SSL Certificate"],
    evidence: [
      { type: "Issuer", value: "Let's Encrypt R3" },
      { type: "Expiry Date", value: "2026-10-23" },
      { type: "Days Remaining", value: "12" },
    ],
    recommendedActions: [
      "تمدید گواهی SSL",
      "بررسی تنظیمات Auto-Renew",
      "اطمینان از صحت DNS challenge",
    ],
  },
  {
    id: "ALT-005",
    severity: "medium",
    title: "WP-Cron دارای تاخیر است",
    category: "Cron",
    component: "WP-Cron",
    source: "Cron Monitor",
    firstDetected: "۱۲:۳۰",
    lastDetected: "۱۴:۲۰",
    occurrences: 8,
    status: "open",
    notified: ["Dashboard"],
    description: "وظایف WP-Cron با تاخیر بیش از ۵ دقیقه اجرا می‌شوند که می‌تواند روی زمان‌بندی پست‌ها و بکاپ‌ها تاثیر بگذارد.",
    affectedResources: ["wp-cron.php", "Scheduled Tasks"],
    evidence: [
      { type: "Average Delay", value: "5-8 minutes" },
      { type: "Missed Tasks", value: "3" },
      { type: "Last Run", value: "14:15 (5 min late)" },
    ],
    recommendedActions: [
      "غیرفعال‌سازی WP-Cron و استفاده از Server Cron",
      "بررسی تعداد وظایف زمان‌بندی‌شده",
      "بهینه‌سازی افزونه‌های دارای cron زیاد",
    ],
  },
  {
    id: "ALT-006",
    severity: "medium",
    title: "Autoload دیتابیس بالا است",
    category: "Database",
    component: "wp_options",
    source: "Database Monitor",
    firstDetected: "۱۰:۱۵",
    lastDetected: "۱۴:۰۰",
    occurrences: 3,
    status: "open",
    notified: ["Dashboard"],
    description: "حجم Autoload در جدول wp_options از حد مجاز عبور کرده و بر عملکرد صفحه‌ها تاثیر می‌گذارد.",
    affectedResources: ["wp_options", "PHP Memory"],
    evidence: [
      { type: "Autoload Size", value: "2.1MB" },
      { type: "Recommended", value: "< 800KB" },
      { type: "Top Option", value: "wc_settings (480KB)" },
    ],
    recommendedActions: [
      "پاکسازی گزینه‌های autoload غیرضروری",
      "بررسی افزونه‌های دارای autoload سنگین",
      "استفاده از Object Cache",
    ],
  },
  {
    id: "ALT-007",
    severity: "low",
    title: "Plugin update available",
    category: "WordPress",
    component: "Plugins",
    source: "Update Monitor",
    firstDetected: "۰۸:۰۰",
    lastDetected: "۰۸:۰۰",
    occurrences: 1,
    status: "open",
    notified: ["Dashboard"],
    description: "بروزرسانی جدید برای افزونه Contact Form 7 موجود است. نسخه ۵.۷ به ۵.۷.۱.",
    affectedResources: ["Contact Form 7"],
    evidence: [
      { type: "Current Version", value: "5.7.0" },
      { type: "New Version", value: "5.7.1" },
      { type: "Update Type", value: "Minor (security fix)" },
    ],
    recommendedActions: [
      "بروزرسانی افزونه",
      "تهیه بکاپ قبل از بروزرسانی",
      "بررسی changelog",
    ],
  },
  {
    id: "ALT-008",
    severity: "critical",
    title: "Database Connection Failed",
    category: "Database",
    component: "MySQL",
    source: "Database Monitor",
    firstDetected: "۱۱:۳۰",
    lastDetected: "۱۱:۳۵",
    occurrences: 4,
    status: "resolved",
    notified: ["Dashboard", "SMS", "Email"],
    description: "اتصال به دیتابیس MySQL قطع شده بود. خطای Error establishing a database connection.",
    affectedResources: ["MySQL Server", "wp-config.php"],
    evidence: [
      { type: "Error", value: "Error establishing a database connection" },
      { type: "Duration", value: "5 minutes" },
      { type: "Resolved By", value: "Auto-recovery" },
    ],
    recommendedActions: [
      "بررسی منابع MySQL",
      "بررسی max_connections",
      "تنظیم Auto-Recovery",
    ],
  },
  {
    id: "ALT-009",
    severity: "high",
    title: "Brute Force تلاش ورود",
    category: "امنیت",
    component: "wp-login.php",
    source: "Login Security",
    firstDetected: "۱۳:۱۰",
    lastDetected: "۱۳:۵۵",
    occurrences: 45,
    status: "resolved",
    notified: ["Dashboard", "SMS"],
    description: "۱۲ تلاش ورود ناموفق از IP 91.92.240.1 در ۴۵ دقیقه.",
    affectedResources: ["wp-login.php", "Admin Account"],
    evidence: [
      { type: "Source IP", value: "91.92.240.1" },
      { type: "Failed Attempts", value: "45" },
      { type: "Action Taken", value: "IP blocked" },
    ],
    recommendedActions: [
      "تغییر رمز ادمین",
      "فعال‌سازی احراز هویت دو مرحله‌ای",
      "بررسی لیست IP مسدودشده",
    ],
  },
  {
    id: "ALT-010",
    severity: "medium",
    title: "REST API پاسخ کند",
    category: "Performance",
    component: "REST API",
    source: "Performance Monitor",
    firstDetected: "۱۳:۲۰",
    lastDetected: "۱۴:۱۰",
    occurrences: 6,
    status: "acknowledged",
    notified: ["Dashboard"],
    description: "زمان پاسخ REST API از ۲۰۰ms به ۸۵۰ms افزایش یافته است.",
    affectedResources: ["/wp-json/wp/v2/posts", "REST API Handler"],
    evidence: [
      { type: "Avg Response", value: "850ms" },
      { type: "Previous", value: "200ms" },
      { type: "P95", value: "1.2s" },
    ],
    recommendedActions: [
      "بررسی کوئری‌های کند در REST API",
      "فعال‌سازی Cache برای endpointها",
      "بررسی افزونه‌های متصل به REST API",
    ],
  },
  {
    id: "ALT-011",
    severity: "low",
    title: "DNS تغییر یافت",
    category: "DNS",
    component: "DNS Records",
    source: "DNS Monitor",
    firstDetected: "۰۷:۴۵",
    lastDetected: "۰۷:۴۵",
    occurrences: 1,
    status: "ignored",
    notified: ["Dashboard"],
    description: "رکورد A سایت از 185.10.10.1 به 185.10.10.5 تغییر کرد.",
    affectedResources: ["example.com A record"],
    evidence: [
      { type: "Old IP", value: "185.10.10.1" },
      { type: "New IP", value: "185.10.10.5" },
      { type: "TTL", value: "3600s" },
    ],
    recommendedActions: ["تأیید تغییر DNS", "بررسی TTL"],
  },
  {
    id: "ALT-012",
    severity: "info",
    title: "اسکن روزانه انجام شد",
    category: "WordPress",
    component: "Scanner",
    source: "Daily Scan",
    firstDetected: "۰۶:۰۰",
    lastDetected: "۰۶:۰۰",
    occurrences: 1,
    status: "resolved",
    notified: ["Dashboard"],
    description: "اسکن روزانه امنیت و سلامت سایت با موفقیت انجام شد. هیچ مورد بحرانی یافت نشد.",
    affectedResources: ["Full Site"],
    evidence: [
      { type: "Scan Duration", value: "4 min 12 sec" },
      { type: "Items Checked", value: "247" },
      { type: "Issues Found", value: "0 critical, 2 info" },
    ],
    recommendedActions: ["بررسی موارد اطلاعاتی"],
  },
];

// ── Alert Timeline ──────────────────────────────────────────
export const ALERT_TIMELINE = [
  { time: "14:21", text: "اولین خطا شناسایی شد", icon: "faCircleExclamation", tone: "danger" },
  { time: "14:22", text: "دومین خطا ثبت شد", icon: "faTriangleExclamation", tone: "warning" },
  { time: "14:23", text: "Threshold رد شد", icon: "faGaugeHigh", tone: "warning" },
  { time: "14:23", text: "Critical Alert ایجاد شد", icon: "faBell", tone: "danger" },
  { time: "14:23", text: "SMS ارسال شد", icon: "faPaperPlane", tone: "primary" },
  { time: "14:26", text: "Administrator مشاهده هشدار را تأیید کرد", icon: "faCircleCheck", tone: "success" },
];

// ── Snooze Options ──────────────────────────────────────────
export const SNOOZE_OPTIONS = [
  { id: "30m", label: "30 دقیقه" },
  { id: "1h", label: "1 ساعت" },
  { id: "6h", label: "6 ساعت" },
  { id: "12h", label: "12 ساعت" },
  { id: "24h", label: "24 ساعت" },
  { id: "tomorrow", label: "تا فردا" },
  { id: "nextweek", label: "تا هفته آینده" },
  { id: "custom", label: "زمان سفارشی" },
];

// ── Alert Rules ─────────────────────────────────────────────
export const RULE_CATEGORIES = [
  "HTTP", "Security", "Performance", "Database", "WordPress",
  "Files", "Cron", "SSL", "DNS", "Storage", "Email",
];

export const ALERT_RULES = [
  {
    id: "rule-1",
    name: "Request Flood",
    category: "Security",
    severity: "critical",
    enabled: true,
    threshold: "500 requests",
    timeWindow: "60 seconds",
    channels: ["Dashboard", "SMS"],
    cooldown: "20 minutes",
    lastTriggered: "14:22",
    occurrences: 3,
  },
  {
    id: "rule-2",
    name: "Homepage Down",
    category: "HTTP",
    severity: "critical",
    enabled: true,
    threshold: "HTTP 503",
    timeWindow: "3 consecutive checks",
    channels: ["Dashboard", "SMS", "Email"],
    cooldown: "10 minutes",
    lastTriggered: "14:21",
    occurrences: 1,
  },
  {
    id: "rule-3",
    name: "SSL Expiration",
    category: "SSL",
    severity: "high",
    enabled: true,
    threshold: "14 days remaining",
    timeWindow: "Daily check",
    channels: ["Dashboard", "Email"],
    cooldown: "24 hours",
    lastTriggered: "09:00",
    occurrences: 1,
  },
  {
    id: "rule-4",
    name: "Brute Force Detection",
    category: "Security",
    severity: "high",
    enabled: true,
    threshold: "10 failed logins",
    timeWindow: "5 minutes",
    channels: ["Dashboard", "SMS"],
    cooldown: "30 minutes",
    lastTriggered: "13:10",
    occurrences: 2,
  },
  {
    id: "rule-5",
    name: "Database Failure",
    category: "Database",
    severity: "critical",
    enabled: true,
    threshold: "Connection error",
    timeWindow: "1 check",
    channels: ["Dashboard", "SMS", "Email"],
    cooldown: "5 minutes",
    lastTriggered: "11:30",
    occurrences: 1,
  },
  {
    id: "rule-6",
    name: "Cron Delay",
    category: "Cron",
    severity: "medium",
    enabled: true,
    threshold: "5 min delay",
    timeWindow: "Each run",
    channels: ["Dashboard"],
    cooldown: "1 hour",
    lastTriggered: "12:30",
    occurrences: 8,
  },
  {
    id: "rule-7",
    name: "Suspicious File Upload",
    category: "Files",
    severity: "high",
    enabled: false,
    threshold: "New .php in uploads",
    timeWindow: "Real-time",
    channels: ["Dashboard", "Email"],
    cooldown: "1 hour",
    lastTriggered: "—",
    occurrences: 0,
  },
  {
    id: "rule-8",
    name: "Disk Critical",
    category: "Storage",
    severity: "critical",
    enabled: true,
    threshold: "Free space < 10%",
    timeWindow: "5 min check",
    channels: ["Dashboard", "SMS"],
    cooldown: "30 minutes",
    lastTriggered: "—",
    occurrences: 0,
  },
  {
    id: "rule-9",
    name: "High Response Time",
    category: "Performance",
    severity: "medium",
    enabled: true,
    threshold: "TTFB > 800ms",
    timeWindow: "5 consecutive checks",
    channels: ["Dashboard"],
    cooldown: "20 minutes",
    lastTriggered: "13:20",
    occurrences: 4,
  },
  {
    id: "rule-10",
    name: "REST API Failure",
    category: "WordPress",
    severity: "high",
    enabled: true,
    threshold: "HTTP 500 on /wp-json",
    timeWindow: "3 consecutive checks",
    channels: ["Dashboard", "Email"],
    cooldown: "15 minutes",
    lastTriggered: "—",
    occurrences: 0,
  },
];

// ── Rule Templates ──────────────────────────────────────────
export const RULE_TEMPLATES = [
  { id: "tpl-1", name: "Request Flood", category: "Security", severity: "critical", icon: "faWater" },
  { id: "tpl-2", name: "Brute Force", category: "Security", severity: "high", icon: "faSkullCrossbones" },
  { id: "tpl-3", name: "Homepage Down", category: "HTTP", severity: "critical", icon: "faHouseCircleExclamation" },
  { id: "tpl-4", name: "Critical Page 503", category: "HTTP", severity: "critical", icon: "faServer" },
  { id: "tpl-5", name: "Database Failure", category: "Database", severity: "critical", icon: "faDatabase" },
  { id: "tpl-6", name: "Cron Failure", category: "Cron", severity: "high", icon: "faClock" },
  { id: "tpl-7", name: "REST API Failure", category: "WordPress", severity: "high", icon: "faPlug" },
  { id: "tpl-8", name: "SSL Expiration", category: "SSL", severity: "high", icon: "faLock" },
  { id: "tpl-9", name: "Domain Expiration", category: "DNS", severity: "high", icon: "faGlobe" },
  { id: "tpl-10", name: "DNS Change", category: "DNS", severity: "medium", icon: "faNetworkWired" },
  { id: "tpl-11", name: "Suspicious File", category: "Files", severity: "high", icon: "faFileShield" },
  { id: "tpl-12", name: "Core File Change", category: "Files", severity: "critical", icon: "faFileCircleExclamation" },
  { id: "tpl-13", name: "Plugin Vulnerability", category: "WordPress", severity: "high", icon: "faBug" },
  { id: "tpl-14", name: "High Response Time", category: "Performance", severity: "medium", icon: "faGaugeHigh" },
  { id: "tpl-15", name: "Disk Critical", category: "Storage", severity: "critical", icon: "faHardDrive" },
];

// ── Visual Rule Builder ─────────────────────────────────────
export const RULE_BUILDER_METRICS = [
  "Requests from one IP", "HTTP Status", "SSL Days Remaining", "Disk Free Space",
  "Response Time", "Failed Logins", "Database Query Time", "Cron Delay",
  "CPU Usage", "Memory Usage", "File Changes", "Plugin Updates",
];

export const RULE_BUILDER_OPERATORS = [
  "is greater than", "is less than", "equals", "not equals",
  "contains", "matches regex", "is empty", "is not empty",
];

export const RULE_BUILDER_TIME_WINDOWS = [
  "60 seconds", "5 minutes", "10 minutes", "30 minutes", "1 hour", "24 hours",
];

export const RULE_BUILDER_ACTIONS = [
  { id: "dashboard", label: "Dashboard Alert", icon: "faBell" },
  { id: "sms", label: "SMS", icon: "faPaperPlane" },
  { id: "email", label: "Email", icon: "faEnvelope" },
  { id: "telegram", label: "Telegram", icon: "faComments" },
  { id: "webhook", label: "Webhook", icon: "faTowerBroadcast" },
  { id: "block", label: "Temporary Block", icon: "faBan" },
];

export const COOLDOWN_OPTIONS = [
  "5 min", "10 min", "20 min", "30 min", "1 hour", "6 hours", "Custom",
];

// ── Notification Channels ───────────────────────────────────
export const CHANNEL_CARDS = [
  { id: "sms", name: "SMS", icon: "faPaperPlane", status: "connected", statusLabel: "متصل", tone: "success", desc: "ملی پیامک" },
  { id: "email", name: "Email", icon: "faEnvelope", status: "disabled", statusLabel: "غیرفعال", tone: "warning", desc: "SMTP" },
  { id: "telegram", name: "Telegram", icon: "faComments", status: "coming", statusLabel: "به‌زودی", tone: "info", desc: "Bot API" },
  { id: "webhook", name: "Webhook", icon: "faTowerBroadcast", status: "disabled", statusLabel: "غیرفعال", tone: "warning", desc: "Custom HTTP" },
];

// ── SMS Receivers ───────────────────────────────────────────
export const SMS_RECEIVERS = [
  { id: 1, name: "مدیر سایت", phone: "09xxxxxxxxx", alertType: "بحرانی + مهم", status: "active" },
  { id: 2, name: "مدیر فنی", phone: "09xxxxxxxxx", alertType: "فقط امنیت", status: "active" },
  { id: 3, name: "پشتیبانی", phone: "09xxxxxxxxx", alertType: "Critical + High", status: "inactive" },
];

export const RECEIVER_ALERT_TYPES = [
  "همه", "فقط Critical", "Critical + High", "امنیت", "Uptime", "Performance", "Custom",
];

// ── SMS Sending Modes ───────────────────────────────────────
export const SMS_MODES = [
  { id: "normal", label: "ارسال عادی" },
  { id: "pattern", label: "ارسال خدماتی / الگو" },
];

// ── SMS Alert Selection (Accordion) ─────────────────────────
export const SMS_ALERT_GROUPS = [
  {
    id: "security",
    title: "امنیت",
    icon: "faShieldHalved",
    alerts: [
      "Request Flood", "Brute Force", "Administrator Created", "Suspicious Admin Login",
      "Core File Changed", "Suspicious File", "Critical Vulnerability",
    ],
  },
  {
    id: "uptime",
    title: "دردسترس بودن",
    icon: "faChartLine",
    alerts: [
      "Homepage Down", "Critical Page Down", "HTTP 500", "HTTP 502",
      "HTTP 503", "HTTP 504", "Timeout",
    ],
  },
  {
    id: "system",
    title: "سیستم",
    icon: "faServer",
    alerts: [
      "Database Failure", "REST API Failure", "Cron Failure", "Disk Critical",
      "SSL Expiration", "Domain Expiration", "DNS Changed",
    ],
  },
  {
    id: "performance",
    title: "Performance",
    icon: "faBolt",
    alerts: [
      "Very Slow Website", "Database Slowdown", "High Plugin Impact",
    ],
  },
];

// ── Notification History ────────────────────────────────────
export const NOTIFICATION_HISTORY = [
  { id: 1, time: "14:23", alert: "صفحه اصلی پاسخ 503 می‌دهد", channel: "SMS", recipient: "09xxxxxxxxx", status: "sent", providerResult: "Success", attempts: 1 },
  { id: 2, time: "14:23", alert: "Request Flood از IP مشکوک", channel: "SMS", recipient: "09xxxxxxxxx", status: "sent", providerResult: "Success", attempts: 1 },
  { id: 3, time: "14:22", alert: "Request Flood از IP مشکوک", channel: "Dashboard", recipient: "—", status: "sent", providerResult: "—", attempts: 1 },
  { id: 4, time: "13:10", alert: "Brute Force تلاش ورود", channel: "SMS", recipient: "09xxxxxxxxx", status: "sent", providerResult: "Success", attempts: 1 },
  { id: 5, time: "11:35", alert: "Database Connection Failed", channel: "Email", recipient: "admin@example.com", status: "failed", providerResult: "SMTP timeout", attempts: 3 },
  { id: 6, time: "11:30", alert: "Database Connection Failed", channel: "SMS", recipient: "09xxxxxxxxx", status: "sent", providerResult: "Success", attempts: 1 },
  { id: 7, time: "10:15", alert: "Autoload دیتابیس بالا است", channel: "Dashboard", recipient: "—", status: "sent", providerResult: "—", attempts: 1 },
  { id: 8, time: "09:00", alert: "SSL تا 12 روز دیگر منقضی می‌شود", channel: "Email", recipient: "admin@example.com", status: "queued", providerResult: "Pending", attempts: 0 },
  { id: 9, time: "08:00", alert: "Plugin update available", channel: "Dashboard", recipient: "—", status: "suppressed", providerResult: "Low severity", attempts: 0 },
  { id: 10, time: "07:45", alert: "DNS تغییر یافت", channel: "Dashboard", recipient: "—", status: "cooldown", providerResult: "Within cooldown", attempts: 0 },
  { id: 11, time: "06:00", alert: "اسکن روزانه انجام شد", channel: "Dashboard", recipient: "—", status: "sent", providerResult: "—", attempts: 1 },
  { id: 12, time: "05:30", alert: "Cron Delay detected", channel: "SMS", recipient: "09xxxxxxxxx", status: "failed", providerResult: "Invalid number", attempts: 2 },
];

export const NOTIF_STATUS_MAP = {
  sent: { label: "Sent", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  queued: { label: "Queued", tone: "info" },
  suppressed: { label: "Suppressed", tone: "warning" },
  cooldown: { label: "Cooldown", tone: "warning" },
};
