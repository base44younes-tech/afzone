import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck, faPlus, faEye, faPencil, faTrash, faSliders, faArrowLeft,
  faWater, faSkullCrossbones, faHouseCircleExclamation, faServer, faDatabase, faClock,
  faPlug, faLock, faGlobe, faNetworkWired, faFileShield, faFileCircleExclamation, faBug,
  faGaugeHigh, faHardDrive, faBell, faPaperPlane, faEnvelope, faComments, faTowerBroadcast, faBan,
  faClockRotateLeft, faSave, faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import {
  RULE_CATEGORIES, ALERT_RULES, RULE_TEMPLATES, SEVERITIES, severityMap,
  RULE_BUILDER_METRICS, RULE_BUILDER_OPERATORS, RULE_BUILDER_TIME_WINDOWS,
  RULE_BUILDER_ACTIONS, COOLDOWN_OPTIONS,
} from "@/lib/alertsData";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tplIconMap = {
  faWater, faSkullCrossbones, faHouseCircleExclamation, faServer, faDatabase, faClock,
  faPlug, faLock, faGlobe, faNetworkWired, faFileShield, faFileCircleExclamation, faBug,
  faGaugeHigh, faHardDrive,
};
const actionIconMap = { faBell, faPaperPlane, faEnvelope, faComments, faTowerBroadcast, faBan };

export default function AlertRules() {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState(ALERT_RULES);
  const [catTab, setCatTab] = useState("all");
  const [builderOpen, setBuilderOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    if (catTab === "all") return rules;
    return rules.filter((r) => r.category === catTab);
  }, [rules, catTab]);

  const toggleRule = (id) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
    const r = rules.find((x) => x.id === id);
    toast.success(r.enabled ? "قانون غیرفعال شد" : "قانون فعال شد");
  };

  const useTemplate = (tpl) => {
    toast.success(`الگوی «${tpl.name}» اعمال شد`);
    setBuilderOpen(true);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faListCheck} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">قوانین هشدار</h1>
            <p className="text-[13px] text-muted-foreground">تعریف شرایط، Thresholdها و کانال‌های اطلاع‌رسانی</p>
          </div>
        </div>
        <button onClick={() => setBuilderOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
          <FontAwesomeIcon icon={faPlus} className="text-xs" /> قانون جدید
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setCatTab("all")} className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", catTab === "all" ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}>همه</button>
        {RULE_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCatTab(c)} className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", catTab === c ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}>{c}</button>
        ))}
      </div>

      {/* Rule Cards */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const sev = severityMap[r.severity];
            return (
              <div key={r.id} className={cn("rounded-xl border border-border bg-card p-4 shadow-card transition-opacity", !r.enabled && "opacity-60")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Pill tone={sev.tone}>{sev.label}</Pill>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{r.category}</span>
                  </div>
                  <Switch checked={r.enabled} onCheckedChange={() => toggleRule(r.id)} />
                </div>
                <h3 className="mt-3 text-[14px] font-bold">{r.name}</h3>
                <div className="mt-3 space-y-1.5 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Threshold</span>
                    <span className="font-mono font-semibold" dir="ltr">{r.threshold}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time Window</span>
                    <span className="font-mono" dir="ltr">{r.timeWindow}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cooldown</span>
                    <span className="font-mono" dir="ltr">{r.cooldown}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">آخرین اجرا</span>
                    <span className="font-mono" dir="ltr">{r.lastTriggered}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {r.channels.map((ch) => <span key={ch} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{ch}</span>)}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-muted-foreground">{toFa(r.occurrences)} رخداد</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => toast("ویرایش قانون باز شد")} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><FontAwesomeIcon icon={faPencil} className="text-xs" /></button>
                    <button onClick={() => toast.success("قانون حذف شد")} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visual Rule Builder */}
      {builderOpen && <RuleBuilder onClose={() => setBuilderOpen(false)} />}

      {/* Rule Templates */}
      <Panel title="قوانین آماده" action={<Pill tone="primary">{toFa(RULE_TEMPLATES.length)} الگو</Pill>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {RULE_TEMPLATES.map((tpl) => {
            const Icon = tplIconMap[tpl.icon] || faBell;
            const sev = severityMap[tpl.severity];
            return (
              <div key={tpl.id} className="flex flex-col rounded-xl border border-border bg-card p-3.5 shadow-card">
                <div className="flex items-center justify-between">
                  <IconBadge icon={Icon} tone={sev.tone} className="h-9 w-9" />
                  <Pill tone={sev.tone}>{sev.label}</Pill>
                </div>
                <h4 className="mt-3 text-[13px] font-bold">{tpl.name}</h4>
                <span className="mt-1 text-[11px] text-muted-foreground">{tpl.category}</span>
                <button
                  onClick={() => useTemplate(tpl)}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-primary bg-primary-soft py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-xs" />
                  استفاده از این Rule
                </button>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// ── Visual Rule Builder ─────────────────────────────────────
function RuleBuilder({ onClose }) {
  const [metric, setMetric] = useState(RULE_BUILDER_METRICS[0]);
  const [operator, setOperator] = useState(RULE_BUILDER_OPERATORS[0]);
  const [value, setValue] = useState("500");
  const [timeWindow, setTimeWindow] = useState(RULE_BUILDER_TIME_WINDOWS[0]);
  const [occurrence, setOccurrence] = useState("1");
  const [target, setTarget] = useState("");
  const [selectedActions, setSelectedActions] = useState(["dashboard", "sms"]);
  const [severity, setSeverity] = useState("critical");
  const [cooldown, setCooldown] = useState(COOLDOWN_OPTIONS[2]);

  const toggleAction = (id) => {
    setSelectedActions((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const save = () => {
    toast.success("قانون جدید ذخیره شد");
    onClose();
  };

  return (
    <Panel
      title="Visual Rule Builder"
      action={
        <div className="flex gap-2">
          <button onClick={onClose} className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-[12px] font-medium hover:bg-muted">انصراف</button>
          <button onClick={save} className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            <FontAwesomeIcon icon={faSave} className="text-xs" /> ذخیره قانون
          </button>
        </div>
      }
    >
      <div className="space-y-5" dir="rtl">
        {/* IF block */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">IF</span>
            شرط
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Metric</label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>{RULE_BUILDER_METRICS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Operator</label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>{RULE_BUILDER_OPERATORS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Value</label>
              <input value={value} onChange={(e) => setValue(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[12px] outline-none focus:border-primary" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Target (اختیاری)</label>
              <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="مثلاً IP یا URL" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12px] outline-none focus:border-primary" dir="ltr" />
            </div>
          </div>
        </div>

        {/* WITHIN / FOR block */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-info text-[11px] font-bold text-info-foreground" style={{ color: "oklch(var(--info))" }}>WITHIN</span>
            بازه زمانی
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Time Window</label>
              <Select value={timeWindow} onValueChange={setTimeWindow}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>{RULE_BUILDER_TIME_WINDOWS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Occurrence Count</label>
              <input value={occurrence} onChange={(e) => setOccurrence(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[12px] outline-none focus:border-primary" dir="ltr" />
            </div>
          </div>
        </div>

        {/* THEN block */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-destructive text-[11px] font-bold text-destructive-foreground">THEN</span>
            اقدامات
          </div>
          <div className="flex flex-wrap gap-2">
            {RULE_BUILDER_ACTIONS.map((act) => {
              const active = selectedActions.includes(act.id);
              const Icon = actionIconMap[act.icon] || faBell;
              return (
                <button
                  key={act.id}
                  onClick={() => toggleAction(act.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors",
                    active ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <FontAwesomeIcon icon={Icon} className="text-xs" />
                  {act.label}
                  {active && <FontAwesomeIcon icon={faClockRotateLeft} className="text-[9px]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity & Cooldown */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold">Severity</label>
            <div className="flex flex-wrap gap-1.5">
              {SEVERITIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeverity(s.id)}
                  className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", severity === s.id ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold">Cooldown</label>
            <div className="flex flex-wrap gap-1.5">
              {COOLDOWN_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCooldown(c)}
                  className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", cooldown === c ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/30 p-4">
          <div className="mb-2 text-[12px] font-bold text-primary">پیش‌نمایش قانون</div>
          <div className="font-mono text-[12px] leading-relaxed text-muted-foreground" dir="ltr" style={{ textAlign: "left" }}>
            <div>IF <span className="font-bold text-foreground">{metric}</span> {operator} <span className="font-bold text-foreground">{value}</span></div>
            <div>WITHIN <span className="font-bold text-foreground">{timeWindow}</span> ({occurrence} occurrence{Number(occurrence) > 1 ? "s" : ""})</div>
            <div>THEN: <span className="font-bold text-foreground">{selectedActions.map((a) => RULE_BUILDER_ACTIONS.find((x) => x.id === a)?.label).join(" + ")}</span></div>
            <div>Severity: <span className="font-bold text-foreground">{severityMap[severity]?.label}</span> · Cooldown: <span className="font-bold text-foreground">{cooldown}</span></div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
