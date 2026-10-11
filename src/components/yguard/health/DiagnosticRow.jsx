import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SeverityPill, SEVERITY } from "@/components/yguard/checkup/severity";
import { cn } from "@/lib/utils";

export function DiagnosticRow({ label, current, recommended, severity, status }) {
  const s = SEVERITY[severity] || SEVERITY.info;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
      <FontAwesomeIcon icon={s.icon} className={cn("shrink-0 text-sm", s.cls)} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{label}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span>فعلی: <span className="font-mono text-foreground" dir="ltr">{current}</span></span>
          <span>پیشنهاد: <span className="font-mono text-foreground" dir="ltr">{recommended}</span></span>
        </div>
      </div>
      <SeverityPill severity={severity} />
    </div>
  );
}