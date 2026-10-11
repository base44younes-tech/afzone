import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faFilter, faCircleCheck, faTriangleExclamation, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { findGroup, findItem } from "@/lib/nav";
import { IconBadge, Panel, Pill, StatCard, toFa } from "@/components/yguard/ui";
import { toast } from "sonner";

const rows = [
  { name: "wp-login.php", detail: "185.220.101.4 · آلمان", tone: "danger", status: "بحرانی", time: "۱۴:۲۲" },
  { name: "/wp-json/wp/v2/users", detail: "45.83.12.9 · هلند", tone: "warning", status: "هشدار", time: "۱۴:۰۵" },
  { name: "/checkout", detail: "پاسخ ۳۱۲ms", tone: "success", status: "سالم", time: "۱۳:۵۸" },
  { name: "xmlrpc.php", detail: "91.92.240.1 · روسیه", tone: "danger", status: "مسدود", time: "۱۳:۴۰" },
  { name: "wp-cron.php", detail: "اجرا در ۲.۱ ثانیه", tone: "warning", status: "کند", time: "۱۳:۳۰" },
  { name: "/shop", detail: "پاسخ ۴۰۲ms", tone: "success", status: "سالم", time: "۱۳:۱۲" },
];

export default function SectionPlaceholder() {
  const { section } = useParams();
  const item = findItem(section);
  const group = findGroup(section);
  const navigate = useNavigate();

  if (!item || !item.slug) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="text-5xl font-extrabold text-muted-foreground">۴۰۴</div>
        <p className="text-sm text-muted-foreground">صفحه پیدا نشد.</p>
        <button onClick={() => navigate("/")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">بازگشت به داشبورد</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={item.icon} className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">{item.title}</h1>
            <p className="text-[13px] text-muted-foreground">{group ? `${group.title} · ` : ""}{item.desc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium hover:bg-muted" onClick={() => toast("فیلترها باز شد")}>
            <FontAwesomeIcon icon={faFilter} className="text-xs" /> فیلتر
          </button>
          <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-90" onClick={() => toast.success("بروزرسانی شد")}>
            <FontAwesomeIcon icon={faRotate} className="text-xs" /> بروزرسانی
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={faCircleCheck} tone="success" label="موارد سالم" value={toFa(42)} />
        <StatCard icon={faTriangleExclamation} tone="warning" label="نیازمند توجه" value={toFa(5)} />
        <StatCard icon={faCircleXmark} tone="danger" label="بحرانی" value={toFa(2)} />
      </div>

      <Panel title="رکوردهای اخیر" action={<Pill>داده نمونه</Pill>}>
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/60 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-right font-semibold">مورد</th>
                <th className="px-5 py-2.5 text-right font-semibold">جزئیات</th>
                <th className="px-5 py-2.5 text-right font-semibold">وضعیت</th>
                <th className="px-5 py-2.5 text-right font-semibold">زمان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.name} className="hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-[12px]" dir="ltr" style={{ textAlign: "right" }}>{r.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.detail}</td>
                  <td className="px-5 py-3"><Pill tone={r.tone}>{r.status}</Pill></td>
                  <td className="px-5 py-3 text-muted-foreground">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}