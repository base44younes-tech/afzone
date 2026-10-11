import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved, faBolt, faServer, faCircleCheck, faTriangleExclamation, faCircleXmark,
  faDatabase, faClock, faPlug, faGlobe, faLock, faEnvelope, faLayerGroup, faCubes,
  faHeartPulse, faGaugeHigh, faBan, faBug, faPlay, faCode,
} from "@fortawesome/free-solid-svg-icons";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, StatCard, Pill, IconBadge, toFa } from "@/components/yguard/ui";

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
const axis = { fontSize: 11, fill: "oklch(var(--muted-foreground))" };

const hours = ["۰۰", "۰۲", "۰۴", "۰۶", "۰۸", "۱۰", "۱۲", "۱۴", "۱۶", "۱۸", "۲۰", "۲۲"];
const response = hours.map((h, i) => ({ h, ms: [390, 360, 340, 355, 420, 480, 520, 610, 470, 440, 455, 410][i], p95: [620, 590, 560, 600, 710, 820, 900, 1120, 830, 760, 780, 690][i] }));
const traffic = hours.map((h, i) => ({ h, req: [1200, 800, 600, 700, 2100, 3400, 3900, 4200, 3700, 3300, 2900, 1900][i] }));

const subScores = [
  { label: "سلامت سایت", value: 96, icon: faHeartPulse, tone: "success" },
  { label: "امنیت", value: 89, icon: faShieldHalved, tone: "primary" },
  { label: "Performance", value: 82, icon: faGaugeHigh, tone: "warning" },
];

const alerts = [
  { id: 1, tone: "danger", icon: faCircleXmark, title: "صفحه اصلی پاسخ 503 می‌دهد", desc: "۳ بار در ۱۰ دقیقه گذشته — احتمال اتمام PHP Workers", time: "۴ دقیقه پیش" },
  { id: 2, tone: "danger", icon: faBan, title: "حمله Request Flood از یک IP", desc: "۴٬۸۲۰ درخواست از 91.108.4.17 در ۲ دقیقه — موقتاً مسدود شد", time: "۱۲ دقیقه پیش" },
  { id: 3, tone: "warning", icon: faBug, title: "فایل PHP جدید در uploads", desc: "wp-content/uploads/2026/10/cache-x.php شناسایی شد", time: "۳۸ دقیقه پیش" },
  { id: 4, tone: "warning", icon: faClock, title: "WP Cron اجرا نشده", desc: "آخرین اجرای موفق ۲ ساعت و ۱۵ دقیقه پیش بوده است", time: "۱ ساعت پیش" },
];

const health = [
  { name: "WordPress", icon: faCode, value: "6.6.2", tone: "success", status: "به‌روز" },
  { name: "PHP", icon: faServer, value: "8.2.12", tone: "success", status: "سالم" },
  { name: "Database", icon: faDatabase, value: "MariaDB 10.11 · ۱۸۴MB", tone: "success", status: "سالم" },
  { name: "REST API", icon: faPlug, value: "۱۲۰ms", tone: "success", status: "در دسترس" },
  { name: "WP Cron", icon: faClock, value: "۲ ساعت تأخیر", tone: "danger", status: "مشکل" },
  { name: "SSL", icon: faLock, value: "۶۴ روز تا انقضا", tone: "success", status: "معتبر" },
  { name: "DNS", icon: faGlobe, value: "Cloudflare · ۱۸ms", tone: "success", status: "سالم" },
  { name: "Email", icon: faEnvelope, value: "SPF ✓ · DKIM ✗", tone: "warning", status: "هشدار" },
  { name: "Page Cache", icon: faLayerGroup, value: "Hit rate ۸۸٪", tone: "success", status: "فعال" },
  { name: "Object Cache", icon: faCubes, value: "غیرفعال", tone: "warning", status: "پیشنهادی" },
];

const activity = [
  { tone: "primary", icon: faPlay, title: "چکاپ سریع انجام شد — امتیاز ۹۴", by: "سیستم", time: "۸ دقیقه پیش" },
  { tone: "danger", icon: faBan, title: "IP 91.108.4.17 مسدود شد", by: "فایروال", time: "۱۲ دقیقه پیش" },
  { tone: "info", icon: faShieldHalved, title: "ورود موفق مدیر از تهران", by: "admin@example.com", time: "۴۰ دقیقه پیش" },
  { tone: "success", icon: faDatabase, title: "بکاپ روزانه دیتابیس ایجاد شد", by: "سیستم", time: "۲ ساعت پیش" },
  { tone: "warning", icon: faPlug, title: "افزونه Elementor به نسخه 3.24 به‌روزرسانی شد", by: "سارا محمدی", time: "۵ ساعت پیش" },
];

const toneText = { success: "text-success", warning: "text-warning", danger: "text-destructive", primary: "text-primary", info: "text-info" };

export default function Dashboard() {
  const navigate = useNavigate();
  const [done, setDone] = useState({});
  const score = 94;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">مرکز کنترل سایت</h1>
          <p className="text-[13px] text-muted-foreground">نمای کلی سلامت، امنیت و عملکرد وب‌سایت</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast("چکاپ سریع شروع شد…")}>
            <FontAwesomeIcon icon={faBolt} className="ml-1" /> چکاپ سریع
          </Button>
          <Button onClick={() => navigate("/full-checkup")}>
            <FontAwesomeIcon icon={faPlay} className="ml-1" /> شروع چکاپ کامل
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-card px-5 py-3 text-[13px] shadow-card">
        <span className="flex items-center gap-2 font-bold"><FontAwesomeIcon icon={faGlobe} className="text-primary" /><span dir="ltr">example.com</span></span>
        <Pill tone="info"><FontAwesomeIcon icon={faCode} /> WordPress 6.x</Pill>
        <Pill tone="primary"><FontAwesomeIcon icon={faServer} /> PHP 8.x</Pill>
        <Pill tone="success"><FontAwesomeIcon icon={faLock} /> HTTPS فعال</Pill>
        <span className="ms-auto text-muted-foreground"><FontAwesomeIcon icon={faClock} className="me-1" /> آخرین چکاپ: ۸ دقیقه پیش</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={faCircleCheck} tone="success" label="موارد سالم" value={toFa(42)} delta="سالم" />
        <StatCard icon={faTriangleExclamation} tone="warning" label="نیازمند توجه" value={toFa(5)} delta="هشدار" />
        <StatCard icon={faCircleXmark} tone="danger" label="بحرانی" value={toFa(2)} delta="بحرانی" />
        <StatCard icon={faBolt} tone="primary" label="میانگین پاسخ" value="۴۱۲ms" hint="۲۴ ساعت" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="وضعیت کلی سایت" className="lg:col-span-1">
          <div className="flex items-center gap-5">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(var(--muted))" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(var(--success))" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(score / 100) * 264} 264`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold">{toFa(score)}</span>
                <span className="text-[11px] text-muted-foreground">از ۱۰۰</span>
              </div>
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground">وضعیت</div>
              <div className="mt-1"><Pill tone="success"><FontAwesomeIcon icon={faCircleCheck} /> خوب</Pill></div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {subScores.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">{toFa(s.value)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className={`h-full rounded-full ${s.tone === "success" ? "bg-success" : s.tone === "warning" ? "bg-warning" : "bg-primary"}`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="زمان پاسخ سرور (ms)" className="lg:col-span-2" action={<Pill tone="info">۲۴ ساعت</Pill>}>
          <div className="h-56" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={response} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" vertical={false} />
                <XAxis dataKey="h" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} labelStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="p95" stroke="oklch(var(--warning))" strokeWidth={1.5} fill="none" name="p95" />
                <Area type="monotone" dataKey="ms" stroke="oklch(var(--primary))" strokeWidth={2} fill="url(#gMs)" name="میانگین" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="ترافیک درخواست‌ها" className="lg:col-span-2">
          <div className="h-52" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={traffic} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" vertical={false} />
                <XAxis dataKey="h" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} labelStyle={{ fontSize: 11 }} />
                <Bar dataKey="req" fill="oklch(var(--primary))" radius={[3, 3, 0, 0]} name="درخواست" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="هشدارهای فعال" action={<Pill tone="danger">{toFa(alerts.length)} فعال</Pill>}>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="flex gap-3">
                <FontAwesomeIcon icon={a.icon} className={`mt-0.5 ${toneText[a.tone]}`} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">{a.desc}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{a.time}</div>
                </div>
                {!done[a.id] && (
                  <button
                    onClick={() => { setDone((d) => ({ ...d, [a.id]: true })); toast.success("هشدار حل‌شده علامت خورد"); }}
                    className="h-7 shrink-0 rounded-md border border-border px-2 text-[11px] text-muted-foreground hover:bg-muted"
                  >
                    حل شد
                  </button>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="اجزای سایت" className="lg:col-span-2">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {health.map((h) => (
              <div key={h.name} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                <IconBadge icon={h.icon} tone={h.tone} className="h-9 w-9 text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">{h.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground" dir="ltr">{h.value}</div>
                </div>
                <Pill tone={h.tone}>{h.status}</Pill>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="فعالیت‌های اخیر">
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <FontAwesomeIcon icon={a.icon} className={`mt-0.5 ${toneText[a.tone]}`} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">{a.by} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}