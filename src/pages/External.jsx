import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlug, faCircleCheck, faTriangleExclamation, faCircleXmark, faGaugeHigh,
  faRotate, faMagnifyingGlass, faEye, faServer,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, StatCard, toFa } from "@/components/yguard/ui";
import { ServiceDrawer } from "@/components/yguard/external/ServiceDrawer";
import { SERVICES, SUMMARY } from "@/lib/externalData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusTone = { healthy: "success", slow: "warning", error: "danger" };
const statusDot = { healthy: "bg-success", slow: "bg-warning", error: "bg-destructive" };

const FILTERS = [
  { id: "all", label: "همه" },
  { id: "healthy", label: "سالم" },
  { id: "slow", label: "کند" },
  { id: "error", label: "خطادار" },
];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
        <div className="h-2.5 w-40 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-5 w-16 rounded bg-muted animate-pulse" />
      <div className="h-3 w-12 rounded bg-muted animate-pulse" />
    </div>
  );
}

export default function External() {
  const group = findGroup("external");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [disabled, setDisabled] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      if (disabled[s.id]) return false;
      if (filter !== "all" && s.status !== filter) return false;
      if (query && !s.name.includes(query) && !s.endpoint.includes(query) && !s.provider.includes(query)) return false;
      return true;
    });
  }, [filter, query, disabled]);

  const open = (s) => { setDetail(s); setDrawerOpen(true); };
  const rescan = (s) => toast.success(`بررسی مجدد ${s.name} انجام شد`);
  const disable = (s) => { setDisabled((d) => ({ ...d, [s.id]: true })); toast.message(`مانیتورینگ ${s.name} غیرفعال شد`); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faPlug} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">سرویس‌های خارجی</h1>
            <p className="text-[13px] text-muted-foreground">{group ? `${group.title} · ` : ""}مانیتورینگ APIها و سرویس‌های خارجی مورد استفاده سایت</p>
          </div>
        </div>
        <button onClick={() => toast.success("همه سرویس‌ها بررسی شدند")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
          <FontAwesomeIcon icon={faRotate} className="text-xs" /> بررسی همه
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={faServer} tone="primary" label="کل سرویس‌ها" value={toFa(SUMMARY.total)} />
        <StatCard icon={faCircleCheck} tone="success" label="سالم" value={toFa(SUMMARY.healthy)} />
        <StatCard icon={faTriangleExclamation} tone="warning" label="کند" value={toFa(SUMMARY.slow)} />
        <StatCard icon={faCircleXmark} tone="danger" label="خطادار" value={toFa(SUMMARY.error)} />
        <StatCard icon={faGaugeHigh} tone="info" label="میانگین Response Time" value={`${toFa(SUMMARY.avgResponse)}ms`} />
      </div>

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
            placeholder="جستجوی سرویس..."
            className="h-9 w-56 rounded-lg border border-border bg-background pr-9 pl-3 text-[13px] outline-none focus:border-primary/40"
          />
        </div>
      </div>

      <Panel>
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-right font-semibold">سرویس</th>
                <th className="px-4 py-2.5 text-right font-semibold">Endpoint</th>
                <th className="px-4 py-2.5 text-right font-semibold">وضعیت</th>
                <th className="px-4 py-2.5 text-right font-semibold">Response Time</th>
                <th className="px-4 py-2.5 text-right font-semibold">Uptime</th>
                <th className="px-4 py-2.5 text-right font-semibold">خطا</th>
                <th className="px-4 py-2.5 text-right font-semibold">آخرین بررسی</th>
                <th className="px-4 py-2.5 text-right font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="p-0"><SkeletonRow /></td></tr>
              ))}

              {!loading && filtered.map((s) => (
                <tr key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => open(s)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("h-2 w-2 rounded-full", statusDot[s.status])} />
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.provider}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{s.endpoint}</td>
                  <td className="px-4 py-3"><Pill tone={statusTone[s.status]}>{s.statusLabel}</Pill></td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{s.responseTime ? `${toFa(s.responseTime)}ms` : "—"}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{toFa(s.uptime)}٪</td>
                  <td className="px-4 py-3">
                    {s.failures > 0 ? <span className="font-semibold text-warning">{toFa(s.failures)} خطا</span> : <span className="text-muted-foreground">۰</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.lastCheck}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); open(s); }}
                      className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[11px] font-medium hover:bg-muted"
                    >
                      <FontAwesomeIcon icon={faEye} className="text-[10px]" /> جزئیات
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <FontAwesomeIcon icon={faPlug} className="text-3xl text-muted-foreground/40" />
              <div className="text-[13px] font-medium">سرویسی یافت نشد</div>
              <div className="text-[12px] text-muted-foreground">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید.</div>
            </div>
          )}
        </div>
      </Panel>

      <ServiceDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        service={detail}
        onRescan={rescan}
        onDisable={disable}
      />
    </div>
  );
}