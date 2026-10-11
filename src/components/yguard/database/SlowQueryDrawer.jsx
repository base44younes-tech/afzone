import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Pill, toFa } from "@/components/yguard/ui";
import { slowQueryDetail } from "@/lib/databaseData";
import { cn } from "@/lib/utils";

function InfoField({ label, value, ltr, tone }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono", tone)} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>{value}</div>
    </div>
  );
}

export function SlowQueryDrawer({ open, onOpenChange, queryId }) {
  if (!queryId) return null;
  const d = slowQueryDetail(queryId);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-base font-extrabold">جزئیات Slow Query</SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">منبع: {d.source}</SheetDescription>
            </div>
            <Pill tone="danger">{toFa(d.dur)}</Pill>
          </div>
        </SheetHeader>
        <div className="space-y-4 p-5" dir="rtl">
          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">کوئری کامل</div>
            <div className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3">
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-muted-foreground" dir="ltr" style={{ textAlign: "left" }}>{d.fullQuery}</pre>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <InfoField label="منبع" value={d.source} />
            <InfoField label="مدت زمان" value={d.dur} ltr tone="text-destructive" />
            <InfoField label="تعداد تکرار" value={d.occ} ltr />
            <InfoField label="آخرین مشاهده" value={d.last} />
            <InfoField label="صفحه تحت تاثیر" value={d.page} ltr />
            <InfoField label="منبع فراخوانی" value={d.callSource} ltr />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}