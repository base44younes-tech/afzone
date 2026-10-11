import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faEyeSlash, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Pill, toFa } from "@/components/yguard/ui";
import { cronDetail } from "@/lib/cronData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function InfoField({ label, value, ltr, tone }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono", tone)} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>{value}</div>
    </div>
  );
}

const histTone = { healthy: "bg-success", failed: "bg-destructive" };

export function CronDrawer({ open, onOpenChange, hook }) {
  if (!hook) return null;
  const d = cronDetail(hook);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-base font-extrabold" dir="ltr" style={{ textAlign: "right" }}>{d.hook}</SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">منبع: {d.source} · زمان‌بندی: {d.schedule}</SheetDescription>
            </div>
            <Pill tone={d.tone}>{d.statusLabel}</Pill>
          </div>
        </SheetHeader>
        <div className="space-y-4 p-5" dir="rtl">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <InfoField label="زمان‌بندی" value={d.schedule} ltr />
            <InfoField label="آرگومان‌ها" value={d.args} ltr />
            <InfoField label="آخرین اجرا" value={d.last} />
            <InfoField label="اجرای بعدی" value={d.next} />
            <InfoField label="میانگین مدت" value={d.avgDur} ltr />
            <InfoField label="مدت آخرین اجرا" value={d.dur} ltr />
            <InfoField label="تعداد خطا" value={d.failCount} tone={d.failCount !== "۰" ? "text-destructive" : "text-success"} />
          </div>
          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">تاریخچه اجرا</div>
            <div className="space-y-1.5">
              {d.history.map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", histTone[h.status])} />
                    <span className="text-muted-foreground">{h.time}</span>
                  </div>
                  <span className="font-mono" dir="ltr">{h.dur}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-border bg-card p-4" dir="rtl">
          <button onClick={() => toast.success(`اجرای آزمایشی ${d.hook} شروع شد`)} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            <FontAwesomeIcon icon={faPlay} className="text-xs" /> اجرای آزمایشی
          </button>
          <button onClick={() => toast.message("هشدار نادیده گرفته شد")} className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faBellSlash} className="text-xs" /> نادیده گرفتن هشدار
          </button>
          <button onClick={() => { onOpenChange(false); toast.message("مانیتورینگ غیرفعال شد"); }} className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faEyeSlash} className="text-xs" /> Disable
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}