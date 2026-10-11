import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar, faPlus, faBell, faMessage, faEye, faEyeSlash, faRotate, faClock,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import { AddCriticalUrlDialog } from "@/components/yguard/pages/AddCriticalUrlDialog";
import { CRITICAL_URLS, httpTone } from "@/lib/pagesData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const httpLabel = (s) => (s === 0 ? "Timeout" : toFa(s));

export default function Critical() {
  const group = findGroup("critical");
  const [urls, setUrls] = useState(CRITICAL_URLS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabled, setDisabled] = useState({});

  const toggleMonitor = (id) => {
    setDisabled((d) => ({ ...d, [id]: !d[id] }));
    toast.message("وضعیت مانیتورینگ تغییر کرد");
  };

  const add = (form) => {
    setUrls((u) => [...u, { id: Date.now(), name: form.name, url: form.url, type: form.type, expected: parseInt(form.expected), interval: parseInt(form.interval), timeout: parseInt(form.timeout), threshold: parseInt(form.threshold), sms: form.sms, dashboard: form.dashboard, monitoring: true, status: 200, ms: 400 }]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faStar} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">صفحات حیاتی</h1>
            <p className="text-[13px] text-muted-foreground">صفحات مهم سایت با مانیتورینگ حساس‌تر</p>
          </div>
        </div>
        <button onClick={() => setDialogOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
          <FontAwesomeIcon icon={faPlus} className="text-xs" /> افزودن صفحه حیاتی
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {urls.map((u) => {
          const off = disabled[u.id];
          return (
            <div key={u.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold">{u.name}</div>
                    <div className="font-mono text-[12px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{u.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={httpTone[u.status]}>{httpLabel(u.status)}</Pill>
                  <span className={cn("inline-flex h-2 w-2 rounded-full", off ? "bg-muted-foreground/30" : "bg-success")} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Expected Status</div>
                  <div className="mt-0.5 font-mono text-[13px] font-semibold" dir="ltr">{toFa(u.expected)}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Interval</div>
                  <div className="mt-0.5 font-mono text-[13px] font-semibold" dir="ltr">{toFa(u.interval)} sec</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Timeout</div>
                  <div className="mt-0.5 font-mono text-[13px] font-semibold" dir="ltr">{toFa(u.timeout)} sec</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Failure Threshold</div>
                  <div className="mt-0.5 font-mono text-[13px] font-semibold" dir="ltr">{toFa(u.threshold)}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-[10px] text-muted-foreground">SMS Alert</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[13px] font-semibold">
                    <FontAwesomeIcon icon={faMessage} className={cn("text-[10px]", u.sms ? "text-success" : "text-muted-foreground/40")} /> {u.sms ? "فعال" : "غیرفعال"}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Dashboard Alert</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[13px] font-semibold">
                    <FontAwesomeIcon icon={faBell} className={cn("text-[10px]", u.dashboard ? "text-success" : "text-muted-foreground/40")} /> {u.dashboard ? "فعال" : "غیرفعال"}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <FontAwesomeIcon icon={faClock} className="text-[10px]" /> آخرین پاسخ: <span className="font-mono" dir="ltr">{toFa(u.ms)}ms</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toast.success(`بررسی مجدد ${u.name}`)} className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[11px] font-medium hover:bg-muted">
                    <FontAwesomeIcon icon={faRotate} className="text-[10px]" /> بررسی
                  </button>
                  <button onClick={() => toggleMonitor(u.id)} className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[11px] font-medium hover:bg-muted">
                    <FontAwesomeIcon icon={off ? faEye : faEyeSlash} className="text-[10px]" /> {off ? "فعال" : "غیرفعال"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddCriticalUrlDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={add} />
    </div>
  );
}