import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SNOOZE_OPTIONS } from "@/lib/alertsData";
import { cn } from "@/lib/utils";

export function SnoozeDialog({ open, onOpenChange, onSnooze }) {
  const [selected, setSelected] = useState(null);

  const handleSnooze = () => {
    if (selected) {
      onSnooze(selected);
      setSelected(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-base font-extrabold">
            <FontAwesomeIcon icon={faClock} className="text-sm text-primary" />
            Snooze هشدار
          </DialogTitle>
          <DialogDescription className="text-right">مدت زمان Snooze را انتخاب کنید</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2.5 py-2">
          {SNOOZE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors",
                selected === opt.id
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <FontAwesomeIcon
                icon={opt.id === "tomorrow" || opt.id === "nextweek" ? faCalendarDay : faClock}
                className="text-xs"
              />
              {opt.label}
            </button>
          ))}
        </div>
        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          <Button onClick={handleSnooze} disabled={!selected}>تأیید Snooze</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
