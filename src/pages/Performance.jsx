import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faCode, faDatabase, faPlug, faMemory, faHourglassHalf, faTriangleExclamation,
  faCircleCheck, faCircleArrowDown, faCircleArrowUp, faCircleInfo, faSliders, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import { PluginDrawer } from "@/components/yguard/performance/PluginDrawer";
import { DeepProfilingDialog } from "@/components/yguard/performance/DeepProfilingDialog";
import { KPIS, PERIODS, REQUEST_TYPES, RESPONSE_CHART, PLUGINS } from "@/lib/performanceData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
const axis = { fontSize: 10, fill: "oklch(var(--muted-foreground))" };

const iconMap = { faBolt, faCode, faDatabase, faPlug, faMemory, faHourglassHalf, faTriangleExclamation };
const statusIcon = { success: faCircleCheck, warning: faTriangleExclamation, danger: faTriangleExclamation, info: faCircleInfo };
const statusTone = { success: "text-success", warning: "text-warning", danger: "text-destructive", info: "text-info" };

function KpiCard({ kpi }) {
  const Icon = iconMap[kpi.icon] || faBolt;
  const SIcon = statusIcon[kpi.status];
  const isUp = kpi.trend?.startsWith("+");
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between">
        <IconBadge icon={Icon} tone={kpi.tone} />
        <div className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={isUp ? faCircleArrowUp : faCircleArrowDown} className={cn("text-[10px]", isUp ? "text-destructive" : "text-success")} />
          <span className={cn("text-[11px] font-semibold", isUp ? "text-destructive" : "text-success")} dir="ltr">{kpi.trend}</span>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-xl font-extrabold tracking-tight" dir="ltr">{kpi.value}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{kpi.label}</div>
        </div>
        <FontAwesomeIcon icon={SIcon} className={cn("text-sm", statusTone[kpi.status])} />
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">دوره قبل: <span dir="ltr">{kpi.prev}</span></div>
    </div>
  );
}

const barTone = { normal: "bg-success", medium: "bg-info", high: "bg-warning", critical: "bg-destructive" };

export default function Performance() {
  const group = findGroup("performance");
  const [period, setPeriod] = useState("24h");
  const [reqType, setReqType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [profilingOpen, setProfilingOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const chartData = useMemo(() => RESPONSE_CHART[period] || RESPONSE_CHART["24h"], [period]);

  const openPlugin = (p) => { setSelected(p); setDrawerOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faBolt} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">تحلیل Performance</h1>
            <p className="text-[13px] text-muted-foreground">بررسی تاثیر افزونه‌ها، دیتابیس، PHP و درخواست‌های خارجی بر عملکرد سایت</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setProfilingOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            <FontAwesomeIcon icon={faBolt} className="text-xs" /> شروع Deep Profiling
          </button>
          <button onClick={() => toast("تنظیمات مانیتورینگ باز شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faSliders} className="text-xs" /> تنظیمات مانیتورینگ
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="flex gap-1.5">
          {PERIODS.map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id)} className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", period === p.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}>{p.label}</button>
          ))}
        </div>
        <div className="h-5 w-px bg-border" />
        <div className="flex gap-1.5">
          {REQUEST_TYPES.map((r) => (
            <button key={r.id} onClick={() => setReqType(r.id)} className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", reqType === r.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}>{r.label}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => <KpiCard key={k.id} kpi={k} />)}
        {KPIS.length === 7 && <div className="hidden xl:block" />}
      </div>

      <Panel title="زمان پاسخ سایت" action={<Pill tone="primary">{PERIODS.find((p) => p.id === period)?.label}</Pill>}>
        {loading ? (
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        ) : (
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPhp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity={0.05} /></linearGradient>
                  <linearGradient id="gDb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--info))" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(var(--info))" stopOpacity={0.05} /></linearGradient>
                  <linearGradient id="gExt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--warning))" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(var(--warning))" stopOpacity={0.05} /></linearGradient>
                  <linearGradient id="gOther" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--muted-foreground))" stopOpacity={0.3} /><stop offset="100%" stopColor="oklch(var(--muted-foreground))" stopOpacity={0.05} /></linearGradient>
                </defs>
                <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} interval={Math.floor(chartData.length / 8)} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} labelStyle={{ fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="php" stackId="1" name="PHP" stroke="oklch(var(--primary))" strokeWidth={1.5} fill="url(#gPhp)" />
                <Area type="monotone" dataKey="db" stackId="1" name="Database" stroke="oklch(var(--info))" strokeWidth={1.5} fill="url(#gDb)" />
                <Area type="monotone" dataKey="external" stackId="1" name="External API" stroke="oklch(var(--warning))" strokeWidth={1.5} fill="url(#gExt)" />
                <Area type="monotone" dataKey="other" stackId="1" name="Other" stroke="oklch(var(--muted-foreground))" strokeWidth={1.5} fill="url(#gOther)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      <Panel title="۱۰ افزونه با بیشترین Impact" action={<Pill tone="info">{toFa(PLUGINS.length)} افزونه</Pill>}>
        <div className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <FontAwesomeIcon icon={faCircleInfo} className="text-info" />
          <span>Impact Score یک امتیاز تخمینی بر اساس زمان اجرا، کوئری‌های دیتابیس، Hookها، درخواست‌های خارجی، Assetها و خطاهای افزونه است.</span>
        </div>
        <div className="-mx-5 -my-2 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-right font-semibold">افزونه</th>
                <th className="px-5 py-2.5 text-right font-semibold">Impact Score</th>
                <th className="px-5 py-2.5 text-right font-semibold">PHP Time</th>
                <th className="px-5 py-2.5 text-right font-semibold">Database</th>
                <th className="px-5 py-2.5 text-right font-semibold">Queries</th>
                <th className="px-5 py-2.5 text-right font-semibold">HTTP Calls</th>
                <th className="px-5 py-2.5 text-right font-semibold">Hooks</th>
                <th className="px-5 py-2.5 text-right font-semibold">Errors</th>
                <th className="px-5 py-2.5 text-right font-semibold">Assets</th>
                <th className="px-5 py-2.5 text-right font-semibold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PLUGINS.map((p) => (
                <tr key={p.name} className="cursor-pointer hover:bg-muted/40" onClick={() => openPlugin(p)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-sm font-extrabold text-primary">{p.icon}</div>
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", barTone[p.status])} style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="font-mono font-bold" dir="ltr">{toFa(p.score)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground" dir="ltr">{toFa(p.php)}ms</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground" dir="ltr">{toFa(p.db)}ms</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{toFa(p.queries)}</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{toFa(p.http)}</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{toFa(p.hooks)}</td>
                  <td className="px-5 py-3"><span className={p.errors > 0 ? "font-semibold text-warning" : "text-muted-foreground"} dir="ltr">{toFa(p.errors)}</span></td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{toFa(p.assets)}</td>
                  <td className="px-5 py-3"><Pill tone={p.tone}>{p.statusLabel}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <PluginDrawer open={drawerOpen} onOpenChange={setDrawerOpen} plugin={selected} />
      <DeepProfilingDialog open={profilingOpen} onOpenChange={setProfilingOpen} />
    </div>
  );
}