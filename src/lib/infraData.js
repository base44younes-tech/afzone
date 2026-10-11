// Mock data for Infrastructure: SSL, Domain, DNS, Cache, Email, SEO, Security Headers. All simulated.

function toFa(v) { return String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(+d)); }

export const SSL = {
  status: "فعال",
  statusLabel: "SSL فعال",
  issuer: "Let's Encrypt",
  validFrom: "۱۴۰۳/۰۷/۱۵",
  expires: "۱۴۰۳/۱۰/۲۲",
  daysRemaining: 27,
  hostname: "example.com",
  protocol: "TLS 1.3",
  tone: "success",
  thresholds: [
    { days: 30, label: "۳۰ روز", tone: "success" },
    { days: 14, label: "۱۴ روز", tone: "warning" },
    { days: 7, label: "۷ روز", tone: "danger" },
  ],
};

export const DOMAIN = {
  name: "example.com",
  registrar: "NameCheap",
  created: "۱۳۹۸/۰۳/۱۲",
  expires: "۱۴۰۳/۱۱/۲۲",
  daysRemaining: 42,
  autoRenewal: true,
  warning: "دامنه ۴۲ روز دیگر منقضی می‌شود.",
  tone: "warning",
};

export const DNS_RECORDS = [
  { type: "A", name: "@", value: "91.198.174.10", ttl: "3600", status: "ok", last: "۲ دقیقه پیش" },
  { type: "AAAA", name: "@", value: "2a00:1450:400e:803::200e", ttl: "3600", status: "ok", last: "۲ دقیقه پیش" },
  { type: "CNAME", name: "www", value: "example.com", ttl: "3600", status: "ok", last: "۲ دقیقه پیش" },
  { type: "MX", name: "@", value: "mail.example.com (priority 10)", ttl: "3600", status: "ok", last: "۵ دقیقه پیش" },
  { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: "3600", status: "ok", last: "۵ دقیقه پیش" },
  { type: "NS", name: "@", value: "ns1.example.com, ns2.example.com", ttl: "86400", status: "ok", last: "۱ ساعت پیش" },
].map((r) => ({ ...r, tone: r.status === "ok" ? "success" : "warning", statusLabel: r.status === "ok" ? "سالم" : "هشدار" }));

export const DNS_CHANGE = {
  detected: "۱۰ دقیقه پیش",
  previous: "91.198.174.10",
  current: "91.198.174.20",
  record: "A @",
};

export const DNS_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  time: `${toFa(i * 2)} ساعت پیش`,
  event: i === 5 ? "تغییر رکورد A" : "بررسی معمول",
  status: i === 5 ? "changed" : "ok",
}));

export const CACHE = [
  { name: "Page Cache", status: "active", label: "فعال", tone: "success", detail: "WP Rocket · کش صفحه فعال است." },
  { name: "Object Cache", status: "active", label: "فعال", tone: "success", detail: "Memcached · 64MB اختصاص یافته." },
  { name: "Redis", status: "inactive", label: "غیرفعال", tone: "warning", detail: "Redis نصب نشده است." },
  { name: "Memcached", status: "active", label: "فعال", tone: "success", detail: "سرور Memcached متصل است." },
  { name: "OPcache", status: "active", label: "فعال", tone: "success", detail: "PHP OPcache با 128MB حافظه." },
  { name: "Browser Cache", status: "active", label: "فعال", tone: "success", detail: "Cache-Control headers تنظیم شده." },
  { name: "CDN", status: "unknown", label: "شناسایی نشد", tone: "info", detail: "هیچ CDN شناسایی نشد." },
];

export const EMAIL = {
  cards: [
    { label: "Emails Sent Today", value: toFa(284), tone: "primary" },
    { label: "Failed Emails", value: toFa(6), tone: "danger" },
    { label: "Last Successful", value: "۲ دقیقه پیش", tone: "success" },
    { label: "Last Failure", value: "۱ ساعت پیش", tone: "warning" },
  ],
  wpMail: "فعال",
  smtp: "فعال",
  provider: "SMTP: mail.example.com (Port 587)",
  events: [
    { time: "۱۴:۲۲", recipient: "u***@example.com", type: "Order", status: "success", error: "—" },
    { time: "۱۴:۱۸", recipient: "a***@gmail.com", type: "Reset", status: "success", error: "—" },
    { time: "۱۴:۰۵", recipient: "n***@yahoo.com", type: "Newsletter", status: "failed", error: "SMTP timeout" },
    { time: "۱۳:۵۰", recipient: "s***@example.com", type: "Order", status: "success", error: "—" },
    { time: "۱۳:۳۲", recipient: "b***@gmail.com", type: "Notification", status: "failed", error: "Mailbox full" },
    { time: "۱۳:۱۰", recipient: "m***@outlook.com", type: "Welcome", status: "success", error: "—" },
  ],
};

export const SEO = {
  checks: [
    { name: "robots.txt", status: "healthy", label: "Healthy", tone: "success", detail: "فایل robots.txt قابل دسترس است." },
    { name: "sitemap.xml", status: "healthy", label: "Healthy", tone: "success", detail: "sitemap.xml معتبر است." },
    { name: "WordPress Sitemap", status: "healthy", label: "Healthy", tone: "success", detail: "Sitemap هسته وردپرس فعال است." },
    { name: "Sitemap URLs", status: "warning", label: "Warning", tone: "warning", detail: "۳ URL شکسته در Sitemap." },
    { name: "Broken Sitemap URLs", status: "warning", label: "Warning", tone: "warning", detail: "۳ URL با خطای 404." },
    { name: "Blocked Important Pages", status: "healthy", label: "Healthy", tone: "success", detail: "هیچ صفحه مهمی مسدود نیست." },
  ],
  sitemap: {
    total: toFa(482),
    valid: toFa(476),
    redirect: toFa(3),
    notFound: toFa(2),
    serverError: toFa(1),
  },
};

export const SECURITY_HEADERS = [
  { name: "HTTPS", status: "passed", label: "Passed", tone: "success", value: "فعال" },
  { name: "HSTS", status: "passed", label: "Passed", tone: "success", value: "max-age=31536000" },
  { name: "Content-Security-Policy", status: "weak", label: "Weak", tone: "warning", value: "default-src 'self'" },
  { name: "X-Frame-Options", status: "passed", label: "Passed", tone: "success", value: "SAMEORIGIN" },
  { name: "X-Content-Type-Options", status: "passed", label: "Passed", tone: "success", value: "nosniff" },
  { name: "Referrer-Policy", status: "missing", label: "Missing", tone: "danger", value: "—" },
  { name: "Permissions-Policy", status: "missing", label: "Missing", tone: "danger", value: "—" },
];

export const SECURITY_GRADE = "B+";

export const INFRA_SUMMARY = [
  { slug: "infrastructure", label: "SSL و دامنه", icon: "faLock", tone: "success", status: "سالم" },
  { slug: "infrastructure", label: "DNS", icon: "faNetworkWired", tone: "warning", status: "تغییر شناسایی شد" },
  { slug: "infrastructure", label: "Cache", icon: "faLayerGroup", tone: "success", status: "۶ از ۷ فعال" },
  { slug: "infrastructure", label: "Email", icon: "faEnvelope", tone: "warning", status: "۶ خطا امروز" },
  { slug: "external", label: "External APIs", icon: "faPlug", tone: "warning", status: "۱ سرویس خطادار" },
  { slug: "infrastructure", label: "Sitemap", icon: "faMap", tone: "warning", status: "۳ URL شکسته" },
];