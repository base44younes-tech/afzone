import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import { UPTIME } from "@/lib/pagesData";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tlColor = { up: "bg-success", warn: "bg-warning", down: "bg-destructive" };

export default function Uptime() {
  const group = findGroup("uptime");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faChartLine} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">مانیتور Uptime</h1>
            <p className="text-[13px] text-muted-foreground">درصد در دسترس بودن سایت و تاریخچه قطعی‌ها</p>
          </div>
        </div>
        <button onClick={() => toast.success("گزارش Uptime بروزرسانی شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
          <FontAwesomeIcon icon={faArrowUp} className="text-xs" /> بروزرسانی
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {UPTIME.cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-[12px] text-muted-foreground">{c.label}</div>
            <div className={cn("mt-2 text-2xl font-extrabold", c.tone === "success" && "text-success", c.tone === "warning" && "text-warning")} dir="ltr">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="text-[12px] text-muted-foreground">Total Downtime</div>
          <div className="mt-2 text-xl font-extrabold text-destructive" dir="ltr">{UPTIME.downtime}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="text-[12px] text-muted-foreground">Incidents</div>
          <div className="mt-2 text-xl font-extrabold text-warning" dir="ltr">{UPTIME.incidents}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="text-[12px] text-muted-foreground">وضعیت فعلی</div>
          <div className="mt-2 flex items-center gap-2 text-xl font-extrabold text-success">
            <FontAwesomeIcon icon={faCircleCheck} /> سالم
          </div>
        </div>
      </div>

      <Panel title="تایم‌لاین Uptime (۹۰ روز)">
        {loading ? (
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        ) : (
          <div className="flex gap-0.5" dir="ltr">
            {UPTIME.timeline.map((t, i) => (
              <div key={i} className={cn("h-12 flex-1 rounded-sm", tlColor[t])} title={`روز ${toFa(i + 1)}: ${t === "up" ? "سالم" : t === "warn" ? "کند" : "قطع"}`} />
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-success" /> سالم</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-warning" /> کند</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-destructive" /> قطع</span>
        </div>
      </Panel>

      <Panel title="تاریخچه قطعی‌ها">
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-right font-semibold">Started</th>
                <th className="px-5 py-2.5 text-right font-semibold">Ended</th>
                <th className="px-5 py-2.5 text-right font-semibold">Duration</th>
                <th className="px-5 py-2.5 text-right font-semibold">HTTP Status</th>
                <th className="px-5 py-2.5 text-right font-semibold">Affected URL</th>
                <th className="px-5 py-2.5 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {UPTIME.incidentsList.map((inc, i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="px-5 py-3 text-muted-foreground">{inc.started}</td>
                  <td className="px-5 py-3 text-muted-foreground">{inc.ended}</td>
                  <td className="px-5 py-3 font-mono" dir="ltr">{inc.dur}</td>
                  <td className="px-5 py-3"><Pill tone="danger">{toFa(inc.http)}</Pill></td>
                  <td className="px-5 py-3 font-mono text-[12px]" dir="ltr" style={{ textAlign: "right" }}>{inc.url}</td>
                  <td className="px-5 py-3"><Pill tone={inc.tone}><FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" /> {inc.status === "resolved" ? "حل‌شده" : inc.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}