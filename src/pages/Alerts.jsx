import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell, faCircleExclamation, faTriangleExclamation, faCircleInfo, faCircleCheck,
  faFilter, faRotate, faEye, faCheck, faCheckDouble, faEyeSlash, faClock,
  faMagnifyingGlass, faChevronLeft, faChevronRight, faEllipsisVertical, faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, StatCard, toFa } from "@/components/yguard/ui";
import { AlertDrawer } from "@/components/yguard/alerts/AlertDrawer";
import { SnoozeDialog } from "@/components/yguard/alerts/SnoozeDialog";
import {
  ALERT_KPIS, ALERT_TABS, ALERT_CATEGORIES, ALERTS, SEVERITIES, severityMap,
} from "@/lib/alertsData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap = { faBell, faCircleExclamation, faTriangleExclamation, faCircleInfo, faCircleCheck };

const statusLabel = { open: "باز", acknowledged: "تأییدشده", resolved: "حل‌شده", ignored: "نادیده‌گرفته‌شده", snoozed: "Snoozed" };
const statusTone = { open: "warning", acknowledged: "info", resolved: "success", ignored: "primary", snoozed: "primary" };

const PAGE_SIZE = 8;

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("open");
  const [search, setSearch] = useState("");
  const [fSeverity, setFSeverity] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [alerts, setAlerts] = useState(ALERTS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const [snoozeTarget, setSnoozeTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [actionMenu, setActionMenu] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    let r = [...alerts];
    if (tab !== "all") r = r.filter((a) => a.status === tab);
    if (fSeverity) r = r.filter((a) => a.severity === fSeverity);
    if (fCategory) r = r.filter((a) => a.category === fCategory);
    if (search) r = r.filter((a) => a.title.includes(search) || a.id.includes(search) || a.source.includes(search));
    return r;
  }, [alerts, tab, fSeverity, fCategory, search]);

  useEffect(() => { setPage(1); }, [tab, fSeverity, fCategory, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAlert = (a) => { setSelectedAlert(a); setDrawerOpen(true); };

  const doAction = (alert, action) => {
    setActionMenu(null);
    if (action === "view") { openAlert(alert); return; }
    if (action === "snooze") { setSnoozeTarget(alert); setSnoozeOpen(true); return; }
    const newStatus = { acknowledge: "acknowledged", resolve: "resolved", ignore: "ignored" }[action];
    if (newStatus) {
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: newStatus } : a)));
      const msgs = { acknowledged: "هشدار تأیید شد", resolved: "هشدار حل شد", ignored: "هشدار نادیده گرفته شد" };
      toast.success(msgs[action]);
    }
  };

  const handleSnooze = (opt) => {
    if (snoozeTarget) {
      setAlerts((prev) => prev.map((a) => (a.id === snoozeTarget.id ? { ...a, status: "snoozed" } : a)));
      toast.success(`هشدار تا ${opt.label} Snooze شد`);
    }
  };

  const actions = [
    { id: "view", label: "بررسی / مشاهده Timeline", icon: faEye },
    { id: "acknowledge", label: "تأیید مشاهده", icon: faCheck },
    { id: "resolve", label: "حل شد", icon: faCheckDouble },
    { id: "ignore", label: "نادیده گرفتن", icon: faEyeSlash },
    { id: "snooze", label: "Snooze", icon: faClock },
  ];

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faBell} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">مرکز هشدارها</h1>
            <p className="text-[13px] text-muted-foreground">مدیریت هشدارهای امنیتی، سلامت، عملکرد و زیرساخت سایت</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success("هشدارها بروزرسانی شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
            <FontAwesomeIcon icon={faRotate} className="text-xs" /> بروزرسانی
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[100px] animate-pulse rounded-xl bg-muted" />)
          : ALERT_KPIS.map((k) => <StatCard key={k.id} icon={iconMap[k.icon] || faBell} tone={k.tone} label={k.label} value={toFa(k.value)} />)}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-2 shadow-card">
        {ALERT_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              tab === t.id ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
            <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold", tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{toFa(t.count)}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <FontAwesomeIcon icon={faFilter} className="text-xs" /> فیلتر:
        </div>
        <select value={fSeverity} onChange={(e) => setFSeverity(e.target.value)} className="h-8 rounded-lg border border-border bg-background px-2.5 text-[12px] font-medium outline-none focus:border-primary">
          <option value="">Severity</option>
          {SEVERITIES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="h-8 rounded-lg border border-border bg-background px-2.5 text-[12px] font-medium outline-none focus:border-primary">
          <option value="">Category</option>
          {ALERT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="h-8 rounded-lg border border-border bg-background px-2.5 text-[12px] font-medium outline-none focus:border-primary" defaultValue="">
          <option value="">Status</option>
          <option value="open">باز</option>
          <option value="acknowledged">تأییدشده</option>
          <option value="resolved">حل‌شده</option>
        </select>
        <select className="h-8 rounded-lg border border-border bg-background px-2.5 text-[12px] font-medium outline-none focus:border-primary" defaultValue="">
          <option value="">Component</option>
          <option>Homepage</option>
          <option>WAF</option>
          <option>MySQL</option>
          <option>SSL Certificate</option>
        </select>
        <select className="h-8 rounded-lg border border-border bg-background px-2.5 text-[12px] font-medium outline-none focus:border-primary" defaultValue="">
          <option value="">Notification Channel</option>
          <option>SMS</option>
          <option>Email</option>
          <option>Dashboard</option>
        </select>
        <select className="h-8 rounded-lg border border-border bg-background px-2.5 text-[12px] font-medium outline-none focus:border-primary" defaultValue="">
          <option value="">Date</option>
          <option>امروز</option>
          <option>۷ روز اخیر</option>
          <option>۳۰ روز اخیر</option>
        </select>
        <div className="relative flex-1 min-w-[160px]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی هشدار..."
            className="h-8 w-full rounded-lg border border-border bg-background pr-9 pl-3 text-[12px] outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Alert Table */}
      <Panel>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-3xl text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">هیچ هشداری یافت نشد</p>
            <p className="text-[12px] text-muted-foreground">فیلترها را تغییر دهید یا همه هشدارها را ببینید</p>
          </div>
        ) : (
          <div className="-mx-5 -my-5 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-muted/60 text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-right font-semibold">Severity</th>
                  <th className="px-4 py-2.5 text-right font-semibold">عنوان</th>
                  <th className="px-4 py-2.5 text-right font-semibold">بخش</th>
                  <th className="px-4 py-2.5 text-right font-semibold">منبع</th>
                  <th className="px-4 py-2.5 text-right font-semibold">اولین شناسایی</th>
                  <th className="px-4 py-2.5 text-right font-semibold">آخرین رخداد</th>
                  <th className="px-4 py-2.5 text-right font-semibold">تعداد رخداد</th>
                  <th className="px-4 py-2.5 text-right font-semibold">اعلان</th>
                  <th className="px-4 py-2.5 text-right font-semibold">وضعیت</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageData.map((a) => {
                  const sev = severityMap[a.severity];
                  return (
                    <tr key={a.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openAlert(a)}>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold", `bg-${sev.tone === "danger" ? "destructive" : sev.tone === "warning" ? "warning" : sev.tone === "info" ? "info" : sev.tone === "success" ? "success" : "primary"}/12 text-${sev.tone === "danger" ? "destructive" : sev.tone === "warning" ? "warning" : sev.tone === "info" ? "info" : sev.tone === "success" ? "success" : "primary"}`)}>
                          <FontAwesomeIcon icon={sev.id === "critical" ? faCircleExclamation : sev.id === "high" ? faTriangleExclamation : sev.id === "medium" ? faCircleInfo : sev.id === "low" ? faCircleCheck : faBell} className="text-[9px]" />
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{a.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.source}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground" dir="ltr">{a.firstDetected}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground" dir="ltr">{a.lastDetected}</td>
                      <td className="px-4 py-3 font-mono text-[12px]" dir="ltr">{toFa(a.occurrences)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {a.notified.map((n) => <span key={n} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{n}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-3"><Pill tone={statusTone[a.status]}>{statusLabel[a.status]}</Pill></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <button onClick={() => setActionMenu(actionMenu === a.id ? null : a.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
                            <FontAwesomeIcon icon={faEllipsisVertical} className="text-xs" />
                          </button>
                          {actionMenu === a.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                              <div className="absolute left-0 top-8 z-20 w-52 rounded-lg border border-border bg-popover p-1.5 shadow-lg" dir="rtl">
                                {actions.map((act) => (
                                  <button
                                    key={act.id}
                                    onClick={() => doAction(a, act.id)}
                                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12px] font-medium hover:bg-muted"
                                  >
                                    <FontAwesomeIcon icon={act.icon} className="text-xs text-muted-foreground" />
                                    {act.label}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">
            نمایش {toFa((page - 1) * PAGE_SIZE + 1)}-{toFa(Math.min(page * PAGE_SIZE, filtered.length))} از {toFa(filtered.length)} هشدار
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn("h-8 min-w-8 rounded-lg border px-2 text-[12px] font-medium", page === i + 1 ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted")}
              >
                {toFa(i + 1)}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer & Dialog */}
      <AlertDrawer open={drawerOpen} onOpenChange={setDrawerOpen} alert={selectedAlert} />
      <SnoozeDialog open={snoozeOpen} onOpenChange={setSnoozeOpen} onSnooze={handleSnooze} />
    </div>
  );
}
