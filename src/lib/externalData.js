// Mock data for external services monitoring. All values are simulated.

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

function chart(seed, base, variance) {
  return hours.map((h, i) => ({
    h,
    ms: Math.round(base + Math.sin(i / 2 + seed) * variance + (Math.random() - 0.5) * variance * 0.4),
  }));
}

export const SERVICES = [
  {
    id: "pay", name: "درگاه پرداخت", provider: "زرین‌پال", endpoint: "api.zarinpal.com",
    status: "healthy", statusLabel: "سالم", http: 200, responseTime: 280, avg: 312, uptime: 99.98, failures: 2,
    lastCheck: "۱ دقیقه پیش", lastSuccess: "۱ دقیقه پیش", lastFailed: "۳ ساعت پیش",
    chart: chart(1, 300, 80), timeline: "up",
  },
  {
    id: "sms", name: "SMS Provider", provider: "ملی پیامک", endpoint: "api.melipayamak.com",
    status: "healthy", statusLabel: "سالم", http: 200, responseTime: 240, avg: 268, uptime: 99.95, failures: 1,
    lastCheck: "۲ دقیقه پیش", lastSuccess: "۲ دقیقه پیش", lastFailed: "۵ ساعت پیش",
    chart: chart(2, 260, 60), timeline: "up",
  },
  {
    id: "ship", name: "Shipping API", provider: "چاپار", endpoint: "api.chapar.com",
    status: "slow", statusLabel: "کند", http: 200, responseTime: 980, avg: 640, uptime: 99.40, failures: 4,
    lastCheck: "۱ دقیقه پیش", lastSuccess: "۱ دقیقه پیش", lastFailed: "۲۰ دقیقه پیش",
    chart: chart(3, 700, 200), timeline: "warn",
  },
  {
    id: "google", name: "Google API", provider: "Google", endpoint: "www.googleapis.com",
    status: "healthy", statusLabel: "سالم", http: 200, responseTime: 190, avg: 210, uptime: 99.99, failures: 0,
    lastCheck: "۱ دقیقه پیش", lastSuccess: "۱ دقیقه پیش", lastFailed: "—",
    chart: chart(4, 200, 50), timeline: "up",
  },
  {
    id: "license", name: "License Server", provider: "Custom", endpoint: "license.example.com",
    status: "error", statusLabel: "خطادار", http: 503, responseTime: 0, avg: 540, uptime: 98.20, failures: 9,
    lastCheck: "۳۰ ثانیه پیش", lastSuccess: "۴۵ دقیقه پیش", lastFailed: "۳۰ ثانیه پیش",
    chart: chart(5, 500, 150), timeline: "down",
  },
  {
    id: "custom", name: "Custom API", provider: "Internal", endpoint: "api.internal.local",
    status: "healthy", statusLabel: "سالم", http: 200, responseTime: 120, avg: 135, uptime: 99.97, failures: 1,
    lastCheck: "۱ دقیقه پیش", lastSuccess: "۱ دقیقه پیش", lastFailed: "۱ روز پیش",
    chart: chart(6, 130, 40), timeline: "up",
  },
];

export const SUMMARY = {
  total: SERVICES.length,
  healthy: SERVICES.filter((s) => s.status === "healthy").length,
  slow: SERVICES.filter((s) => s.status === "slow").length,
  error: SERVICES.filter((s) => s.status === "error").length,
  avgResponse: Math.round(SERVICES.filter((s) => s.responseTime > 0).reduce((a, s) => a + s.responseTime, 0) / SERVICES.filter((s) => s.responseTime > 0).length),
};

export const FAILURES = {
  pay: [
    { time: "۰۳:۱۲", http: 504, ms: 5200, error: "Gateway Timeout" },
    { time: "۰۱:۴۸", http: 500, ms: 180, error: "Internal Server Error" },
  ],
  sms: [{ time: "۲۲:۳۰", http: 503, ms: 0, error: "Service Unavailable" }],
  ship: [
    { time: "۱۴:۰۲", http: 504, ms: 4100, error: "Gateway Timeout" },
    { time: "۱۳:۱۰", http: 502, ms: 2200, error: "Bad Gateway" },
    { time: "۱۲:۴۵", http: 500, ms: 980, error: "Internal Server Error" },
    { time: "۱۱:۲۰", http: 504, ms: 3800, error: "Gateway Timeout" },
  ],
  google: [],
  license: [
    { time: "۰۰:۳۸", http: 503, ms: 0, error: "Service Unavailable" },
    { time: "۰۰:۳۵", http: 503, ms: 0, error: "Service Unavailable" },
    { time: "۰۰:۳۰", http: 502, ms: 0, error: "Bad Gateway" },
  ],
  custom: [{ time: "دیروز ۱۹:۰۰", http: 500, ms: 240, error: "Internal Server Error" }],
};

// 14-day uptime timeline (mock): up / warn / down
export const UPTIME_TIMELINE = {
  pay: ["up", "up", "up", "up", "up", "up", "up", "up", "warn", "up", "up", "up", "up", "up"],
  sms: ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "warn", "up", "up", "up"],
  ship: ["up", "warn", "warn", "up", "up", "warn", "up", "up", "up", "warn", "warn", "up", "warn", "up"],
  google: ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up"],
  license: ["up", "up", "up", "up", "warn", "down", "down", "warn", "up", "up", "down", "down", "down", "down"],
  custom: ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "warn"],
};