// Mock data for the full checkup page. All values are simulated frontend data.

export const PRESETS = [
  { id: "quick", title: "چکاپ سریع", desc: "بررسی پایه در کمتر از ۱ دقیقه", icon: "faBolt", checks: ["سرور", "WordPress", "PHP", "Database", "Performance", "SSL"], est: "≈ ۴۵ ثانیه" },
  { id: "standard", title: "چکاپ استاندارد", desc: "پوشش متعادل برای استفاده روزانه", icon: "faStethoscope", checks: ["سرور", "WordPress", "PHP", "Database", "افزونه‌ها", "قالب‌ها", "صفحات", "Performance", "REST API", "Cron", "امنیت", "SSL", "DNS", "Cache"], est: "≈ ۲ دقیقه" },
  { id: "deep", title: "چکاپ عمیق", desc: "بررسی کامل زیرساخت، امنیت و یکپارچگی فایل‌ها", icon: "faMicroscope", checks: null, est: "≈ ۵ دقیقه" },
];

export const CHECKLIST = [
  "سرور", "WordPress", "PHP", "Database", "Plugins", "Themes", "Pages", "Performance",
  "REST API", "Cron", "Security", "File Integrity", "SSL", "DNS", "Email", "Cache",
  "Security Headers", "Sitemap", "robots.txt", "External Services",
];

// Map checklist labels to stage labels used while running
export const STAGES = [
  { key: "server", label: "سرور" },
  { key: "wordpress", label: "WordPress" },
  { key: "php", label: "PHP" },
  { key: "database", label: "Database" },
  { key: "plugins", label: "افزونه‌ها" },
  { key: "themes", label: "قالب‌ها" },
  { key: "pages", label: "صفحات" },
  { key: "performance", label: "Performance" },
  { key: "rest", label: "REST API" },
  { key: "cron", label: "Cron" },
  { key: "security", label: "امنیت" },
  { key: "files", label: "فایل‌ها" },
  { key: "ssl", label: "SSL" },
  { key: "dns", label: "DNS" },
  { key: "email", label: "Email" },
  { key: "cache", label: "Cache" },
  { key: "report", label: "گزارش نهایی" },
];

export const LOG_EVENTS = [
  { icon: "faPlug", tone: "success", msg: "REST API پاسخ صحیح داد." },
  { icon: "faServer", tone: "info", msg: "نسخه PHP بررسی شد." },
  { icon: "faDatabase", tone: "warning", msg: "wp_options دارای Autoload بالا است." },
  { icon: "faFileLines", tone: "info", msg: "بررسی 20 صفحه آغاز شد." },
  { icon: "faCircleXmark", tone: "danger", msg: "/contact/ پاسخ HTTP 503 داد." },
  { icon: "faClock", tone: "warning", msg: "WP Cron دارای تأخیر است." },
  { icon: "faLock", tone: "success", msg: "SSL معتبر است." },
  { icon: "faGlobe", tone: "success", msg: "DNS بدون تغییر شناسایی شد." },
  { icon: "faShieldHalved", tone: "info", msg: "بررسی Security Headers آغاز شد." },
  { icon: "faBug", tone: "warning", msg: "افزونه قدیمی با آسیب‌پذیری شناخته‌شده پیدا شد." },
  { icon: "faFileShield", tone: "success", msg: "یکپارچگی فایل‌های هسته تأیید شد." },
  { icon: "faEnvelope", tone: "warning", msg: "تنظیمات DKIM ناقص است." },
];

export const RESULT_GROUPS = [
  {
    key: "security", label: "امنیت", icon: "faShieldHalved",
    items: [
      { id: "s1", severity: "critical", title: "افزونه Contact Form 7 آسیب‌پذیر است", desc: "نسخه نصب‌شده دارای XSS غیرمستقیم گزارش‌شده است.", component: "Contact Form 7", status: "بحرانی", time: "۲ دقیقه پیش", current: "نسخه 5.6.4", expected: "نسخه 5.7.1 به بالا", evidence: "CVE-2026-1024", details: "افزونه Contact Form 7 نسخه 5.6.4 دارای آسیب‌پذیری XSS غیرمستقیم است که در نسخه 5.7.1 رفع شده است.", recommendation: "افزونه را به‌روزرسانی کنید یا موقتاً غیرفعال کنید." },
      { id: "s2", severity: "warning", title: "فایل readme.html در دسترس عمومی است", desc: "نسخه وردپرس از طریق این فایل افشا می‌شود.", component: "wp-root", status: "هشدار", time: "۳ دقیقه پیش", current: "در دسترس", expected: "مسدود", evidence: "GET /readme.html → 200", details: "فایل readme.html اطلاعات نسخه وردپرس را افشا می‌کند.", recommendation: "دسترسی به این فایل را در وب‌سرور مسدود کنید." },
      { id: "s3", severity: "success", title: "فایروال برنامه‌وب فعال است", desc: "قوانین WAF در حال اعمال روی همه درخواست‌هاست.", component: "WAF", status: "موفق", time: "۳ دقیقه پیش", current: "فعال", expected: "فعال", evidence: "۱۲ قانون فعال", details: "فایروال برنامه‌وب فعال است و درخواست‌های مشکوک را مسدود می‌کند.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
  {
    key: "performance", label: "Performance", icon: "faBolt",
    items: [
      { id: "p1", severity: "critical", title: "صفحه اصلی پاسخ 503 می‌دهد", desc: "۳ بار در ۱۰ دقیقه گذشته — احتمال اتمام PHP Workers.", component: "Homepage", status: "بحرانی", time: "۴ دقیقه پیش", current: "HTTP 503", expected: "HTTP 200", evidence: "GET / → 503 (۳ بار)", details: "صفحه اصلی در چند دقیقه گذشته ۳ بار پاسخ 503 داده است که نشان‌دهنده اتمام PHP Workers یا بار بالا است.", recommendation: "تعداد PHP Workers را افزایش دهید یا کش صفحه را فعال کنید." },
      { id: "p2", severity: "warning", title: "Object Cache غیرفعال است", desc: "فعال‌سازی Redis/Memcached بار دیتابیس را کاهش می‌دهد.", component: "Object Cache", status: "هشدار", time: "۴ دقیقه پیش", current: "غیرفعال", expected: "فعال", evidence: "wp_object_cache: disabled", details: "Object Cache غیرفعال است که باعث افزایش کوئری‌های دیتابیس می‌شود.", recommendation: "یک افزونه Object Cache مانند Redis Cache را نصب و فعال کنید." },
      { id: "p3", severity: "success", title: "Page Cache فعال است", desc: "Hit rate ۸۸٪ در ۲۴ ساعت گذشته.", component: "Page Cache", status: "موفق", time: "۵ دقیقه پیش", current: "۸۸٪", expected: "بالای ۸۰٪", evidence: "hit/miss: 88/12", details: "Page Cache با نرخ hit مناسب کار می‌کند.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
  {
    key: "database", label: "Database", icon: "faDatabase",
    items: [
      { id: "d1", severity: "warning", title: "Autoload دیتابیس بالا است", desc: "حجم Autoload بالاتر از حد پیشنهادی است.", component: "wp_options", status: "هشدار", time: "۲ دقیقه پیش", current: "4.8 MB", expected: "کمتر از 1 MB", evidence: "SUM(LENGTH(option_value)) WHERE autoload='yes'", details: "حجم Autoload در جدول wp_options بالاتر از حد پیشنهادی است که بار اضافه روی هر درخواست ایجاد می‌کند.", recommendation: "حجم Autoload بهتر است کمتر از 1MB باشد. گزینه‌های غیرضروری را از autoload حذف کنید." },
      { id: "d2", severity: "warning", title: "تراکنش‌های منقضی زیاد است", desc: "۱۲۰ تراکنش منقضی شده پاک نشده است.", component: "transients", status: "هشدار", time: "۲ دقیقه پیش", current: "۱۲۰ مورد", expected: "۰ مورد", evidence: "expired transients: 120", details: "تراکنش‌های منقضی شده فضای دیتابیس را اشغال می‌کنند.", recommendation: "تراکنش‌های منقضی را پاک‌سازی کنید." },
      { id: "d3", severity: "success", title: "اتصال دیتابیس پایدار است", desc: "زمان اتصال زیر ۲۰ms است.", component: "MySQL", status: "موفق", time: "۳ دقیقه پیش", current: "۱۸ms", expected: "زیر ۵۰ms", evidence: "ping: 18ms", details: "اتصال دیتابیس پایدار و سریع است.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
  {
    key: "pages", label: "Pages", icon: "faFileLines",
    items: [
      { id: "pg1", severity: "critical", title: "/contact/ پاسخ 503 می‌دهد", desc: "صفحه تماس در دسترس نیست.", component: "/contact/", status: "بحرانی", time: "۱ دقیقه پیش", current: "HTTP 503", expected: "HTTP 200", evidence: "GET /contact/ → 503", details: "صفحه تماس در حال حاضر در دسترس نیست و پاسخ 503 برمی‌گرداند.", recommendation: "وضعیت سرور و افزونه‌های فرم تماس را بررسی کنید." },
      { id: "pg2", severity: "warning", title: "/shop کند است", desc: "زمان پاسخ بالاتر از حد هدف است.", component: "/shop/", status: "هشدار", time: "۱ دقیقه پیش", current: "۸۹۰ms", expected: "زیر ۵۰۰ms", evidence: "TTFB: 890ms", details: "زمان پاسخ صفحه فروشگاه بالاتر از حد هدف است.", recommendation: "کش صفحه و بهینه‌سازی کوئری‌ها را بررسی کنید." },
      { id: "pg3", severity: "success", title: "۱۸ صفحه با وضعیت سالم", desc: "همه صفحات اصلی پاسخ 200 می‌دهند.", component: "pages", status: "موفق", time: "۲ دقیقه پیش", current: "۱۸/۲۰", expected: "۲۰/۲۰", evidence: "200: 18, 503: 1, slow: 1", details: "بیشتر صفحات با وضعیت سالم پاسخ می‌دهند.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
  {
    key: "wordpress", label: "WordPress", icon: "faCode",
    items: [
      { id: "w1", severity: "warning", title: "۲ افزونه نیاز به بروزرسانی دارد", desc: "بروزرسانی‌های امنیتی در انتظار است.", component: "Plugins", status: "هشدار", time: "۳ دقیقه پیش", current: "۲ افزونه", expected: "۰ افزونه", evidence: "updates: 2", details: "دو افزونه نیاز به بروزرسانی دارند.", recommendation: "افزونه‌ها را بروزرسانی کنید." },
      { id: "w2", severity: "success", title: "وردپرس به‌روز است", desc: "نسخه 6.6.2 نصب شده است.", component: "Core", status: "موفق", time: "۳ دقیقه پیش", current: "6.6.2", expected: "6.6.2", evidence: "wp_version: 6.6.2", details: "هسته وردپرس به‌روز است.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
  {
    key: "server", label: "Server", icon: "faServer",
    items: [
      { id: "sv1", severity: "warning", title: "فضای دیسک رو به اتمام است", desc: "۸۲٪ از فضای دیسک اشغال شده است.", component: "Disk", status: "هشدار", time: "۴ دقیقه پیش", current: "۸۲٪", expected: "زیر ۷۵٪", evidence: "df -h: 82%", details: "فضای دیسک رو به اتمام است.", recommendation: "فایل‌های لاگ و بکاپ‌های قدیمی را پاک کنید." },
      { id: "sv2", severity: "success", title: "PHP 8.2 سالم است", desc: "نسخه PHP پایدار و پشتیبانی‌شده است.", component: "PHP", status: "موفق", time: "۴ دقیقه پیش", current: "8.2.12", expected: "8.2+", evidence: "phpinfo: 8.2.12", details: "نسخه PHP سالم و پشتیبانی‌شده است.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
  {
    key: "infra", label: "Infrastructure", icon: "faNetworkWired",
    items: [
      { id: "i1", severity: "success", title: "SSL معتبر است", desc: "گواهینامه تا ۸۷ روز دیگر معتبر است.", component: "SSL", status: "موفق", time: "۵ دقیقه پیش", current: "۸۷ روز", expected: "بالای ۳۰ روز", evidence: "notAfter: +87d", details: "گواهینامه SSL معتبر است.", recommendation: "نیازی به اقدام نیست." },
      { id: "i2", severity: "success", title: "DNS بدون تغییر", desc: "رکوردها در ۲۴ ساعت گذشته ثابت بوده‌اند.", component: "DNS", status: "موفق", time: "۵ دقیقه پیش", current: "ثابت", expected: "ثابت", evidence: "no change detected", details: "رکوردهای DNS بدون تغییر هستند.", recommendation: "نیازی به اقدام نیست." },
    ],
  },
];

export const SUMMARY = { critical: 3, warning: 11, suggestion: 17, success: 96, score: 89, duration: "۰۲:۳۰", checks: 127, lastScan: "هم‌اکنون" };