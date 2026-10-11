import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartPulse, faRotate, faMagnifyingGlass, faCode, faServer, faDatabase, faPlug,
  faClock, faLock, faGlobe, faEnvelope, faLayerGroup, faPaperPlane, faCircleCheck, faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import { DiagnosticRow } from "@/components/yguard/health/DiagnosticRow";
import {
  HEALTH_SCORE, HEALTH_SUMMARY, DIAGNOSTICS, STORAGE, REST_ENDPOINTS, LOOPBACK,
  CRON, SSL, DNS, EMAIL, CACHE,
} from "@/lib/siteHealthData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const summaryIcons = { faCode, faServer, faDatabase, faPlug, faClock, faLock, faGlobe };

const FILTERS = [
  { id: "all", label: "همه" },
  { id: "critical", label: "بحرانی" },
  { id: "warning", label: "هشدار" },
  { id: "success", label: "موفق" },
  { id: "info", label: "نیازمند بررسی" },
];

function InfoField({ label, value, ltr, tone }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono", tone)} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>
        {value}
      </div>
    </div>
  );
}

export default function SiteHealth() {
  const group = findGroup("site-health");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    return DIAGNOSTICS.filter((d) => {
      if (filter !== "all" && d.severity !== filter) return false;
      if (query && !d.label.toLowerCase().includes(query.toLowerCase()) && !d.section.includes(query)) return false;
      return true;
    });
  }, [filter, query]);

  const sections = ["WordPress", "PHP", "Server", "Database"];
  const bySection = (sec) => filtered.filter((d) => d.section === sec);

  const sendTestEmail = () => {
    setSending(true);
    toast.message("ارسال ایمیل آزمایشی...");
    setTimeout(() => {
      setSending(false);
      toast.success("ایمیل آزمایشی ارسال شد — صندوق ورودی را بررسی کنید");
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faHeartPulse} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">سلامت سایت</h1>
            <p className="text-[13px] text-muted-foreground">{group ? `${group.title} · ` : ""}وضعیت سلامت هسته، سرور و زیرساخت</p>
          </div>
        </div>
        <button onClick={() => toast.success("بروزرسانی شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
          <FontAwesomeIcon icon={faRotate} className="text-xs" /> بروزرسانی
        </button>
      </div>

      {/* Score + summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="امتیاز سلامت سایت" className="lg:col-span-1">
          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(var(--muted))" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(var(--success))" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(HEALTH_SCORE.score / 100) * 264} 264`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold">{toFa(HEALTH_SCORE.score)}</span>
                <span className="text-[10px] text-muted-foreground">از ۱۰۰</span>
              </div>
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground">وضعیت</div>
              <div className="mt-1"><Pill tone="success"><FontAwesomeIcon icon={faCircleCheck} /> {HEALTH_SCORE.status}</Pill></div>
            </div>
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-2">
          {HEALTH_SUMMARY.map((c) => {
            const Icon = summaryIcons[c.icon];
            return (
              <div key={c.key} className="rounded-xl border border-border bg-card p-3 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{c.label}</span>
                  {Icon && <FontAwesomeIcon icon={Icon} className={cn("text-sm", c.tone === "warning" ? "text-warning" : "text-success")} />}
                </div>
                <div className="mt-1 text-sm font-bold" dir="ltr">{c.value}</div>
                <div className="mt-1.5"><Pill tone={c.tone}>{c.status}</Pill></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                filter === f.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی diagnostic..."
            className="h-9 w-56 rounded-lg border border-border bg-background pr-9 pl-3 text-[13px] outline-none focus:border-primary/40"
          />
        </div>
      </div>

      {/* Diagnostic sections */}
      {sections.map((sec) => {
        const rows = bySection(sec);
        if (rows.length === 0) return null;
        return (
          <Panel key={sec} title={sec} action={<Pill tone="primary">{toFa(rows.length)} مورد</Pill>}>
            <div className="grid gap-2.5 lg:grid-cols-2">
              {rows.map((d) => (
                <DiagnosticRow key={d.label} {...d} />
              ))}
            </div>
          </Panel>
        );
      })}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-[13px] text-muted-foreground">
          نتیجه‌ای یافت نشد.
        </div>
      )}

      {/* REST API */}
      <Panel title="REST API" action={<Pill tone="success">در دسترس</Pill>}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-2.5">
            <InfoField label="وضعیت REST API" value="در دسترس" tone="text-success" />
            <InfoField label="زمان پاسخ" value="۱۲۰ms" ltr />
            <InfoField label="آخرین بررسی" value="۲ دقیقه پیش" />
            <InfoField label="Loopback" value={LOOPBACK.status} tone="text-success" />
          </div>
          <div className="-mx-5 -my-5 overflow-x-auto lg:my-0 lg:mx-0">
            <table className="w-full text-[13px]">
              <thead className="bg-muted/60 text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-right font-semibold">Endpoint</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-right font-semibold">زمان پاسخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {REST_ENDPOINTS.map((e) => (
                  <tr key={e.endpoint} className="hover:bg-muted/40">
                    <td className="px-4 py-2.5 font-mono text-[12px]" dir="ltr" style={{ textAlign: "right" }}>{e.endpoint}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn("font-mono font-semibold", e.ok ? "text-success" : "text-destructive")}>{e.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground" dir="ltr">{e.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      {/* Cron + SSL + DNS */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="WP Cron" action={<Pill tone={CRON.ok ? "success" : "warning"}>{CRON.status}</Pill>}>
          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between"><span className="text-muted-foreground">آخرین اجرای موفق</span><span className="font-medium">{CRON.lastRun}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">کارهای تأخیری</span><Pill tone="warning">{toFa(CRON.delayed)}</Pill></div>
            <div className="flex justify-between"><span className="text-muted-foreground">کارهای ناموفق</span><Pill tone="danger">{toFa(CRON.failed)}</Pill></div>
            <div className="flex justify-between"><span className="text-muted-foreground">رویداد بعدی</span><span className="font-mono text-[12px]" dir="ltr">{CRON.nextEvent}</span></div>
          </div>
        </Panel>

        <Panel title="SSL" action={<Pill tone={SSL.ok ? "success" : "danger"}>{SSL.status}</Pill>}>
          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between"><span className="text-muted-foreground">صادرکننده</span><span className="font-medium" dir="ltr">{SSL.issuer}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">معتبر از</span><span>{SSL.validFrom}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">انقضا</span><span>{SSL.expires}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">روزهای باقی‌مانده</span><Pill tone="success">{toFa(SSL.daysRemaining)} روز</Pill></div>
          </div>
        </Panel>

        <Panel title="DNS" action={<Pill tone={DNS.ok ? "success" : "danger"}>{DNS.status}</Pill>}>
          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between"><span className="text-muted-foreground">A Record</span><span className="font-mono text-[12px]" dir="ltr">{DNS.a}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">AAAA</span><span className="font-mono text-[12px]" dir="ltr">{DNS.aaaa}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">MX</span><span className="font-mono text-[12px]" dir="ltr">{DNS.mx}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">NS</span><span className="font-mono text-[12px]" dir="ltr">{DNS.ns}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">آخرین تغییر</span><span className="text-[12px]">{DNS.lastChange}</span></div>
          </div>
        </Panel>
      </div>

      {/* Email + Cache + Storage */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Email" action={<Pill tone="warning">هشدار</Pill>}>
          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between"><span className="text-muted-foreground">WordPress Mail</span><span className="font-medium">{EMAIL.mail}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">SMTP</span><Pill tone="warning">{EMAIL.smtp}</Pill></div>
            <div className="flex justify-between"><span className="text-muted-foreground">آخرین ایمیل موفق</span><span>{EMAIL.lastSuccess}</span></div>
            <div className="flex justify-between gap-2"><span className="text-muted-foreground shrink-0">آخرین ایمیل ناموفق</span><span className="text-left text-[12px] text-destructive">{EMAIL.lastFailed}</span></div>
          </div>
          <button
            onClick={sendTestEmail}
            disabled={sending}
            className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-brand text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" /> {sending ? "در حال ارسال..." : "ارسال ایمیل آزمایشی"}
          </button>
        </Panel>

        <Panel title="Cache">
          <div className="space-y-2">
            {CACHE.map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-[13px]">
                <span className="font-medium">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-muted-foreground" dir="ltr">{c.value}</span>
                  <Pill tone={c.tone}>{c.status}</Pill>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="ذخیره‌سازی دیسک">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] text-muted-foreground">استفاده‌شده</div>
                <div className="text-2xl font-extrabold text-warning">{toFa(STORAGE.used)}٪</div>
              </div>
              <div className="text-left text-[12px] text-muted-foreground">
                <div>کل: <span className="font-mono text-foreground" dir="ltr">{toFa(STORAGE.total)} {STORAGE.unit}</span></div>
                <div>آزاد: <span className="font-mono text-success" dir="ltr">{toFa(STORAGE.free)} {STORAGE.unit}</span></div>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-warning" style={{ width: `${STORAGE.used}%` }} />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 p-2.5 text-[12px] text-warning">
              <FontAwesomeIcon icon={faCircleXmark} className="text-xs" />
              فضای دیسک رو به اتمام است — پاک‌سازی بکاپ‌های قدیمی پیشنهاد می‌شود.
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}