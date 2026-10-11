import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock, faListCheck, faTriangleExclamation, faCircleXmark, faHourglassHalf, faForward,
  faMagnifyingGlass, faEye, faCircleExclamation, faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, StatCard, toFa } from "@/components/yguard/ui";
import { CronDrawer } from "@/components/yguard/cron/CronDrawer";
import { KPIS, TASKS, FILTERS, SOURCE_FILTERS, WOO_ACTIONS, CRON_HEALTH } from "@/lib/cronData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap = { faListCheck, faClock, faTriangleExclamation, faCircleXmark, faHourglassHalf, faForward };

export default function Cron() {
  const group = findGroup("cron");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [source, setSource] = useState("all");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hook, setHook] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => TASKS.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (source !== "all" && t.source !== source) return false;
    if (query && !t.hook.includes(query)) return false;
    return true;
  }), [filter, source, query]);

  const open = (t) => { setHook(t.hook); setDrawerOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faClock} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Cron و وظایف زمان‌بندی‌شده</h1>
            <p className="text-[13px] text-muted-foreground">مانیتور اجرای WP-Cron و Scheduled Tasks</p>
          </div>
        </div>
        <button onClick={() => toast.success("همه وظایف بررسی شدند")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
          <FontAwesomeIcon icon={faForward} className="text-xs" /> بررسی همه
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {KPIS.map((k) => <StatCard key={k.id} icon={iconMap[k.icon] || faClock} tone={k.tone} label={k.label} value={toFa(k.value)} />)}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">وضعیت WP-Cron</div>
            <div className="mt-1 text-[12px] text-warning">{CRON_HEALTH.warning}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{CRON_HEALTH.recommendation}</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { l: "آخرین اجرای موفق", v: CRON_HEALTH.lastSuccess },
            { l: "آخرین خطا", v: CRON_HEALTH.lastFailure },
            { l: "Loopback", v: CRON_HEALTH.loopback },
            { l: "تأخیر", v: CRON_HEALTH.delay },
            { l: "Server Cron", v: "پیشنهاد می‌شود" },
          ].map((f) => (
            <div key={f.l} className="rounded-lg border border-border bg-muted/40 p-2.5">
              <div className="text-[10px] text-muted-foreground">{f.l}</div>
              <div className="mt-0.5 text-[12px] font-medium">{f.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", filter === f.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}>{f.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={source} onChange={(e) => setSource(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-2 text-[12px] outline-none focus:border-primary/40">
            {SOURCE_FILTERS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div className="relative">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی Hook..." dir="ltr" style={{ textAlign: "right" }} className="h-9 w-48 rounded-lg border border-border bg-background pr-9 pl-3 font-mono text-[12px] outline-none focus:border-primary/40" />
          </div>
        </div>
      </div>

      <Panel>
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-right font-semibold">Hook</th>
                <th className="px-4 py-2.5 text-right font-semibold">Source</th>
                <th className="px-4 py-2.5 text-right font-semibold">Schedule</th>
                <th className="px-4 py-2.5 text-right font-semibold">Next Run</th>
                <th className="px-4 py-2.5 text-right font-semibold">Last Run</th>
                <th className="px-4 py-2.5 text-right font-semibold">Duration</th>
                <th className="px-4 py-2.5 text-right font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="p-4"><div className="h-4 rounded bg-muted animate-pulse" /></td></tr>
              ))}
              {!loading && filtered.map((t) => (
                <tr key={t.hook} className="cursor-pointer hover:bg-muted/40" onClick={() => open(t)}>
                  <td className="px-4 py-3 font-mono font-semibold" dir="ltr" style={{ textAlign: "right" }}>{t.hook}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.source}</td>
                  <td className="px-4 py-3 font-mono text-[12px]" dir="ltr">{t.schedule}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.next}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.last}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{t.dur}</td>
                  <td className="px-4 py-3"><Pill tone={t.tone}>{t.statusLabel}</Pill></td>
                  <td className="px-4 py-3">
                    <button onClick={(e) => { e.stopPropagation(); open(t); }} className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[11px] font-medium hover:bg-muted">
                      <FontAwesomeIcon icon={faEye} className="text-[10px]" /> جزئیات
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <FontAwesomeIcon icon={faClock} className="text-3xl text-muted-foreground/40" />
              <div className="text-[13px] font-medium">وظیفه‌ای یافت نشد</div>
            </div>
          )}
        </div>
      </Panel>

      <Panel title="WooCommerce Scheduled Actions" action={<Pill tone="info">WooCommerce</Pill>}>
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          {WOO_ACTIONS.cards.map((c) => (
            <div key={c.label} className={cn("rounded-lg border border-border bg-muted/40 p-3 text-center", c.tone === "danger" && "border-destructive/30", c.tone === "warning" && "border-warning/30")}>
              <div className={cn("text-xl font-extrabold", c.tone === "danger" && "text-destructive", c.tone === "warning" && "text-warning", c.tone === "success" && "text-success", c.tone === "info" && "text-info")}>{c.value}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/60 text-[10px] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-right font-semibold">Hook</th>
                <th className="px-3 py-2 text-right font-semibold">Group</th>
                <th className="px-3 py-2 text-right font-semibold">Status</th>
                <th className="px-3 py-2 text-right font-semibold">Scheduled Date</th>
                <th className="px-3 py-2 text-right font-semibold">Attempts</th>
                <th className="px-3 py-2 text-right font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {WOO_ACTIONS.rows.map((r, i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="px-3 py-2 font-mono" dir="ltr" style={{ textAlign: "right" }}>{r.hook}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr">{r.group}</td>
                  <td className="px-3 py-2"><Pill tone={r.tone}>{r.statusLabel}</Pill></td>
                  <td className="px-3 py-2 text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-2 font-mono" dir="ltr">{r.attempts}</td>
                  <td className="px-3 py-2 font-mono" dir="ltr">{r.dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <CronDrawer open={drawerOpen} onOpenChange={setDrawerOpen} hook={hook} />
    </div>
  );
}