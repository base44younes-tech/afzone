import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faEyeSlash, faPen, faCircleCheck, faCircleXmark, faClock } from "@fortawesome/free-solid-svg-icons";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Pill, toFa } from "@/components/yguard/ui";
import { FAILURES, UPTIME_TIMELINE } from "@/lib/externalData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
const axis = { fontSize: 10, fill: "oklch(var(--muted-foreground))" };

const statusTone = { healthy: "success", slow: "warning", error: "danger" };
const tlColor = { up: "bg-success", warn: "bg-warning", down: "bg-destructive" };

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

export function ServiceDrawer({ open, onOpenChange, service, onRescan, onDisable }) {
  if (!service) return null;
  const failures = FAILURES[service.id] || [];
  const timeline = UPTIME_TIMELINE[service.id] || [];
  const tone = statusTone[service.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <SheetTitle className="text-base font-extrabold">{service.name}</SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">{service.provider} · <span dir="ltr">{service.endpoint}</span></SheetDescription>
            </div>
            <Pill tone={tone}>{service.statusLabel}</Pill>
          </div>
        </SheetHeader>

        <div className="space-y-5 p-5" dir="rtl">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <InfoField label="وضعیت فعلی" value={service.statusLabel} tone={service.status === "healthy" ? "text-success" : service.status === "slow" ? "text-warning" : "text-destructive"} />
            <InfoField label="HTTP Status" value={toFa(service.http)} ltr tone={service.http === 200 ? "text-success" : "text-destructive"} />
            <InfoField label="زمان پاسخ" value={`${toFa(service.responseTime)}ms`} ltr />
            <InfoField label="میانگین زمان پاسخ" value={`${toFa(service.avg)}ms`} ltr />
            <InfoField label="Uptime" value={`${toFa(service.uptime)}٪`} ltr />
            <InfoField label="تعداد خطا" value={toFa(service.failures)} tone={service.failures > 0 ? "text-warning" : "text-success"} />
            <InfoField label="آخرین درخواست موفق" value={service.lastSuccess} />
            <InfoField label="آخرین درخواست ناموفق" value={service.lastFailed} tone={service.lastFailed === "—" ? undefined : "text-destructive"} />
            <InfoField label="آخرین بررسی" value={service.lastCheck} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-muted-foreground">نمودار زمان پاسخ (۲۴ ساعت)</span>
              <span className="text-[11px] text-muted-foreground">میانگین: <span className="font-mono text-foreground" dir="ltr">{toFa(service.avg)}ms</span></span>
            </div>
            <div className="h-40 rounded-lg border border-border bg-muted/30 p-2" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={service.chart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSvc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="h" tick={axis} axisLine={false} tickLine={false} interval={5} />
                  <YAxis tick={axis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tip} labelStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="ms" stroke="oklch(var(--primary))" strokeWidth={2} fill="url(#gSvc)" name="ms" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">تاریخچه Uptime (۱۴ روز)</div>
            <div className="flex gap-1" dir="ltr">
              {timeline.map((t, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className={cn("h-8 w-full rounded", tlColor[t])} title={t} />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-success" /> سالم</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-warning" /> کند</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-destructive" /> قطع</span>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">خطاهای اخیر</div>
            {failures.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-[12px] text-success">
                <FontAwesomeIcon icon={faCircleCheck} className="text-xs" /> خطایی در بازه ثبت نشده است.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-[12px]">
                  <thead className="bg-muted/60 text-[10px] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-right font-semibold">زمان</th>
                      <th className="px-3 py-2 text-right font-semibold">HTTP</th>
                      <th className="px-3 py-2 text-right font-semibold">زمان پاسخ</th>
                      <th className="px-3 py-2 text-right font-semibold">خطا</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {failures.map((f, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr">{f.time}</td>
                        <td className="px-3 py-2 font-mono font-semibold text-destructive" dir="ltr">{toFa(f.http)}</td>
                        <td className="px-3 py-2 text-muted-foreground" dir="ltr">{f.ms ? `${toFa(f.ms)}ms` : "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground" dir="ltr">{f.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-border bg-card p-4" dir="rtl">
          <button
            onClick={() => { onRescan(service); }}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90"
          >
            <FontAwesomeIcon icon={faRotate} className="text-xs" /> بررسی مجدد
          </button>
          <button
            onClick={() => { onDisable(service); onOpenChange(false); }}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium hover:bg-muted"
          >
            <FontAwesomeIcon icon={faEyeSlash} className="text-xs" /> غیرفعال کردن مانیتورینگ
          </button>
          <button
            onClick={() => toast("ویرایش سرویس")}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium hover:bg-muted"
          >
            <FontAwesomeIcon icon={faPen} className="text-xs" /> ویرایش
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}