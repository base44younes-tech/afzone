import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode, faDatabase, faPlug, faMemory, faHourglassHalf, faTriangleExclamation, faBolt,
  faCircleCheck, faCircleXmark, faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Pill, toFa } from "@/components/yguard/ui";
import { pluginDetail, PLUGIN_TABS } from "@/lib/performanceData";
import { cn } from "@/lib/utils";

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
const axis = { fontSize: 10, fill: "oklch(var(--muted-foreground))" };

const impactTone = { low: "success", medium: "info", high: "warning", critical: "danger" };
const impactLabel = { low: "کم", medium: "متوسط", high: "زیاد", critical: "بحرانی" };
const qStatusTone = { ok: "success", slow: "warning", dup: "info" };
const qStatusLabel = { ok: "عادی", slow: "کند", dup: "تکراری" };

function InfoField({ label, value, ltr, tone }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono", tone)} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>{value}</div>
    </div>
  );
}

function MiniChart({ data }) {
  return (
    <div className="h-32 rounded-lg border border-border bg-muted/30 p-2" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="gMini" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="d" tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={tip} />
          <Area type="monotone" dataKey="score" stroke="oklch(var(--primary))" strokeWidth={2} fill="url(#gMini)" name="Impact" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TabContent({ tab, data }) {
  if (tab === "overview") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <InfoField label="Impact Score" value={toFa(data.overview.score)} ltr tone="text-primary" />
          <InfoField label="میانگین سهم اجرا" value={data.overview.execContribution} ltr />
          <InfoField label="PHP execution" value={data.overview.phpTime} ltr />
          <InfoField label="سهم دیتابیس" value={data.overview.dbContribution} ltr />
          <InfoField label="سهم External API" value={data.overview.extContribution} ltr />
          <InfoField label="میانگین Memory Impact" value={data.overview.memImpact} ltr />
          <InfoField label="درخواست‌های نمونه‌برداری" value={data.overview.requestsSampled} ltr />
        </div>
        <div>
          <div className="mb-2 text-[12px] font-semibold text-muted-foreground">نمودار ۷ روز اخیر</div>
          <MiniChart data={data.overview.miniChart} />
        </div>
      </div>
    );
  }
  if (tab === "database") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {data.database.cards.map((c) => (
            <div key={c.label} className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <div className="text-lg font-extrabold">{c.value}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/60 text-[10px] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-right font-semibold">Query</th>
                <th className="px-3 py-2 text-right font-semibold">Duration</th>
                <th className="px-3 py-2 text-right font-semibold">Occurrences</th>
                <th className="px-3 py-2 text-right font-semibold">Type</th>
                <th className="px-3 py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.database.rows.map((r, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{r.q.length > 40 ? r.q.slice(0, 40) + "..." : r.q}</td>
                  <td className="px-3 py-2 font-mono" dir="ltr">{r.dur}</td>
                  <td className="px-3 py-2" dir="ltr">{r.occ}</td>
                  <td className="px-3 py-2" dir="ltr">{r.type}</td>
                  <td className="px-3 py-2"><Pill tone={qStatusTone[r.status]}>{qStatusLabel[r.status]}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (tab === "hooks") {
    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-[12px]">
          <thead className="bg-muted/60 text-[10px] text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-right font-semibold">Hook</th>
              <th className="px-3 py-2 text-right font-semibold">Callback</th>
              <th className="px-3 py-2 text-right font-semibold">Duration</th>
              <th className="px-3 py-2 text-right font-semibold">Occurrences</th>
              <th className="px-3 py-2 text-right font-semibold">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.hooks.map((h, i) => (
              <tr key={i}>
                <td className="px-3 py-2 font-mono" dir="ltr" style={{ textAlign: "right" }}>{h.hook}</td>
                <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{h.callback}</td>
                <td className="px-3 py-2 font-mono" dir="ltr">{h.dur}</td>
                <td className="px-3 py-2" dir="ltr">{h.occ}</td>
                <td className="px-3 py-2"><Pill tone={impactTone[h.impact]}>{impactLabel[h.impact]}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (tab === "http") {
    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-[12px]">
          <thead className="bg-muted/60 text-[10px] text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-right font-semibold">Destination</th>
              <th className="px-3 py-2 text-right font-semibold">Requests</th>
              <th className="px-3 py-2 text-right font-semibold">Average Time</th>
              <th className="px-3 py-2 text-right font-semibold">Failures</th>
              <th className="px-3 py-2 text-right font-semibold">Last Request</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.http.map((h, i) => (
              <tr key={i}>
                <td className="px-3 py-2 font-mono" dir="ltr" style={{ textAlign: "right" }}>{h.dest}</td>
                <td className="px-3 py-2" dir="ltr">{h.reqs}</td>
                <td className="px-3 py-2 font-mono" dir="ltr">{h.avg}</td>
                <td className="px-3 py-2"><span className={h.fails !== "۰" ? "font-semibold text-warning" : ""} dir="ltr">{h.fails}</span></td>
                <td className="px-3 py-2 text-muted-foreground">{h.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (tab === "assets") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {data.assets.cards.map((c) => (
            <div key={c.label} className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <div className="text-lg font-extrabold">{c.value}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/60 text-[10px] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-right font-semibold">File</th>
                <th className="px-3 py-2 text-right font-semibold">Type</th>
                <th className="px-3 py-2 text-right font-semibold">Size</th>
                <th className="px-3 py-2 text-right font-semibold">Load location</th>
                <th className="px-3 py-2 text-right font-semibold">Blocking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.assets.rows.map((a, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 font-mono" dir="ltr" style={{ textAlign: "right" }}>{a.file}</td>
                  <td className="px-3 py-2" dir="ltr">{a.type}</td>
                  <td className="px-3 py-2 font-mono" dir="ltr">{a.size}</td>
                  <td className="px-3 py-2" dir="ltr">{a.loc}</td>
                  <td className="px-3 py-2"><Pill tone={a.blocking === "render-blocking" ? "danger" : "success"}>{a.blocking}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (tab === "errors") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {data.errors.cards.map((c) => (
            <div key={c.label} className={cn("rounded-lg border border-border bg-muted/40 p-3 text-center", c.tone === "danger" && "border-destructive/30", c.tone === "warning" && "border-warning/30")}>
              <div className={cn("text-lg font-extrabold", c.tone === "danger" && "text-destructive", c.tone === "warning" && "text-warning")}>{c.value}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/60 text-[10px] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-right font-semibold">Error</th>
                <th className="px-3 py-2 text-right font-semibold">File</th>
                <th className="px-3 py-2 text-right font-semibold">Line</th>
                <th className="px-3 py-2 text-right font-semibold">Occurrences</th>
                <th className="px-3 py-2 text-right font-semibold">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.errors.rows.map((e, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-warning" dir="ltr" style={{ textAlign: "right" }}>{e.err}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{e.file}</td>
                  <td className="px-3 py-2 font-mono" dir="ltr">{e.line}</td>
                  <td className="px-3 py-2" dir="ltr">{e.occ}</td>
                  <td className="px-3 py-2 text-muted-foreground">{e.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (tab === "history") {
    return (
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-[12px] font-semibold text-muted-foreground">نمودار ۷ روزه Impact Score</div>
          <MiniChart data={data.history.chart} />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {data.history.changes.map((c) => (
            <div key={c.label} className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <div className={cn("text-lg font-extrabold", c.tone === "success" && "text-success", c.tone === "danger" && "text-destructive", c.tone === "primary" && "text-primary")}>{c.value}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function PluginDrawer({ open, onOpenChange, plugin }) {
  const [tab, setTab] = useState("overview");
  if (!plugin) return null;
  const data = pluginDetail(plugin.name);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft text-lg font-extrabold text-primary">{plugin.icon}</div>
              <div>
                <SheetTitle className="text-base font-extrabold">{plugin.name}</SheetTitle>
                <SheetDescription className="mt-1 text-[12px]">نسخه {plugin.version} · <span dir="ltr">v{plugin.version}</span></SheetDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Pill tone={plugin.tone}>{plugin.statusLabel}</Pill>
              <span className="text-[11px] text-muted-foreground">Impact: <span className="font-bold text-foreground" dir="ltr">{toFa(plugin.score)}</span></span>
            </div>
          </div>
        </SheetHeader>

        <div className="border-b border-border bg-card px-5 py-2" dir="rtl">
          <div className="flex gap-1 overflow-x-auto">
            {PLUGIN_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                  tab === t.id ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-5" dir="rtl">
          <TabContent tab={tab} data={data} />
        </div>
      </SheetContent>
    </Sheet>
  );
}