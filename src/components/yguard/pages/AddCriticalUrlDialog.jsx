import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLink } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "Page", label: "Page" },
  { id: "Product", label: "Product" },
  { id: "API", label: "API" },
  { id: "System", label: "System" },
  { id: "Custom", label: "Custom" },
];

export function AddCriticalUrlDialog({ open, onOpenChange, onAdd }) {
  const [form, setForm] = useState({ name: "", url: "", type: "Page", expected: "200", interval: "60", timeout: "10", threshold: "3", sms: false, dashboard: true });

  const save = () => {
    if (!form.name || !form.url) { toast.error("نام و URL الزامی است"); return; }
    onAdd?.(form);
    toast.success("صفحه حیاتی اضافه شد");
    onOpenChange(false);
    setForm({ name: "", url: "", type: "Page", expected: "200", interval: "60", timeout: "10", threshold: "3", sms: false, dashboard: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-base font-extrabold">
            <FontAwesomeIcon icon={faPlus} className="text-primary" /> افزودن صفحه حیاتی
          </DialogTitle>
          <DialogDescription className="text-right text-[12px]">صفحه‌ای با مانیتورینگ حساس‌تر اضافه کنید.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold">نام</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً صفحه اصلی" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary/40" />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold">URL</label>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="/" dir="ltr" style={{ textAlign: "right" }} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold">نوع</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-9 w-full rounded-lg border border-border bg-background px-2 text-[13px] outline-none focus:border-primary/40">
                {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold">Expected Status</label>
              <input value={form.expected} onChange={(e) => setForm({ ...form, expected: e.target.value })} dir="ltr" style={{ textAlign: "right" }} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/40" />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold">Interval (sec)</label>
              <input value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} dir="ltr" style={{ textAlign: "right" }} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/40" />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold">Timeout (sec)</label>
              <input value={form.timeout} onChange={(e) => setForm({ ...form, timeout: e.target.value })} dir="ltr" style={{ textAlign: "right" }} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/40" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold">Consecutive Failure Threshold</label>
            <input value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} dir="ltr" style={{ textAlign: "right" }} className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/40" />
          </div>
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={form.sms} onChange={(e) => setForm({ ...form, sms: e.target.checked })} className="h-4 w-4 accent-primary" /> SMS Alert
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={form.dashboard} onChange={(e) => setForm({ ...form, dashboard: e.target.checked })} className="h-4 w-4 accent-primary" /> Dashboard Alert
            </label>
          </div>
          <button onClick={save} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-[13px] font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            <FontAwesomeIcon icon={faLink} className="text-xs" /> ذخیره
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}