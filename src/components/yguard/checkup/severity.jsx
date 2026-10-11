import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck, faTriangleExclamation, faCircleXmark, faClock, faCircleNotch, faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export const SEVERITY = {
  critical: { label: "بحرانی", tone: "danger", icon: faCircleXmark, cls: "text-destructive", chip: "bg-destructive/12 text-destructive", dot: "bg-destructive" },
  warning: { label: "هشدار", tone: "warning", icon: faTriangleExclamation, cls: "text-warning", chip: "bg-warning/15 text-warning", dot: "bg-warning" },
  success: { label: "موفق", tone: "success", icon: faCircleCheck, cls: "text-success", chip: "bg-success/12 text-success", dot: "bg-success" },
  info: { label: "اطلاع", tone: "info", icon: faCircle, cls: "text-info", chip: "bg-info/12 text-info", dot: "bg-info" },
};

export const STAGE_STATUS = {
  waiting: { label: "در انتظار", icon: faCircle, cls: "text-muted-foreground", ring: "border-border" },
  running: { label: "در حال بررسی", icon: faCircleNotch, cls: "text-primary", ring: "border-primary/40" },
  passed: { label: "موفق", icon: faCircleCheck, cls: "text-success", ring: "border-success/40" },
  warning: { label: "هشدار", icon: faTriangleExclamation, cls: "text-warning", ring: "border-warning/40" },
  critical: { label: "بحرانی", icon: faCircleXmark, cls: "text-destructive", ring: "border-destructive/40" },
};

export function SeverityPill({ severity }) {
  const s = SEVERITY[severity] || SEVERITY.info;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold", s.chip)}>
      <FontAwesomeIcon icon={s.icon} className="text-[10px]" />
      {s.label}
    </span>
  );
}