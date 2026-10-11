import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { PROFILING_PAGES, PROFILING_DURATIONS, PROFILING_LIVE } from "@/lib/performanceData";
import { cn } from "@/lib/utils";
import { toFa } from "@/components/yguard/ui";

export function DeepProfilingDialog({ open, onOpenChange }) {
  const [page, setPage] = useState("home");
  const [duration, setDuration] = useState("5r");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setRunning(false); setDone(false); setProgress(0); setRows([]);
      setPage("home"); setDuration("5r");
    }
  }, [open]);

  useEffect(() => {
    if (running && !done) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const np = p + 1;
          if (np <= PROFILING_LIVE.length) {
            setRows(PROFILING_LIVE.slice(0, np));
          }
          if (np >= 5) {
            clearInterval(timerRef.current);
            setRunning(false);
            setDone(true);
          }
          return np;
        });
      }, 800);
      return () => clearInterval(timerRef.current);
    }
  }, [running, done]);

  const start = () => { setRows([]); setProgress(0); setDone(false); setRunning(true); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-base font-extrabold">
            <FontAwesomeIcon icon={faBolt} className="text-warning" /> Deep Profiling
          </DialogTitle>
          <DialogDescription className="text-right text-[12px]">
            این حالت برای مدت کوتاهی جزئیات بیشتری از اجرای صفحات انتخاب‌شده جمع‌آوری می‌کند.
          </DialogDescription>
        </DialogHeader>

        {!running && !done && (
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-[12px] font-semibold">صفحه</div>
              <div className="grid grid-cols-3 gap-2">
                {PROFILING_PAGES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPage(p.id)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors",
                      page === p.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[12px] font-semibold">مدت Profiling</div>
              <div className="grid grid-cols-3 gap-2">
                {PROFILING_DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDuration(d.id)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors",
                      duration === d.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={start}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90"
            >
              <FontAwesomeIcon icon={faBolt} className="text-xs" /> شروع Profiling
            </button>
          </div>
        )}

        {running && !done && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold">در حال Profiling...</span>
              <span className="font-mono text-[13px] text-primary" dir="ltr">{toFa(progress)} / {toFa(5)} Requests</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(progress / 5) * 100}%` }} />
            </div>
            <div className="space-y-1.5">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]">
                  <span className="font-medium">{r.page}</span>
                  <span className="font-mono text-muted-foreground" dir="ltr">{r.ms >= 1000 ? `${(r.ms / 1000).toFixed(1)}s` : `${toFa(r.ms)}ms`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {done && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-[13px] text-success">
              <FontAwesomeIcon icon={faCircleCheck} /> Profiling با موفقیت تکمیل شد.
            </div>
            <div className="text-[12px] font-semibold text-muted-foreground">گزارش مقایسه</div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-[12px]">
                <thead className="bg-muted/60 text-[10px] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-right font-semibold">صفحه</th>
                    <th className="px-3 py-2 text-right font-semibold">زمان پاسخ</th>
                    <th className="px-3 py-2 text-right font-semibold">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PROFILING_LIVE.map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium">{r.page}</td>
                      <td className="px-3 py-2 font-mono" dir="ltr">{r.ms >= 1000 ? `${(r.ms / 1000).toFixed(1)}s` : `${toFa(r.ms)}ms`}</td>
                      <td className="px-3 py-2"><Pill tone={r.ms > 1000 ? "danger" : r.ms > 500 ? "warning" : "success"}>{r.ms > 1000 ? "کند" : r.ms > 500 ? "متوسط" : "سریع"}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => onOpenChange(false)} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border text-[13px] font-medium hover:bg-muted">
              <FontAwesomeIcon icon={faCircleXmark} className="text-xs" /> بستن
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Pill({ tone, children }) {
  const tones = { success: "bg-success/12 text-success", warning: "bg-warning/15 text-warning", danger: "bg-destructive/12 text-destructive" };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold", tones[tone])}>{children}</span>;
}