import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane, faEnvelope, faComments, faTowerBroadcast, faBell, faCircleCheck, faCircleXmark,
  faCircleInfo, faClock, faPlus, faTrash, faPencil, faEye, faEyeSlash, faPlug,
  faShieldHalved, faChartLine, faServer, faBolt, faMobileScreen, faGlobe, faDatabase,
  faMoon, faCalendarDay, faWrench, faTableList, faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CHANNEL_CARDS, SMS_RECEIVERS, RECEIVER_ALERT_TYPES, SMS_MODES, SMS_ALERT_GROUPS,
  NOTIFICATION_HISTORY, NOTIF_STATUS_MAP, SEVERITIES,
} from "@/lib/alertsData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const channelIconMap = { faPaperPlane, faEnvelope, faComments, faTowerBroadcast };
const groupIconMap = { faShieldHalved, faChartLine, faServer, faBolt };

export default function Channels() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("channels");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faPaperPlane} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">کانال‌های اطلاع‌رسانی</h1>
            <p className="text-[13px] text-muted-foreground">مدیریت SMS، ایمیل، تلگرام و Webhook</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap gap-1 bg-card p-1.5">
          <TabsTrigger value="channels" className="text-[12px]">کانال‌ها</TabsTrigger>
          <TabsTrigger value="sms" className="text-[12px]">تنظیمات ملی پیامک</TabsTrigger>
          <TabsTrigger value="receivers" className="text-[12px]">گیرندگان</TabsTrigger>
          <TabsTrigger value="selection" className="text-[12px]">انتخاب هشدارها</TabsTrigger>
          <TabsTrigger value="preview" className="text-[12px]">پیش‌نمایش</TabsTrigger>
          <TabsTrigger value="antispam" className="text-[12px]">کنترل ارسال</TabsTrigger>
          <TabsTrigger value="quiet" className="text-[12px]">ساعات عدم مزاحمت</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-[12px]">بازه تعمیر</TabsTrigger>
          <TabsTrigger value="history" className="text-[12px]">تاریخچه اعلان</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : (
        <>
          {tab === "channels" && <ChannelsTab />}
          {tab === "sms" && <SMSTab />}
          {tab === "receivers" && <ReceiversTab />}
          {tab === "selection" && <SelectionTab />}
          {tab === "preview" && <PreviewTab />}
          {tab === "antispam" && <AntiSpamTab />}
          {tab === "quiet" && <QuietHoursTab />}
          {tab === "maintenance" && <MaintenanceTab />}
          {tab === "history" && <HistoryTab />}
        </>
      )}
    </div>
  );
}

// ── Channels Tab ────────────────────────────────────────────
function ChannelsTab() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CHANNEL_CARDS.map((ch) => {
        const Icon = channelIconMap[ch.icon] || faBell;
        return (
          <div key={ch.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <IconBadge icon={Icon} tone={ch.tone} className="h-10 w-10" />
              <Pill tone={ch.tone}>{ch.statusLabel}</Pill>
            </div>
            <h3 className="mt-3 text-[14px] font-bold">{ch.name}</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{ch.desc}</p>
            <button
              onClick={() => toast(ch.status === "connected" ? "تنظیمات کانال باز شد" : "کانال در حال آماده‌سازی است")}
              className={cn("mt-3 w-full rounded-lg border py-2 text-[12px] font-medium transition-colors", ch.status === "connected" ? "border-primary bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted")}
            >
              {ch.status === "connected" ? "تنظیمات" : ch.status === "coming" ? "به‌زودی" : "فعال‌سازی"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── SMS Settings Tab ────────────────────────────────────────
function SMSTab() {
  const [showPass, setShowPass] = useState(false);
  const [testState, setTestState] = useState("idle");
  const [testMsg, setTestMsg] = useState("");

  const testConnection = () => {
    setTestState("loading");
    setTestMsg("در حال بررسی...");
    setTimeout(() => {
      setTestState("success");
      setTestMsg("اتصال موفق");
      toast.success("اتصال به ملی پیامک برقرار شد");
    }, 1500);
  };

  const sendTestSMS = () => {
    setTestState("loading");
    setTestMsg("در حال ارسال...");
    setTimeout(() => {
      setTestState("success");
      setTestMsg("پیامک آزمایشی ارسال شد");
      toast.success("پیامک آزمایشی با موفقیت ارسال شد");
    }, 1800);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Connection Settings */}
      <Panel title="تنظیمات اتصال ملی پیامک" className="lg:col-span-2">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <FontAwesomeIcon icon={faMobileScreen} className="text-sm text-primary" />
          <span className="text-[12px] font-medium">ملی پیامک</span>
          <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">melipayamak.com</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">نام کاربری وب‌سرویس</label>
            <input className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary" dir="ltr" placeholder="username" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">رمز وب‌سرویس</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 pl-10 text-[13px] outline-none focus:border-primary"
                dir="ltr"
                placeholder="••••••••"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                type="button"
              >
                <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className="text-xs" />
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">شماره ارسال‌کننده</label>
            <input className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary" dir="ltr" placeholder="3000xxxxx" />
          </div>
          <div className="flex gap-2">
            <button onClick={testConnection} disabled={testState === "loading"} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-70">
              <FontAwesomeIcon icon={faPlug} className={cn("text-xs", testState === "loading" && "animate-pulse")} />
              {testState === "loading" ? "در حال بررسی..." : "تست اتصال"}
            </button>
            <button onClick={sendTestSMS} disabled={testState === "loading"} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-medium hover:bg-muted disabled:opacity-70">
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              ارسال پیامک آزمایشی
            </button>
          </div>
          {testMsg && (
            <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium", testState === "success" ? "border-success/30 bg-success/10 text-success" : "border-info/30 bg-info/10 text-info")}>
              <FontAwesomeIcon icon={testState === "success" ? faCircleCheck : faCircleInfo} className="text-xs" />
              {testMsg}
            </div>
          )}
        </div>
      </Panel>

      {/* Connection Status */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h3 className="text-[13px] font-bold">وضعیت اتصال</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/12">
              <FontAwesomeIcon icon={faCircleCheck} className="text-lg text-success" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-success">متصل</div>
              <div className="text-[11px] text-muted-foreground">آخرین تست: ۲ دقیقه پیش</div>
            </div>
          </div>
        </div>

        {/* Sending Mode */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h3 className="mb-3 text-[13px] font-bold">حالت ارسال</h3>
          <div className="space-y-2">
            {SMS_MODES.map((m, i) => (
              <label key={m.id} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5 hover:bg-muted/40">
                <input type="radio" name="sms-mode" defaultChecked={i === 0} className="accent-primary" />
                <span className="text-[13px] font-medium">{m.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-3 space-y-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Pattern Code</label>
              <input className="h-8 w-full rounded-md border border-border bg-background px-2.5 font-mono text-[12px] outline-none focus:border-primary" dir="ltr" placeholder="xxxxx" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Variables Preview</label>
              <div className="font-mono text-[11px] text-muted-foreground" dir="ltr">%title% %severity% %site%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Receivers Tab ───────────────────────────────────────────
function ReceiversTab() {
  const [receivers, setReceivers] = useState(SMS_RECEIVERS);
  const [addOpen, setAddOpen] = useState(false);
  const [newR, setNewR] = useState({ name: "", phone: "", alertType: RECEIVER_ALERT_TYPES[0] });

  const addReceiver = () => {
    if (!newR.name || !newR.phone) { toast.error("نام و شماره را وارد کنید"); return; }
    setReceivers((prev) => [...prev, { id: Date.now(), ...newR, status: "active" }]);
    setNewR({ name: "", phone: "", alertType: RECEIVER_ALERT_TYPES[0] });
    setAddOpen(false);
    toast.success("گیرنده جدید اضافه شد");
  };

  const toggleStatus = (id) => {
    setReceivers((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r));
  };

  const removeReceiver = (id) => {
    setReceivers((prev) => prev.filter((r) => r.id !== id));
    toast.success("گیرنده حذف شد");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold">گیرندگان هشدار</h3>
        <button onClick={() => setAddOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
          <FontAwesomeIcon icon={faPlus} className="text-xs" /> افزودن گیرنده
        </button>
      </div>
      <Panel>
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-right font-semibold">نام</th>
                <th className="px-5 py-2.5 text-right font-semibold">شماره موبایل</th>
                <th className="px-5 py-2.5 text-right font-semibold">نوع هشدار</th>
                <th className="px-5 py-2.5 text-right font-semibold">وضعیت</th>
                <th className="px-5 py-2.5 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {receivers.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3 font-semibold">{r.name}</td>
                  <td className="px-5 py-3 font-mono text-[12px]" dir="ltr">{r.phone}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.alertType}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleStatus(r.id)}>
                      <Pill tone={r.status === "active" ? "success" : "warning"}>{r.status === "active" ? "فعال" : "غیرفعال"}</Pill>
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => toast("ویرایش گیرنده")} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><FontAwesomeIcon icon={faPencil} className="text-xs" /></button>
                      <button onClick={() => removeReceiver(r.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add Receiver Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-base font-extrabold">افزودن گیرنده</DialogTitle>
            <DialogDescription className="text-right">گیرنده جدید برای اعلان‌های پیامک اضافه کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">نام</label>
              <input value={newR.name} onChange={(e) => setNewR({ ...newR, name: e.target.value })} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary" placeholder="نام گیرنده" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">شماره موبایل</label>
              <input value={newR.phone} onChange={(e) => setNewR({ ...newR, phone: e.target.value })} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary" dir="ltr" placeholder="09xxxxxxxxx" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] text-muted-foreground">نوع هشدار</label>
              <select value={newR.alertType} onChange={(e) => setNewR({ ...newR, alertType: e.target.value })} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary">
                {RECEIVER_ALERT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>انصراف</Button>
            <Button onClick={addReceiver}>افزودن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── SMS Alert Selection Tab ─────────────────────────────────
function SelectionTab() {
  const [selected, setSelected] = useState(new Set(["Request Flood", "Homepage Down", "Database Failure"]));

  const toggle = (alert) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(alert)) next.delete(alert); else next.add(alert);
      return next;
    });
  };

  return (
    <Panel title="انتخاب هشدارهای پیامک" action={<Pill tone="primary">{toFa(selected.size)} انتخاب‌شده</Pill>}>
      <Accordion type="multiple" defaultValue={["security", "uptime", "system", "performance"]} className="space-y-2">
        {SMS_ALERT_GROUPS.map((g) => {
          const Icon = groupIconMap[g.icon] || faBell;
          return (
            <AccordionItem key={g.id} value={g.id} className="rounded-lg border border-border">
              <AccordionTrigger className="flex items-center gap-2 px-4 py-3 text-[13px] font-bold hover:no-underline">
                <FontAwesomeIcon icon={Icon} className="text-xs text-primary" />
                {g.title}
                <span className="mr-auto text-[11px] text-muted-foreground">{toFa(g.alerts.length)} هشدار</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {g.alerts.map((a) => (
                    <label key={a} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5 hover:bg-muted/40">
                      <Checkbox checked={selected.has(a)} onCheckedChange={() => toggle(a)} />
                      <span className="text-[12px] font-medium">{a}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Panel>
  );
}

// ── SMS Preview Tab ─────────────────────────────────────────
function PreviewTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="پیش‌نمایش پیامک هشدار">
        <div className="mx-auto max-w-xs">
          <div className="rounded-2xl border border-border bg-muted/30 p-4 shadow-card" dir="rtl">
            <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-sm text-primary" />
              <span className="text-[13px] font-bold">YGuard هشدار امنیتی</span>
            </div>
            <div className="space-y-1.5 text-[12px] leading-relaxed">
              <p>IP <span className="font-mono" dir="ltr">185.xxx.xxx.xxx</span></p>
              <p>در ۶۰ ثانیه <span className="font-bold">۸۲۶</span> درخواست ارسال کرده است.</p>
              <div className="pt-1">
                <span className="text-muted-foreground">وضعیت:</span>{" "}
                <span className="font-bold text-destructive">Critical</span>
              </div>
              <div>
                <span className="text-muted-foreground">سایت:</span>{" "}
                <span className="font-mono" dir="ltr">example.com</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="پیش‌نمایش پیامک قطعی">
        <div className="mx-auto max-w-xs">
          <div className="rounded-2xl border border-border bg-muted/30 p-4 shadow-card" dir="rtl">
            <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
              <FontAwesomeIcon icon={faServer} className="text-sm text-destructive" />
              <span className="text-[13px] font-bold">YGuard</span>
            </div>
            <div className="space-y-1.5 text-[12px] leading-relaxed">
              <p>صفحه اصلی سایت در دسترس نیست.</p>
              <p><span className="font-mono font-bold" dir="ltr">HTTP 503</span></p>
              <div>
                <span className="text-muted-foreground">مدت اختلال:</span>{" "}
                <span className="font-bold">۳ دقیقه</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="پیش‌نمایش پیامک بازیابی" className="lg:col-span-2">
        <div className="mx-auto max-w-xs">
          <div className="rounded-2xl border border-border bg-success/8 p-4 shadow-card" dir="rtl">
            <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
              <FontAwesomeIcon icon={faCircleCheck} className="text-sm text-success" />
              <span className="text-[13px] font-bold">YGuard</span>
            </div>
            <div className="space-y-1.5 text-[12px] leading-relaxed">
              <p>مشکل صفحه اصلی برطرف شد.</p>
              <p><span className="text-muted-foreground">HTTP:</span> <span className="font-mono font-bold text-success" dir="ltr">200</span></p>
              <p><span className="text-muted-foreground">مدت اختلال:</span> <span className="font-bold">۶ دقیقه و ۲۳ ثانیه</span></p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── Anti-Spam Tab ───────────────────────────────────────────
function AntiSpamTab() {
  const [cooldown, setCooldown] = useState(20);
  const [maxPerHour, setMaxPerHour] = useState(10);
  const [opts, setOpts] = useState({ group: true, noRepeat: true, reminder: true, recovery: true });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="کنترل ارسال پیامک">
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[12px] font-semibold">Cooldown</label>
              <span className="font-mono text-[12px] font-bold text-primary" dir="ltr">{toFa(cooldown)} minutes</span>
            </div>
            <input type="range" min={5} max={60} step={5} value={cooldown} onChange={(e) => setCooldown(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[12px] font-semibold">حداکثر پیامک در ساعت</label>
              <span className="font-mono text-[12px] font-bold text-primary" dir="ltr">{toFa(maxPerHour)}</span>
            </div>
            <input type="range" min={1} max={30} step={1} value={maxPerHour} onChange={(e) => setMaxPerHour(+e.target.value)} className="w-full accent-primary" />
          </div>
        </div>
      </Panel>

      <Panel title="گزینه‌های کنترل">
        <div className="space-y-3">
          {[
            { key: "group", label: "گروه‌بندی هشدارهای تکراری", desc: "هشدارهای مشابه در یک پیامک ارسال شوند" },
            { key: "noRepeat", label: "عدم تکرار هشدارهای یکسان", desc: "هشدار یکسان در Cooldown دوباره ارسال نشود" },
            { key: "reminder", label: "ارسال یادآور در صورت ادامه مشکل", desc: "اگر مشکل ادامه داشت، یادآور ارسال شود" },
            { key: "recovery", label: "ارسال پیامک بازیابی", desc: "هنگام برطرف شدن مشکل، اطلاع‌رسانی شود" },
          ].map((o) => (
            <div key={o.key} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <div className="text-[13px] font-medium">{o.label}</div>
                <div className="text-[11px] text-muted-foreground">{o.desc}</div>
              </div>
              <Switch checked={opts[o.key]} onCheckedChange={(v) => setOpts((p) => ({ ...p, [o.key]: v }))} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ── Quiet Hours Tab ─────────────────────────────────────────
function QuietHoursTab() {
  const [enabled, setEnabled] = useState(true);
  const [days, setDays] = useState({ sat: true, sun: true, mon: true, tue: true, wed: true, thu: false, fri: false });

  const dayLabels = { sat: "شنبه", sun: "یک‌شنبه", mon: "دوشنبه", tue: "سه‌شنبه", wed: "چهارشنبه", thu: "پنج‌شنبه", fri: "جمعه" };

  const toggleDay = (d) => setDays((p) => ({ ...p, [d]: !p[d] }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <IconBadge icon={faMoon} tone="primary" />
          <div>
            <h3 className="text-[14px] font-bold">ساعات عدم مزاحمت</h3>
            <p className="text-[12px] text-muted-foreground">در این ساعات، هشدارهای غیربحرانی ارسال نمی‌شوند</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <Panel title="تنظیم ساعات">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">از ساعت</label>
            <input type="time" defaultValue="23:00" className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary" dir="ltr" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">تا ساعت</label>
            <input type="time" defaultValue="07:00" className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary" dir="ltr" />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-[12px] font-semibold">روزهای فعال</label>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(dayLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleDay(key)}
                className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", days[key] ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="استثنائات (همیشه ارسال می‌شوند)">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { icon: faCircleExclamation, label: "هشدارهای Critical", tone: "text-destructive" },
            { icon: faServer, label: "Down شدن سایت", tone: "text-destructive" },
            { icon: faShieldHalved, label: "حمله امنیتی بحرانی", tone: "text-warning" },
            { icon: faDatabase, label: "Database Failure", tone: "text-warning" },
          ].map((e) => (
            <div key={e.label} className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
              <FontAwesomeIcon icon={e.icon} className={cn("text-sm", e.tone)} />
              <span className="text-[13px] font-medium">{e.label}</span>
              <FontAwesomeIcon icon={faCircleCheck} className="mr-auto text-xs text-success" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ── Maintenance Window Tab ──────────────────────────────────
function MaintenanceTab() {
  const [enabled, setEnabled] = useState(true);
  const [opts, setOpts] = useState({ suppressUptime: true, suppressSMS: true, suppressEmail: false, recordEvents: true, showBadge: true });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <IconBadge icon={faWrench} tone="warning" />
          <div>
            <h3 className="text-[14px] font-bold">بازه تعمیر و نگهداری</h3>
            <p className="text-[12px] text-muted-foreground">در این بازه، هشدارهای انتخاب‌شده متوقف می‌شوند</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <Panel title="تنظیم بازه">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">روز</label>
            <select className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary">
              <option>جمعه</option><option>شنبه</option><option>یک‌شنبه</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">از ساعت</label>
            <input type="time" defaultValue="02:00" className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary" dir="ltr" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold">تا ساعت</label>
            <input type="time" defaultValue="04:00" className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary" dir="ltr" />
          </div>
        </div>
      </Panel>

      <Panel title="گزینه‌ها">
        <div className="space-y-3">
          {[
            { key: "suppressUptime", label: "متوقف کردن هشدارهای Uptime", desc: "در بازه تعمیر، هشدار قطعی ارسال نشود" },
            { key: "suppressSMS", label: "متوقف کردن SMS", desc: "پیامک‌های هشدار ارسال نشوند" },
            { key: "suppressEmail", label: "متوقف کردن ایمیل", desc: "ایمیل‌های هشدار ارسال نشوند" },
            { key: "recordEvents", label: "ثبت رویدادها", desc: "رویدادها ثبت شوند ولی اعلان ارسال نشود" },
            { key: "showBadge", label: "نمایش نشان تعمیر", desc: "نشان «در حال تعمیر» در داشبورد نمایش داده شود" },
          ].map((o) => (
            <div key={o.key} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <div className="text-[13px] font-medium">{o.label}</div>
                <div className="text-[11px] text-muted-foreground">{o.desc}</div>
              </div>
              <Switch checked={opts[o.key]} onCheckedChange={(v) => setOpts((p) => ({ ...p, [o.key]: v }))} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ── Notification History Tab ────────────────────────────────
function HistoryTab() {
  return (
    <Panel title="تاریخچه اعلان‌ها" action={<Pill tone="primary">{toFa(NOTIFICATION_HISTORY.length)} رکورد</Pill>}>
      <div className="-mx-5 -my-5 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-muted/60 text-[11px] text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-right font-semibold">زمان</th>
              <th className="px-4 py-2.5 text-right font-semibold">Alert</th>
              <th className="px-4 py-2.5 text-right font-semibold">Channel</th>
              <th className="px-4 py-2.5 text-right font-semibold">Recipient</th>
              <th className="px-4 py-2.5 text-right font-semibold">Status</th>
              <th className="px-4 py-2.5 text-right font-semibold">Provider Result</th>
              <th className="px-4 py-2.5 text-right font-semibold">Attempts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {NOTIFICATION_HISTORY.map((h) => {
              const st = NOTIF_STATUS_MAP[h.status];
              return (
                <tr key={h.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground" dir="ltr">{h.time}</td>
                  <td className="px-4 py-3 font-medium">{h.alert}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.channel}</td>
                  <td className="px-4 py-3 font-mono text-[12px]" dir="ltr">{h.recipient}</td>
                  <td className="px-4 py-3"><Pill tone={st.tone}>{st.label}</Pill></td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{h.providerResult}</td>
                  <td className="px-4 py-3 font-mono text-[12px]" dir="ltr">{toFa(h.attempts)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
