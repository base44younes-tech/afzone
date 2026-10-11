import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faLightbulb, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { SeverityPill, SEVERITY } from "@/components/yguard/checkup/severity";
import { toFa } from "@/components/yguard/ui";
import { cn } from "@/lib/utils";

function Field({ label, value, ltr }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono")} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>
        {value}
      </div>
    </div>
  );
}

export function ResultDrawer({ open, onOpenChange, item, onResolve, onIgnore }) {
  if (!item) return null;
  const s = SEVERITY[item.severity];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <SheetTitle className="text-base font-extrabold">{item.title}</SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">{item.desc}</SheetDescription>
            </div>
            <SeverityPill severity={item.severity} />
          </div>
        </SheetHeader>

        <div className="space-y-5 p-5" dir="rtl">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="مؤلفه متأثر" value={item.component} ltr />
            <Field label="زمان شناسایی" value={item.time} />
            <Field label="مقدار فعلی" value={item.current} ltr />
            <Field label="مقدار مورد انتظار" value={item.expected} ltr />
          </div>

          <div>
            <div className="mb-1.5 text-[12px] font-semibold text-muted-foreground">توضیحات</div>
            <p className="text-[13px] leading-6">{item.details}</p>
          </div>

          <div>
            <div className="mb-1.5 text-[12px] font-semibold text-muted-foreground">شواهد فنی</div>
            <div className="rounded-lg border border-border bg-muted/60 p-3 font-mono text-[12px]" dir="ltr" style={{ textAlign: "right" }}>
              {item.evidence}
            </div>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary-soft p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FontAwesomeIcon icon={faLightbulb} className="text-xs" />
              </span>
              <span className="text-[13px] font-bold text-primary">پیشنهاد YGuard</span>
            </div>
            <p className="mt-2 text-[13px] leading-6">{item.recommendation}</p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <FontAwesomeIcon icon={faClock} className="text-[10px]" />
            شناسایی‌شده در {item.time}
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-2 border-t border-border bg-card p-4" dir="rtl">
          <button
            onClick={() => { onResolve(item); onOpenChange(false); }}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-success/15 text-[13px] font-semibold text-success hover:bg-success/20"
          >
            <FontAwesomeIcon icon={faCheck} className="text-xs" /> علامت‌گذاری به‌عنوان حل‌شده
          </button>
          <button
            onClick={() => { onIgnore(item); onOpenChange(false); }}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium hover:bg-muted"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs" /> نادیده گرفتن
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium hover:bg-muted"
          >
            بستن
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}