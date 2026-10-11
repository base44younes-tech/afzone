import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faStethoscope, faMicroscope, faPlay, faGear, faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Panel, Pill, toFa } from "@/components/yguard/ui";
import { PRESETS, CHECKLIST } from "@/lib/checkupData";
import { cn } from "@/lib/utils";

const presetIcons = { faBolt, faStethoscope, faMicroscope };

export function CheckupIdle({ preset, setPreset, selected, setSelected, onStart, onSettings }) {
  const toggle = (label) => {
    setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));
  };

  const applyPreset = (p) => {
    setPreset(p.id);
    if (p.checks) setSelected(p.checks);
    else setSelected([...CHECKLIST]);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {PRESETS.map((p) => {
          const active = preset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={cn(
                "rounded-xl border bg-card p-4 text-right shadow-card transition-all",
                active ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <FontAwesomeIcon icon={presetIcons[p.icon]} />
                </div>
                {active && <Pill tone="primary">انتخاب‌شده</Pill>}
              </div>
              <div className="mt-3 text-sm font-bold">{p.title}</div>
              <div className="mt-1 text-[12px] text-muted-foreground">{p.desc}</div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{p.checks ? `${toFa(p.checks.length)} بخش` : `${toFa(CHECKLIST.length)} بخش`}</span>
                <span dir="ltr">{p.est}</span>
              </div>
            </button>
          );
        })}
      </div>

      <Panel
        title="بخش‌های قابل بررسی"
        action={
          <div className="flex gap-2">
            <button onClick={() => setSelected([...CHECKLIST])} className="text-[11px] text-primary hover:underline">انتخاب همه</button>
            <span className="text-muted-foreground">·</span>
            <button onClick={() => setSelected([])} className="text-[11px] text-muted-foreground hover:underline">هیچ‌کدام</button>
          </div>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKLIST.map((label) => {
            const active = selected.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggle(label)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] transition-colors",
                  active ? "border-primary/40 bg-primary-soft text-foreground" : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <span className={cn("flex h-4 w-4 items-center justify-center rounded border", active ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                  {active && <FontAwesomeIcon icon={faCheck} className="text-[9px]" />}
                </span>
                <span className="flex-1 text-right">{label}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="text-[13px] text-muted-foreground">
          <span className="font-semibold text-foreground">{toFa(selected.length)}</span> بخش انتخاب شده است
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSettings}
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-[13px] font-medium hover:bg-muted"
          >
            <FontAwesomeIcon icon={faGear} className="text-xs" /> تنظیمات چکاپ
          </button>
          <button
            onClick={onStart}
            disabled={selected.length === 0}
            className="flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-[13px] font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPlay} className="text-xs" /> شروع چکاپ کامل
          </button>
        </div>
      </div>
    </div>
  );
}