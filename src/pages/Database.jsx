import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase, faTable, faMemory, faClock, faCopy, faHourglassHalf, faGhost,
  faCircleCheck, faTriangleExclamation, faRotate, faFileExport, faGear, faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { IconBadge, Panel, Pill, StatCard, toFa } from "@/components/yguard/ui";
import { SlowQueryDrawer } from "@/components/yguard/database/SlowQueryDrawer";
import { KPIS, HEALTH_SCORE, TABLES, AUTOLOAD, DIAGNOSTICS, SLOW_QUERIES, CHARTS } from "@/lib/databaseData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
const axis = { fontSize: 10, fill: "oklch(var(--muted-foreground))" };

const iconMap = { faDatabase, faTable, faMemory, faClock, faCopy, faHourglassHalf, faGhost };

export default function Database() {
  const group = findGroup("database");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryId, setQueryId] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const openQuery = (id) => { setQueryId(id); setDrawerOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faDatabase} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">سلامت و عملکرد دیتابیس</h1>
            <p className="text-[13px] text-muted-foreground">تحلیل حجم، Queryها، Autoload و داده‌های اضافی وردپرس</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success("تحلیل مجدد انجام شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faRotate} className="text-xs" /> تحلیل مجدد
          </button>
          <button onClick={() => toast("گزارش کامل باز شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faFileExport} className="text-xs" /> مشاهده گزارش کامل
          </button>
          <button onClick={() => toast("تنظیمات دیتابیس باز شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faGear} className="text-xs" /> تنظیمات
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => <StatCard key={k.id} icon={iconMap[k.icon] || faDatabase} tone={k.tone} label={k.label} value={toFa(k.value)} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="text-[12px] font-semibold text-muted-foreground">امتیاز سلامت دیتابیس</div>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(var(--muted))" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(var(--warning))" strokeWidth="6" strokeDasharray={`${(HEALTH_SCORE.score / 100) * 214} 214`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-lg font-extrabold" dir="ltr">{toFa(HEALTH_SCORE.score)}</span>
            </div>
            <div>
              <Pill tone={HEALTH_SCORE.tone}>{HEALTH_SCORE.status}</Pill>
              <div className="mt-2 text-[12px] text-muted-foreground">{toFa(HEALTH_SCORE.recommendations)} توصیه امنیتی</div>
              <div className="text-[11px] text-muted-foreground">از ۱۰۰ امتیاز</div>
            </div>
          </div>
        </div>
        <Panel title="تاریخچه حجم دیتابیس" className="lg:col-span-2">
          <div className="h-40" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHARTS.size} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="gDbSize" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="d" tick={axis} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="mb" name="MB" stroke="oklch(var(--primary))" strokeWidth={2} fill="url(#gDbSize)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="بزرگ‌ترین جداول">
        <div className="-mx-5 -my-2 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-right font-semibold">Table</th>
                <th className="px-5 py-2.5 text-right font-semibold">Rows</th>
                <th className="px-5 py-2.5 text-right font-semibold">Data Size</th>
                <th className="px-5 py-2.5 text-right font-semibold">Index Size</th>
                <th className="px-5 py-2.5 text-right font-semibold">Total Size</th>
                <th className="px-5 py-2.5 text-right font-semibold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TABLES.map((t) => (
                <tr key={t.name} className="hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono font-semibold" dir="ltr" style={{ textAlign: "right" }}>{t.name}</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{toFa(t.rows)}</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{t.data}</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{t.index}</td>
                  <td className="px-5 py-3 font-mono font-semibold" dir="ltr">{t.total}</td>
                  <td className="px-5 py-3"><Pill tone={t.tone}>{t.statusLabel}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="تحلیل Autoload" action={<Pill tone="warning">{AUTOLOAD.status}</Pill>}>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <div className="text-[11px] text-muted-foreground">Autoload فعلی</div>
            <div className="mt-1 text-lg font-extrabold text-warning" dir="ltr">{AUTOLOAD.current}</div>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <div className="text-[11px] text-muted-foreground">مقدار پیشنهادی</div>
            <div className="mt-1 text-lg font-extrabold text-success">{AUTOLOAD.recommended}</div>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <div className="text-[11px] text-muted-foreground">نسبت به حد مجاز</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-warning" style={{ width: `${AUTOLOAD.progress}%` }} />
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground" dir="ltr">{toFa(AUTOLOAD.progress)}٪</div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/60 text-[10px] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-right font-semibold">Option</th>
                <th className="px-3 py-2 text-right font-semibold">Size</th>
                <th className="px-3 py-2 text-right font-semibold">Source</th>
                <th className="px-3 py-2 text-right font-semibold">Autoload</th>
                <th className="px-3 py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {AUTOLOAD.options.map((o) => (
                <tr key={o.name} className="hover:bg-muted/40">
                  <td className="px-3 py-2 font-mono" dir="ltr" style={{ textAlign: "right" }}>{o.name}</td>
                  <td className="px-3 py-2 font-mono" dir="ltr">{o.size}</td>
                  <td className="px-3 py-2 text-muted-foreground">{o.source}</td>
                  <td className="px-3 py-2">{o.autoload}</td>
                  <td className="px-3 py-2"><Pill tone={o.tone}>{o.statusLabel === "بحرانی" ? "بحرانی" : o.statusLabel === "هشدار" ? "هشدار" : "عادی"}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="دیافتیک دیتابیس">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {DIAGNOSTICS.map((d) => (
            <div key={d.id} className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-semibold">{d.label}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{d.detail}</div>
                </div>
                <Pill tone={d.tone}>{d.statusLabel}</Pill>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold" dir="ltr">{toFa(d.count)}</span>
                  <span className="mr-2 text-[11px] text-muted-foreground">مورد</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{d.size}</span>
              </div>
              <button onClick={() => toast(`جزئیات ${d.label}`)} className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border text-[11px] font-medium hover:bg-muted">
                <FontAwesomeIcon icon={faEye} className="text-[10px]" /> مشاهده جزئیات
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Slow Queries" action={<Pill tone="danger">{toFa(SLOW_QUERIES.length)} کوئری</Pill>}>
        <div className="-mx-5 -my-2 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-right font-semibold">Query</th>
                <th className="px-5 py-2.5 text-right font-semibold">Source</th>
                <th className="px-5 py-2.5 text-right font-semibold">Duration</th>
                <th className="px-5 py-2.5 text-right font-semibold">Occurrences</th>
                <th className="px-5 py-2.5 text-right font-semibold">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SLOW_QUERIES.map((q) => (
                <tr key={q.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openQuery(q.id)}>
                  <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{q.q.length > 50 ? q.q.slice(0, 50) + "..." : q.q}</td>
                  <td className="px-5 py-3 text-muted-foreground">{q.source}</td>
                  <td className="px-5 py-3"><Pill tone={q.tone}>{toFa(q.dur)}</Pill></td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{q.occ}</td>
                  <td className="px-5 py-3 text-muted-foreground">{q.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="تاریخچه Query Time">
          <div className="h-40" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHARTS.queryTime} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="gQt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--info))" stopOpacity={0.3} /><stop offset="100%" stopColor="oklch(var(--info))" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="d" tick={axis} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="ms" name="ms" stroke="oklch(var(--info))" strokeWidth={2} fill="url(#gQt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="تاریخچه Autoload">
          <div className="h-40" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHARTS.autoload} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="gAl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--warning))" stopOpacity={0.3} /><stop offset="100%" stopColor="oklch(var(--warning))" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="d" tick={axis} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="mb" name="MB" stroke="oklch(var(--warning))" strokeWidth={2} fill="url(#gAl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <SlowQueryDrawer open={drawerOpen} onOpenChange={setDrawerOpen} queryId={queryId} />
    </div>
  );
}