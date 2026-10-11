import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStethoscope, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { IconBadge, toFa } from "@/components/yguard/ui";
import { CheckupIdle } from "@/components/yguard/checkup/CheckupIdle";
import { CheckupRunning } from "@/components/yguard/checkup/CheckupRunning";
import { CheckupResults } from "@/components/yguard/checkup/CheckupResults";
import { ResultDrawer } from "@/components/yguard/checkup/ResultDrawer";
import { STAGES, LOG_EVENTS, CHECKLIST } from "@/lib/checkupData";
import { findGroup } from "@/lib/nav";
import { toast } from "sonner";

// Deterministic final status per stage (mock)
const FINAL_STATUS = {
  server: "passed", wordpress: "passed", php: "passed", database: "warning",
  plugins: "warning", themes: "passed", pages: "critical", performance: "critical",
  rest: "passed", cron: "warning", security: "warning", files: "passed",
  ssl: "passed", dns: "passed", email: "warning", cache: "warning", report: "passed",
};

function fmtFa(t) {
  const m = Math.floor(t / 60).toString().padStart(2, "0");
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return toFa(`${m}:${s}`);
}

export default function FullCheckup() {
  const group = findGroup("full-checkup");
  const [phase, setPhase] = useState("idle");
  const [preset, setPreset] = useState("standard");
  const [selected, setSelected] = useState(["سرور", "WordPress", "PHP", "Database", "افزونه‌ها", "قالب‌ها", "صفحات", "Performance", "REST API", "Cron", "امنیت", "SSL", "DNS", "Cache"]);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [stageStatuses, setStageStatuses] = useState({});
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [resolved, setResolved] = useState({});
  const [detail, setDetail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const timer = useRef(null);
  const logIdx = useRef(0);

  useEffect(() => () => clearInterval(timer.current), []);

  const startScan = () => {
    if (selected.length === 0) {
      toast.error("حداقل یک بخش را انتخاب کنید");
      return;
    }
    setProgress(0);
    setElapsed(0);
    setStageStatuses({});
    setLogs([]);
    setResolved({});
    setFilter("all");
    logIdx.current = 0;
    setPhase("running");

    const total = 150; // ticks to reach 100%
    let p = 0;
    let el = 0;
    let tick = 0;
    timer.current = setInterval(() => {
      tick += 1;
      p = Math.min(100, p + (100 / total) * (0.8 + Math.random() * 0.6));
      el = (tick / total) * 150; // ~150s simulated, scaled
      setProgress(p);
      setElapsed(el);

      const stageCount = STAGES.length;
      const currentIdx = Math.min(stageCount - 1, Math.floor((p / 100) * stageCount));
      setStageStatuses((prev) => {
        const next = { ...prev };
        for (let i = 0; i < stageCount; i++) {
          const key = STAGES[i].key;
          if (i < currentIdx) next[key] = FINAL_STATUS[key] || "passed";
          else if (i === currentIdx) next[key] = "running";
          else next[key] = "waiting";
        }
        return next;
      });

      // push a log event every few ticks
      if (tick % 4 === 0) {
        const ev = LOG_EVENTS[logIdx.current % LOG_EVENTS.length];
        logIdx.current += 1;
        setLogs((l) => [...l, { ...ev, time: fmtFa(el) }]);
      }

      if (p >= 100) {
        clearInterval(timer.current);
        setStageStatuses(() => {
          const next = {};
          STAGES.forEach((s) => { next[s.key] = FINAL_STATUS[s.key] || "passed"; });
          return next;
        });
        setPhase("complete");
        toast.success("چکاپ کامل شد");
      }
    }, 200);
  };

  const stopScan = () => {
    clearInterval(timer.current);
    setPhase("idle");
    toast.message("چکاپ متوقف شد");
  };

  const background = () => {
    toast.success("چکاپ در پس‌زمینه ادامه دارد");
  };

  const openDetail = (item) => { setDetail(item); setDrawerOpen(true); };
  const resolve = (item) => { setResolved((r) => ({ ...r, [item.id]: "resolved" })); toast.success("به‌عنوان حل‌شده علامت خورد"); };
  const ignore = (item) => { setResolved((r) => ({ ...r, [item.id]: "ignored" })); toast.message("نادیده گرفته شد"); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faStethoscope} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">چکاپ کامل سایت</h1>
            <p className="text-[13px] text-muted-foreground">{group ? `${group.title} · ` : ""}بررسی جامع سلامت، عملکرد، امنیت و زیرساخت سایت</p>
          </div>
        </div>
        {phase === "complete" && (
          <span className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-1.5 text-[12px] font-semibold text-success">
            <FontAwesomeIcon icon={faCircleCheck} /> چکاپ کامل شد
          </span>
        )}
      </div>

      {phase === "idle" && (
        <CheckupIdle
          preset={preset}
          setPreset={setPreset}
          selected={selected}
          setSelected={setSelected}
          onStart={startScan}
          onSettings={() => toast("باز کردن تنظیمات چکاپ")}
        />
      )}

      {phase === "running" && (
        <CheckupRunning
          progress={progress}
          elapsed={elapsed}
          remaining={Math.max(0, (elapsed / Math.max(1, progress)) * (100 - progress))}
          stageStatuses={stageStatuses}
          logs={logs}
          onStop={stopScan}
          onBackground={background}
        />
      )}

      {phase === "complete" && (
        <CheckupResults
          filter={filter}
          setFilter={setFilter}
          onOpenDetail={openDetail}
          resolved={resolved}
          onResolve={resolve}
          onIgnore={ignore}
          onRescan={() => { setPhase("idle"); }}
        />
      )}

      <ResultDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        item={detail}
        onResolve={resolve}
        onIgnore={ignore}
      />
    </div>
  );
}