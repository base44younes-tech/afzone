import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines, faLink, faCircleCheck, faShare, faCircleExclamation, faCircleXmark, faClock, faGaugeHigh,
  faMagnifyingGlass, faEye, faRotate, faPlus, faStar, faEyeSlash, faBellSlash, faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, StatCard, toFa } from "@/components/yguard/ui";
import { PageDrawer } from "@/components/yguard/pages/PageDrawer";
import { PAGE_KPIS, PAGES, PAGE_FILTERS, PAGE_TYPES, RESPONSE_FILTERS, httpTone } from "@/lib/pagesData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap = { faLink, faCircleCheck, faShare, faCircleExclamation, faCircleXmark, faClock, faGaugeHigh };

const httpLabel = (s) => (s === 0 ? "Timeout" : toFa(s));

function speedClass(ms) {
  if (ms < 300) return { label: "Fast", tone: "success" };
  if (ms < 800) return { label: "Normal", tone: "info" };
  if (ms < 2000) return { label: "Slow", tone: "warning" };
  return { label: "Very Slow", tone: "danger" };
}

export default function Pages() {
  const group = findGroup("pages");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [type, setType] = useState("all");
  const [speed, setSpeed] = useState("all");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [url, setUrl] = useState(null);
  const [menu, setMenu] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => PAGES.filter((p) => {
    if (filter !== "all") {
      if (filter === "3xx" && !(p.status >= 300 && p.status < 400)) return false;
      if (filter === "timeout" && p.status !== 0) return false;
      if (filter !== "3xx" && filter !== "timeout" && p.status !== parseInt(filter)) return false;
    }
    if (type !== "all" && p.type !== type) return false;
    if (speed !== "all") {
      const s = speedClass(p.ms);
      const map = { fast: "Fast", normal: "Normal", slow: "Slow", vslow: "Very Slow" };
      if (s.label !== map[speed]) return false;
    }
    if (query && !p.url.includes(query)) return false;
    return true;
  }), [filter, type, speed, query]);

  const open = (p) => { setUrl(p.url); setDrawerOpen(true); setMenu(null); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faFileLines} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">مانیتور صفحات</h1>
            <p className="text-[13px] text-muted-foreground">بررسی وضعیت HTTP، سرعت پاسخ و دردسترس‌بودن صفحات سایت</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success("بررسی همه صفحات شروع شد")} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            <FontAwesomeIcon icon={faRotate} className="text-xs" /> بررسی همه صفحات
          </button>
          <button onClick={() => toast("افزودن URL")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faPlus} className="text-xs" /> افزودن URL
          </button>
          <button onClick={() => toast("مدیریت صفحات حیاتی")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faStar} className="text-xs" /> صفحات حیاتی
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PAGE_KPIS.map((k) => <StatCard key={k.id} icon={iconMap[k.icon] || faLink} tone={k.tone} label={k.label} value={toFa(k.value)} />)}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی URL..." dir="ltr" style={{ textAlign: "right" }} className="h-9 w-56 rounded-lg border border-border bg-background pr-9 pl-3 font-mono text-[12px] outline-none focus:border-primary/40" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-2 text-[12px] outline-none focus:border-primary/40">
          {PAGE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <select value={speed} onChange={(e) => setSpeed(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-2 text-[12px] outline-none focus:border-primary/40">
          {RESPONSE_FILTERS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <div className="h-5 w-px bg-border" />
        <div className="flex flex-wrap gap-1">
          {PAGE_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={cn("rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors", filter === f.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}>{f.label}</button>
          ))}
        </div>
      </div>

      <Panel>
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-right font-semibold">URL</th>
                <th className="px-4 py-2.5 text-right font-semibold">نوع صفحه</th>
                <th className="px-4 py-2.5 text-right font-semibold">HTTP Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Response Time</th>
                <th className="px-4 py-2.5 text-right font-semibold">Redirect</th>
                <th className="px-4 py-2.5 text-right font-semibold">آخرین بررسی</th>
                <th className="px-4 py-2.5 text-right font-semibold">Monitoring</th>
                <th className="px-4 py-2.5 text-right font-semibold">وضعیت</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={9} className="p-4"><div className="h-4 rounded bg-muted animate-pulse" /></td></tr>
              ))}
              {!loading && filtered.map((p) => {
                const sp = speedClass(p.ms);
                return (
                  <tr key={p.url} className="cursor-pointer hover:bg-muted/40" onClick={() => open(p)}>
                    <td className="px-4 py-3 font-mono font-semibold" dir="ltr" style={{ textAlign: "right" }}>{p.url}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                    <td className="px-4 py-3"><Pill tone={httpTone[p.status]}>{httpLabel(p.status)}</Pill></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono" dir="ltr">{p.ms >= 1000 ? `${(p.ms / 1000).toFixed(1)}s` : `${toFa(p.ms)}ms`}</span>
                        <Pill tone={sp.tone}>{sp.label}</Pill>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{p.redirect}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.last}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex h-2 w-2 rounded-full", p.monitoring ? "bg-success" : "bg-muted-foreground/30")} />
                    </td>
                    <td className="px-4 py-3"><Pill tone={httpTone[p.status]}>{p.status === 200 ? "سالم" : p.status >= 500 ? "خطا" : "هشدار"}</Pill></td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button onClick={() => setMenu(menu === p.url ? null : p.url)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted">
                          <FontAwesomeIcon icon={faEllipsisVertical} className="text-xs" />
                        </button>
                        {menu === p.url && (
                          <div className="absolute left-0 top-9 z-20 w-48 rounded-lg border border-border bg-popover p-1 shadow-card">
                            {[
                              { label: "بررسی مجدد", icon: faRotate, fn: () => toast.success(`بررسی مجدد ${p.url}`) },
                              { label: "مشاهده جزئیات", icon: faEye, fn: () => open(p) },
                              { label: "افزودن به صفحات حیاتی", icon: faStar, fn: () => toast.success("به صفحات حیاتی اضافه شد") },
                              { label: "غیرفعال کردن Monitoring", icon: faEyeSlash, fn: () => toast.message("مانیتورینگ غیرفعال شد") },
                              { label: "نادیده گرفتن هشدار", icon: faBellSlash, fn: () => toast.message("هشدار نادیده گرفته شد") },
                            ].map((a) => (
                              <button key={a.label} onClick={() => { a.fn(); setMenu(null); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px] hover:bg-muted">
                                <FontAwesomeIcon icon={a.icon} className="text-[10px] text-muted-foreground" /> {a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <FontAwesomeIcon icon={faFileLines} className="text-3xl text-muted-foreground/40" />
              <div className="text-[13px] font-medium">صفحه‌ای یافت نشد</div>
            </div>
          )}
        </div>
      </Panel>

      <PageDrawer open={drawerOpen} onOpenChange={setDrawerOpen} url={url} />
    </div>
  );
}