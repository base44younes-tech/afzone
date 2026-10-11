import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock, faNetworkWired, faLayerGroup, faEnvelope, faMap, faShieldHalved,
  faCircleCheck, faTriangleExclamation, faCircleXmark, faPaperPlane, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { IconBadge, Panel, Pill, toFa } from "@/components/yguard/ui";
import {
  SSL, DOMAIN, DNS_RECORDS, DNS_CHANGE, DNS_HISTORY, CACHE, EMAIL, SEO, SECURITY_HEADERS, SECURITY_GRADE,
} from "@/lib/infraData";
import { findGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TABS = [
  { id: "ssl", label: "SSL و دامنه", icon: faLock },
  { id: "dns", label: "DNS", icon: faNetworkWired },
  { id: "cache", label: "Cache", icon: faLayerGroup },
  { id: "email", label: "ایمیل", icon: faEnvelope },
  { id: "seo", label: "SEO & Crawling", icon: faMap },
  { id: "headers", label: "Security Headers", icon: faShieldHalved },
];

const sevIcon = { success: faCircleCheck, warning: faTriangleExclamation, danger: faCircleXmark };

function InfoField({ label, value, ltr, tone }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-[13px] font-medium", ltr && "font-mono", tone)} dir={ltr ? "ltr" : "rtl"} style={ltr ? { textAlign: "right" } : undefined}>{value}</div>
    </div>
  );
}

function SslTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="SSL">
          <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-[13px] text-success">
            <FontAwesomeIcon icon={faCircleCheck} /> {SSL.statusLabel}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <InfoField label="Certificate Issuer" value={SSL.issuer} />
            <InfoField label="Hostname" value={SSL.hostname} ltr />
            <InfoField label="Protocol" value={SSL.protocol} ltr />
            <InfoField label="Valid From" value={SSL.validFrom} ltr />
            <InfoField label="Expires" value={SSL.expires} ltr />
            <InfoField label="Days Remaining" value={`${toFa(SSL.daysRemaining)} روز`} tone={SSL.daysRemaining < 14 ? "text-warning" : "text-success"} />
          </div>
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-semibold text-muted-foreground">آستانه‌های هشدار</div>
            <div className="flex gap-2">
              {SSL.thresholds.map((t) => (
                <div key={t.label} className={cn("flex-1 rounded-lg border p-2.5 text-center", t.tone === "success" && "border-success/30 bg-success/10", t.tone === "warning" && "border-warning/30 bg-warning/10", t.tone === "danger" && "border-destructive/30 bg-destructive/10")}>
                  <div className={cn("text-sm font-extrabold", t.tone === "success" && "text-success", t.tone === "warning" && "text-warning", t.tone === "danger" && "text-destructive")}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="دامنه">
          <div className={cn("flex items-center gap-2 rounded-lg border p-3 text-[13px]", DOMAIN.tone === "warning" ? "border-warning/40 bg-warning/10 text-warning" : "border-success/40 bg-success/10 text-success")}>
            <FontAwesomeIcon icon={faTriangleExclamation} /> {DOMAIN.warning}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <InfoField label="Domain" value={DOMAIN.name} ltr />
            <InfoField label="Registrar" value={DOMAIN.registrar} />
            <InfoField label="Created" value={DOMAIN.created} ltr />
            <InfoField label="Expires" value={DOMAIN.expires} ltr />
            <InfoField label="Days Remaining" value={`${toFa(DOMAIN.daysRemaining)} روز`} tone="text-warning" />
            <InfoField label="Auto Renewal" value={DOMAIN.autoRenewal ? "فعال" : "غیرفعال"} tone={DOMAIN.autoRenewal ? "text-success" : "text-destructive"} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function DnsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-[13px] text-warning">
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <span>تغییر DNS شناسایی شد · رکورد <span className="font-mono">{DNS_CHANGE.record}</span> · {DNS_CHANGE.detected}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <div className="text-[11px] text-muted-foreground">Previous</div>
          <div className="mt-1 font-mono text-[13px]" dir="ltr" style={{ textAlign: "right" }}>{DNS_CHANGE.previous}</div>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <div className="text-[11px] text-muted-foreground">New</div>
          <div className="mt-1 font-mono text-[13px] text-warning" dir="ltr" style={{ textAlign: "right" }}>{DNS_CHANGE.current}</div>
        </div>
      </div>
      <Panel title="رکوردهای DNS">
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-right font-semibold">Record</th>
                <th className="px-4 py-2.5 text-right font-semibold">Value</th>
                <th className="px-4 py-2.5 text-right font-semibold">TTL</th>
                <th className="px-4 py-2.5 text-right font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DNS_RECORDS.map((r, i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="px-4 py-3"><Pill tone="primary">{r.type}</Pill> <span className="font-mono text-[12px]" dir="ltr">{r.name}</span></td>
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{r.value}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{toFa(r.ttl)}</td>
                  <td className="px-4 py-3"><Pill tone={r.tone}>{r.statusLabel}</Pill></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="تاریخچه DNS">
        <div className="space-y-1.5">
          {DNS_HISTORY.map((h, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", h.status === "changed" ? "bg-warning" : "bg-success")} />
                <span className="text-muted-foreground">{h.time}</span>
              </div>
              <span className={h.status === "changed" ? "font-semibold text-warning" : "text-muted-foreground"}>{h.event}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CacheTab() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {CACHE.map((c) => (
        <div key={c.name} className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <FontAwesomeIcon icon={faLayerGroup} className={cn("text-sm", c.tone === "success" && "text-success", c.tone === "warning" && "text-warning", c.tone === "info" && "text-info")} />
              <span className="text-[13px] font-bold">{c.name}</span>
            </div>
            <Pill tone={c.tone}>{c.label}</Pill>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">{c.detail}</div>
        </div>
      ))}
    </div>
  );
}

function EmailTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {EMAIL.cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-[12px] text-muted-foreground">{c.label}</div>
            <div className={cn("mt-2 text-xl font-extrabold", c.tone === "danger" && "text-destructive", c.tone === "warning" && "text-warning", c.tone === "success" && "text-success", c.tone === "primary" && "text-primary")} dir="ltr">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoField label="wp_mail" value={EMAIL.wpMail} tone="text-success" />
        <InfoField label="SMTP" value={EMAIL.smtp} tone="text-success" />
        <InfoField label="Provider" value={EMAIL.provider} ltr />
      </div>
      <Panel title="رویدادهای اخیر ایمیل" action={
        <button onClick={() => toast.success("ایمیل آزمایشی ارسال شد")} className="flex h-8 items-center gap-1.5 rounded-md bg-brand px-2.5 text-[11px] font-semibold text-primary-foreground">
          <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" /> ارسال ایمیل آزمایشی
        </button>
      }>
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-right font-semibold">Time</th>
                <th className="px-4 py-2.5 text-right font-semibold">Recipient</th>
                <th className="px-4 py-2.5 text-right font-semibold">Type</th>
                <th className="px-4 py-2.5 text-right font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {EMAIL.events.map((e, i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-muted-foreground" dir="ltr">{e.time}</td>
                  <td className="px-4 py-3 font-mono text-[12px]" dir="ltr" style={{ textAlign: "right" }}>{e.recipient}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.type}</td>
                  <td className="px-4 py-3"><Pill tone={e.status === "success" ? "success" : "danger"}>{e.status === "success" ? "موفق" : "ناموفق"}</Pill></td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{e.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function SeoTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SEO.checks.map((c) => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <span className="text-[13px] font-bold">{c.name}</span>
              <Pill tone={c.tone}>{c.label}</Pill>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">{c.detail}</div>
          </div>
        ))}
      </div>
      <Panel title="خلاصه Sitemap">
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { l: "Total URLs", v: SEO.sitemap.total, tone: "primary" },
            { l: "Valid", v: SEO.sitemap.valid, tone: "success" },
            { l: "Redirect", v: SEO.sitemap.redirect, tone: "info" },
            { l: "404", v: SEO.sitemap.notFound, tone: "warning" },
            { l: "5xx", v: SEO.sitemap.serverError, tone: "danger" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <div className={cn("text-xl font-extrabold", s.tone === "success" && "text-success", s.tone === "warning" && "text-warning", s.tone === "danger" && "text-destructive", s.tone === "info" && "text-info", s.tone === "primary" && "text-primary")} dir="ltr">{s.v}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function HeadersTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-2xl font-extrabold text-primary">{SECURITY_GRADE}</div>
          <div>
            <div className="text-[13px] font-bold">امتیاز کلی Security Headers</div>
            <div className="text-[12px] text-muted-foreground">بر اساس بررسی هدرهای امنیتی HTTP</div>
          </div>
        </div>
        <Pill tone="warning">نیازمند بهبود</Pill>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SECURITY_HEADERS.map((h) => (
          <div key={h.name} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <span className="text-[13px] font-bold" dir="ltr" style={{ textAlign: "right" }}>{h.name}</span>
              <Pill tone={h.tone}>{h.label}</Pill>
            </div>
            <div className="mt-2 font-mono text-[11px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{h.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-info/40 bg-info/10 p-3 text-[12px] text-info">
        این تنها یک خلاصه است. پیاده‌سازی کامل امنیت در مرحله بعدی انجام می‌شود.
      </div>
    </div>
  );
}

export default function Infrastructure() {
  const group = findGroup("infrastructure");
  const [tab, setTab] = useState("ssl");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={faNetworkWired} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">زیرساخت</h1>
            <p className="text-[13px] text-muted-foreground">SSL، دامنه، DNS، Cache، ایمیل، SEO و Security Headers</p>
          </div>
        </div>
        <button onClick={() => toast.success("زیرساخت بررسی شد")} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted">
          <FontAwesomeIcon icon={faRotate} className="text-xs" /> بررسی مجدد
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-2 shadow-card" dir="rtl">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[12px] font-medium transition-colors", tab === t.id ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted")}>
            <FontAwesomeIcon icon={t.icon} className="text-[11px]" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "ssl" && <SslTab />}
      {tab === "dns" && <DnsTab />}
      {tab === "cache" && <CacheTab />}
      {tab === "email" && <EmailTab />}
      {tab === "seo" && <SeoTab />}
      {tab === "headers" && <HeadersTab />}
    </div>
  );
}