import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStop, faWindowRestore, faCircleNotch,
  faPlug, faServer, faDatabase, faFileLines, faCircleXmark, faClock, faLock, faGlobe,
  faShieldHalved, faBug, faFileShield, faEnvelope, faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Panel, toFa } from "@/components/yguard/ui";
import { STAGES } from "@/lib/checkupData";
import { STAGE_STATUS } from "@/components/yguard/checkup/severity";
import { cn } from "@/lib/utils";

const logIcons = {
  faPlug, faServer, faDatabase, faFileLines, faCircleXmark, faClock, faLock, faGlobe,
  faShieldHalved, faBug, faFileShield, faEnvelope,
};
const logTone = { success: "text-success", info: "text-info", warning: "text-warning", danger: "text-destructive" };

function fmt(t) {
  const m = Math.floor(t / 60).toString().padStart(2, "0");
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return toFa(`${m}:${s}`);
}

export function CheckupRunning({ progress, elapsed, remaining, stageStatuses, logs, onStop, onBackground }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs.length]);

  const pct = Math.round(progress);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </span>
            <div>
              <div className="text-sm font-bold">در حال بررسی سایت...</div>
              <div className="text-[12px] text-muted-foreground">چکاپ جامع در حال اجراست — لطفاً صفحه را نبندید</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onBackground} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-[13px] font-medium hover:bg-muted">
              <FontAwesomeIcon icon={faWindowRestore} className="text-xs" /> اجر در پس‌زمینه
            </button>
            <button onClick={onStop} className="flex h-9 items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 text-[13px] font-semibold text-destructive hover:bg-destructive/15">
              <FontAwesomeIcon icon={faStop} className="text-xs" /> توقف چکاپ
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">پیشرفت</span>
            <span className="font-bold">{toFa(pct)}٪</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-muted p-2.5">
              <div className="text-[11px] text-muted-foreground">زمان سپری‌شده</div>
              <div className="mt-0.5 text-sm font-bold" dir="ltr">{fmt(elapsed)}</div>
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <div className="text-[11px] text-muted-foreground">زمان باقی‌مانده</div>
              <div className="mt-0.5 text-sm font-bold" dir="ltr">{fmt(remaining)}</div>
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <div className="text-[11px] text-muted-foreground">مرحله</div>
              <div className="mt-0.5 text-sm font-bold">{STAGES[Math.min(STAGES.length - 1, Math.floor((pct / 100) * STAGES.length))].label}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="مراحل چکاپ">
          <div className="grid gap-2 sm:grid-cols-2">
            {STAGES.map((s) => {
              const st = stageStatuses[s.key] || "waiting";
              const meta = STAGE_STATUS[st];
              return (
                <div key={s.key} className={cn("flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5", meta.ring)}>
                  <FontAwesomeIcon
                    icon={meta.icon}
                    className={cn("text-sm", meta.cls, st === "running" && "animate-spin")}
                  />
                  <span className="flex-1 text-[13px] font-medium">{s.label}</span>
                  <span className={cn("text-[11px] font-semibold", meta.cls)}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="رویدادهای چکاپ" action={<span className="text-[11px] text-muted-foreground">{toFa(logs.length)} رویداد</span>}>
          <div ref={logRef} className="-mx-5 -my-5 max-h-80 overflow-y-auto">
            {logs.length === 0 && (
              <div className="px-5 py-8 text-center text-[12px] text-muted-foreground">در انتظار رویداد...</div>
            )}
            {logs.map((l, i) => (
              <div key={i} className="flex gap-3 border-b border-border px-5 py-2.5 last:border-0">
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground" dir="ltr">{l.time}</span>
                <FontAwesomeIcon icon={logIcons[l.icon] || faCircle} className={cn("mt-0.5 text-xs", logTone[l.tone])} />
                <span className="flex-1 text-[12px]">{l.msg}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}