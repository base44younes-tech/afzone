import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Pill, toFa } from "@/components/yguard/ui";
import { pageDetail } from "@/lib/pagesData";
import { httpTone } from "@/lib/pagesData";
import { cn } from "@/lib/utils";

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
const axis = { fontSize: 10, fill: "oklch(var(--muted-foreground))" };

function InfoField({ label, value, ltr, tone }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono", tone)} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>{value}</div>
    </div>
  );
}

const httpLabel = (s) => (s === 0 ? "Timeout" : toFa(s));

export function PageDrawer({ open, onOpenChange, url }) {
  if (!url) return null;
  const d = pageDetail(url);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-base font-extrabold" dir="ltr" style={{ textAlign: "right" }}>{d.url}</SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">نوع: {d.type} · آخرین بررسی: {d.last}</SheetDescription>
            </div>
            <Pill tone={httpTone[d.status]}>{httpLabel(d.status)}</Pill>
          </div>
        </SheetHeader>
        <div className="space-y-4 p-5" dir="rtl">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <InfoField label="HTTP Status" value={httpLabel(d.status)} ltr tone={d.status === 200 ? "text-success" : "text-destructive"} />
            <InfoField label="زمان پاسخ" value={`${toFa(d.ms)}ms`} ltr />
            <InfoField label="وضعیت مانیتورینگ" value={d.monitoring ? "فعال" : "غیرفعال"} tone={d.monitoring ? "text-success" : "text-muted-foreground"} />
            <InfoField label="Page Size" value={d.pageSize} ltr />
            <InfoField label="Redirect Count" value={toFa(d.redirectCount)} ltr />
            <InfoField label="SSL" value={d.ssl} tone={d.ssl === "فعال" ? "text-success" : "text-destructive"} />
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">تجزیه زمان پاسخ</div>
            <div className="space-y-2">
              {[
                { label: "DNS Time", val: d.breakdown.dns },
                { label: "Connection Time", val: d.breakdown.conn },
                { label: "SSL Time", val: d.breakdown.ssl },
                { label: "TTFB", val: d.breakdown.ttfb },
                { label: "Download Time", val: d.breakdown.download },
                { label: "Total Response", val: d.breakdown.total },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="w-32 text-[12px] text-muted-foreground">{b.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (b.val / d.breakdown.total) * 100)}%` }} />
                  </div>
                  <span className="w-16 text-left font-mono text-[12px]" dir="ltr">{toFa(b.val)}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">۲۰ بررسی اخیر</div>
            <div className="h-40" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.checks} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs><linearGradient id="gPage" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="time" tick={axis} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={axis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tip} />
                  <Area type="monotone" dataKey="ms" name="ms" stroke="oklch(var(--primary))" strokeWidth={2} fill="url(#gPage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">تاریخچه HTTP</div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-[12px]">
                <thead className="bg-muted/60 text-[10px] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-right font-semibold">Time</th>
                    <th className="px-3 py-2 text-right font-semibold">Status</th>
                    <th className="px-3 py-2 text-right font-semibold">Response Time</th>
                    <th className="px-3 py-2 text-right font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {d.checks.slice(0, 8).map((c, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-muted-foreground">{c.time}</td>
                      <td className="px-3 py-2"><Pill tone={httpTone[c.status]}>{httpLabel(c.status)}</Pill></td>
                      <td className="px-3 py-2 font-mono" dir="ltr">{toFa(c.ms)}ms</td>
                      <td className="px-3 py-2">{c.status === 200 ? <FontAwesomeIcon icon={faCircleCheck} className="text-success" /> : <FontAwesomeIcon icon={faCircleXmark} className="text-destructive" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Redirect Chain</div>
            <div className="space-y-1.5">
              {d.redirectChain.map((r, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]">
                  <span className="font-mono" dir="ltr" style={{ textAlign: "right" }}>{r.from}</span>
                  <span className="text-muted-foreground">←</span>
                  <span className="font-mono" dir="ltr" style={{ textAlign: "right" }}>{r.to}</span>
                  <Pill tone={httpTone[r.status]}>{httpLabel(r.status)}</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}