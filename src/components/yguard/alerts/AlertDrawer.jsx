import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation, faTriangleExclamation, faCircleInfo, faCircleCheck, faBell,
  faGaugeHigh, faPaperPlane, faClock, faShieldHalved, faFileLines, faServer,
  faCircleQuestion, faLightbulb, faListUl, faPaperclip, faNetworkWired, faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Pill, toFa } from "@/components/yguard/ui";
import { ALERT_TIMELINE, severityMap } from "@/lib/alertsData";
import { cn } from "@/lib/utils";

const faIconMap = {
  faCircleExclamation, faTriangleExclamation, faCircleInfo, faCircleCheck, faBell,
  faGaugeHigh, faPaperPlane, faClock, faShieldHalved, faFileLines, faServer,
};

function InfoField({ label, value, ltr }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono")} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>{value}</div>
    </div>
  );
}

const toneText = { danger: "text-destructive", warning: "text-warning", info: "text-info", success: "text-success", primary: "text-primary" };

export function AlertDrawer({ open, onOpenChange, alert }) {
  if (!alert) return null;
  const sev = severityMap[alert.severity] || severityMap.medium;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-2xl" dir="rtl">
        <SheetHeader className="border-b border-border bg-card p-5 text-right" dir="rtl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Pill tone={sev.tone}>{sev.label}</Pill>
                <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{alert.id}</span>
              </div>
              <SheetTitle className="text-base font-extrabold">{alert.title}</SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">{alert.source} · {alert.component}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 p-5" dir="rtl">
          {/* ── خلاصه ── */}
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
              <FontAwesomeIcon icon={faFileLines} className="text-xs text-primary" />
              خلاصه
            </h4>
            <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">{alert.description}</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <InfoField label="Severity" value={sev.label} />
              <InfoField label="بخش" value={alert.category} />
              <InfoField label="منبع" value={alert.source} />
              <InfoField label="بخش تحت تاثیر" value={alert.component} />
              <InfoField label="اولین شناسایی" value={alert.firstDetected} ltr />
              <InfoField label="آخرین رخداد" value={alert.lastDetected} ltr />
              <InfoField label="تعداد رخداد" value={toFa(alert.occurrences)} ltr />
              <InfoField label="وضعیت" value={alert.status === "open" ? "باز" : alert.status === "resolved" ? "حل‌شده" : alert.status === "acknowledged" ? "تأییدشده" : alert.status === "ignored" ? "نادیده‌گرفته‌شده" : "Snoozed"} />
              <InfoField label="اعلان" value={alert.notified.join("، ")} />
            </div>
          </section>

          {/* ── Timeline ── */}
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
              <FontAwesomeIcon icon={faClock} className="text-xs text-primary" />
              Timeline
            </h4>
            <div className="relative space-y-3 pr-6">
              <div className="absolute right-[11px] top-1 bottom-1 w-px bg-border" />
              {ALERT_TIMELINE.map((t, i) => {
                const Icon = faIconMap[t.icon] || faBell;
                return (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className={cn("absolute right-[-24px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-card", toneText[t.tone])}>
                      <FontAwesomeIcon icon={Icon} className="text-[10px]" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{t.time}</span>
                      <p className="text-[13px] font-medium">{t.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Evidence ── */}
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
              <FontAwesomeIcon icon={faPaperclip} className="text-xs text-primary" />
              Evidence
            </h4>
            <div className="space-y-2">
              {alert.evidence.map((e, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="text-[12px] text-muted-foreground">{e.type}</span>
                  <span className="font-mono text-[12px] font-semibold" dir="ltr">{e.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Affected Resources ── */}
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
              <FontAwesomeIcon icon={faNetworkWired} className="text-xs text-primary" />
              منابع تحت تاثیر
            </h4>
            <div className="flex flex-wrap gap-2">
              {alert.affectedResources.map((r, i) => (
                <span key={i} className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-[12px]" dir="ltr">{r}</span>
              ))}
            </div>
          </section>

          {/* ── Notification History ── */}
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
              <FontAwesomeIcon icon={faEnvelope} className="text-xs text-primary" />
              تاریخچه اعلان
            </h4>
            <div className="space-y-2">
              {alert.notified.map((ch, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="text-[12px] font-medium">{ch}</span>
                  <Pill tone="success">ارسال شد</Pill>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recommended Actions ── */}
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold">
              <FontAwesomeIcon icon={faLightbulb} className="text-xs text-primary" />
              اقدامات پیشنهادی
            </h4>
            <div className="space-y-2">
              {alert.recommendedActions.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">{toFa(i + 1)}</span>
                  <span className="text-[13px]">{a}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
