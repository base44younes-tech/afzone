import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved, faBolt, faDatabase, faFileLines, faCode, faServer, faNetworkWired,
  faCircleCheck, faTriangleExclamation, faCircleXmark, faLightbulb, faEye, faXmark, faCheck,
  faRotate, faClock, faListCheck, faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { Panel, Pill, toFa } from "@/components/yguard/ui";
import { RESULT_GROUPS, SUMMARY } from "@/lib/checkupData";
import { SeverityPill, SEVERITY } from "@/components/yguard/checkup/severity";
import { cn } from "@/lib/utils";

const groupIcons = {
  security: faShieldHalved, performance: faBolt, database: faDatabase, pages: faFileLines,
  wordpress: faCode, server: faServer, infra: faNetworkWired,
};

const summaryCards = [
  { key: "critical", label: "بحرانی", value: SUMMARY.critical, icon: faCircleXmark, cls: "text-destructive", chip: "bg-destructive/12" },
  { key: "warning", label: "هشدار", value: SUMMARY.warning, icon: faTriangleExclamation, cls: "text-warning", chip: "bg-warning/15" },
  { key: "suggestion", label: "پیشنهاد", value: SUMMARY.suggestion, icon: faLightbulb, cls: "text-info", chip: "bg-info/12" },
  { key: "success", label: "موفق", value: SUMMARY.success, icon: faCircleCheck, cls: "text-success", chip: "bg-success/12" },
];

export function CheckupResults({ filter, setFilter, onOpenDetail, resolved, onResolve, onIgnore, onRescan }) {
  const sevOrder = { critical: 0, warning: 1, success: 2, info: 3 };
  const filters = [
    { id: "all", label: "همه" },
    { id: "critical", label: "بحرانی" },
    { id: "warning", label: "هشدار" },
    { id: "success", label: "موفق" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(var(--muted))" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(var(--primary))" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(SUMMARY.score / 100) * 264} 264`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold">{toFa(SUMMARY.score)}</span>
                <span className="text-[10px] text-muted-foreground">از ۱۰۰</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success" />
                <h2 className="text-lg font-extrabold">چکاپ کامل شد</h2>
              </div>
              <div className="mt-1"><Pill tone="success">وضعیت: خوب</Pill></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-muted px-4 py-2">
              <div className="text-[11px] text-muted-foreground">مدت زمان چکاپ</div>
              <div className="mt-0.5 text-sm font-bold" dir="ltr">{toFa(SUMMARY.duration)}</div>
            </div>
            <div className="rounded-lg bg-muted px-4 py-2">
              <div className="text-[11px] text-muted-foreground">تعداد بررسی‌ها</div>
              <div className="mt-0.5 text-sm font-bold">{toFa(SUMMARY.checks)}</div>
            </div>
            <div className="rounded-lg bg-muted px-4 py-2">
              <div className="text-[11px] text-muted-foreground">آخرین چکاپ</div>
              <div className="mt-0.5 text-sm font-bold">{SUMMARY.lastScan}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryCards.map((c) => (
            <div key={c.key} className={cn("rounded-lg border border-border p-3", c.chip)}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground">{c.label}</span>
                <FontAwesomeIcon icon={c.icon} className={cn("text-sm", c.cls)} />
              </div>
              <div className={cn("mt-1 text-2xl font-extrabold", c.cls)}>{toFa(c.value)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                filter === f.id ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={onRescan} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
          <FontAwesomeIcon icon={faRotate} className="text-xs" /> چکاپ مجدد
        </button>
      </div>

      {RESULT_GROUPS.map((g) => {
        const items = g.items
          .filter((it) => filter === "all" || it.severity === filter)
          .filter((it) => !resolved[it.id])
          .sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
        if (items.length === 0) return null;
        const Icon = groupIcons[g.key];
        return (
          <Panel key={g.key} title={g.label} action={<Pill tone="primary">{toFa(items.length)} مورد</Pill>}>
            <div className="space-y-2.5">
              {items.map((it) => {
                const s = SEVERITY[it.severity];
                return (
                  <div key={it.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border p-3">
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", s.chip)}>
                      <FontAwesomeIcon icon={s.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold">{it.title}</span>
                        <SeverityPill severity={it.severity} />
                      </div>
                      <div className="mt-0.5 text-[12px] text-muted-foreground">{it.desc}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span>مؤلفه: <span className="font-mono text-foreground" dir="ltr">{it.component}</span></span>
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faClock} className="text-[9px]" />{it.time}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button onClick={() => onOpenDetail(it)} className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[11px] font-medium hover:bg-muted">
                        <FontAwesomeIcon icon={faEye} className="text-[10px]" /> مشاهده جزئیات
                      </button>
                      <button onClick={() => onIgnore(it)} className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[11px] text-muted-foreground hover:bg-muted">
                        <FontAwesomeIcon icon={faXmark} className="text-[10px]" /> نادیده گرفتن
                      </button>
                      <button onClick={() => onResolve(it)} className="flex h-8 items-center gap-1.5 rounded-md border border-success/40 bg-success/10 px-2.5 text-[11px] font-semibold text-success hover:bg-success/15">
                        <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> حل شد
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        );
      })}

      {Object.keys(resolved).length > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-[12px] text-muted-foreground">
          <FontAwesomeIcon icon={faHistory} className="text-success" />
          {toFa(Object.keys(resolved).length)} مورد به‌عنوان حل‌شده یا نادیده‌گرفته علامت خورد
        </div>
      )}
    </div>
  );
}