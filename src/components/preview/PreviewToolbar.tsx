import {
  Check,
  ExternalLink,
  Highlighter,
  History,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Rocket,
  Rows2,
  Smartphone,
  Tablet,
  Undo2,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button, IconButton } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/feedback'
import { Segmented } from '@/components/ui/segmented'
import { Tooltip } from '@/components/ui/tooltip'
import { cn, fa, formatClock } from '@/lib/utils'
import { useYAgent } from '@/state/YAgentProvider'
import { buildPreviewDocument } from '@/preview/buildPreviewDocument'
import type { PreviewDevice } from '@/types/model'

const DEVICES: Array<{ value: PreviewDevice; label: string; icon: ReactNode }> = [
  { value: 'desktop', label: 'دسکتاپ', icon: <Monitor className="h-3.5 w-3.5" /> },
  { value: 'tablet', label: 'تبلت', icon: <Tablet className="h-3.5 w-3.5" /> },
  { value: 'mobile', label: 'موبایل', icon: <Smartphone className="h-3.5 w-3.5" /> },
]

/**
 * Preview toolbar. Only what is used while looking at the page stays on the bar
 * (annotation, publish, display scale, close); the device size, the width, the
 * revision history and the comparison live behind the "بیشتر" menu.
 */
export function PreviewToolbar({
  onClose,
  onTogglePanel,
  panelOpen,
}: {
  onClose: () => void
  onTogglePanel?: () => void
  panelOpen?: boolean
}) {
  const { state, actions, derived } = useYAgent()
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const revision = derived.currentRevision
  const revisions = [...derived.revisions].sort((a, b) => b.revision - a.revision)
  const draftCount = derived.draftAnnotations.length
  const canPublish = Boolean(
    revision && revision.status === 'draft' && state.capabilities.publish && !derived.running,
  )

  function openInNewTab() {
    if (!revision) return
    const blob = new Blob([buildPreviewDocument(revision)], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  async function publish() {
    if (!revision || publishing) return
    setPublishing(true)
    await actions.publishRevision(revision.id)
    setPublishing(false)
    setPublishOpen(false)
  }

  return (
    <div className="border-b border-y-line bg-y-bg-elevated">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {onTogglePanel ? (
            <Tooltip label={panelOpen ? 'جمع‌کردن پنل مراحل' : 'نمایش پنل مراحل'}>
              <IconButton
                label={panelOpen ? 'جمع‌کردن پنل مراحل' : 'نمایش پنل مراحل'}
                size="md"
                onClick={onTogglePanel}
              >
                {panelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </IconButton>
            </Tooltip>
          ) : null}
          <span className="truncate text-y-base font-medium text-y-ink">
            {revision?.pageTitle ?? 'پیش‌نمایش صفحه'}
          </span>
          {revision ? (
            <Badge variant={revision.status === 'published' ? 'success' : 'accent'}>
              {revision.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
            </Badge>
          ) : null}
          {revision ? <Badge variant="plain">نسخهٔ {fa(revision.revision)}</Badge> : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Segmented
            size="sm"
            value={state.preview.zoom}
            onChange={(zoom) => actions.setZoom(zoom)}
            options={[
              { value: 'fit', label: 'جای‌گیری', title: 'نمایش متناسب با فضای کارگاه' },
              { value: 'full', label: '۱۰۰٪', title: 'نمایش در مقیاس واقعی' },
            ]}
          />

          <button
            type="button"
            onClick={() => actions.setAnnotate(!state.preview.annotate)}
            aria-pressed={state.preview.annotate}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-y-sm border px-2.5 text-y-sm transition-colors duration-y-fast ease-y',
              state.preview.annotate
                ? 'border-y-accent-border bg-y-accent-soft text-y-accent'
                : 'border-y-line bg-y-surface-soft text-y-ink-muted hover:text-y-ink',
            )}
          >
            <Highlighter className="h-3.5 w-3.5" />
            علامت‌گذاری
            {draftCount > 0 ? (
              <span className="yagent-num rounded-full bg-y-accent/20 px-1.5 text-y-xs">{fa(draftCount)}</span>
            ) : null}
          </button>

          <Tooltip label={canPublish ? 'انتشار آزمایشی نسخهٔ پیش‌نویس' : 'نسخهٔ فعلی منتشر شده است'}>
            <span className="inline-flex">
              <Button size="sm" variant="success" disabled={!canPublish} onClick={() => setPublishOpen(true)}>
                <Rocket className="h-3.5 w-3.5" />
                انتشار
              </Button>
            </span>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-8 gap-1.5">
                <History className="h-3.5 w-3.5" />
                بیشتر
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[15rem]">
              <DropdownMenuLabel>اندازهٔ نمایش و دستگاه</DropdownMenuLabel>
              {DEVICES.map((device) => (
                <DropdownMenuItem
                  key={device.value}
                  icon={device.icon}
                  selected={device.value === state.preview.device}
                  onSelect={() => actions.setDevice(device.value)}
                >
                  {device.label}
                </DropdownMenuItem>
              ))}

              {/* A live control inside the menu: keep its own pointer/keyboard
                  events away from the menu's type-ahead navigation. */}
              <div
                className="flex items-center gap-2 px-2.5 py-2"
                onPointerDown={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <span className="text-y-xs text-y-ink-dim">عرض دستگاه</span>
                <input
                  type="range"
                  min={360}
                  max={1600}
                  step={20}
                  value={state.preview.width}
                  aria-label="عرض دستگاه در پیش‌نمایش"
                  onChange={(event) => actions.setPreviewWidth(Number(event.target.value))}
                  className="h-1 min-w-0 flex-1 cursor-pointer"
                  style={{ accentColor: 'rgb(var(--y-accent-rgb))' }}
                />
                <span className="yagent-num w-[4.25rem] text-end text-y-xs text-y-ink-dim">
                  {fa(state.preview.width)} px
                </span>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<RefreshCw className="h-3.5 w-3.5" />} onSelect={() => actions.reloadPreview()}>
                بازخوانی پیش‌نمایش
              </DropdownMenuItem>
              <DropdownMenuItem icon={<ExternalLink className="h-3.5 w-3.5" />} onSelect={openInNewTab}>
                بازکردن در پنجرهٔ جدید
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>نسخه‌ها</DropdownMenuLabel>
              {revisions.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  selected={item.id === revision?.id}
                  onSelect={() => actions.selectRevision(item.id)}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-y-base text-y-ink">
                      نسخهٔ {fa(item.revision)}
                      <Badge variant={item.status === 'published' ? 'success' : 'accent'}>
                        {item.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
                      </Badge>
                    </span>
                    <span className="mt-0.5 block truncate text-y-xs text-y-ink-dim">{item.summary}</span>
                  </span>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>مقایسه با</DropdownMenuLabel>
              <DropdownMenuItem
                selected={!state.preview.compareRevisionId}
                onSelect={() => actions.setCompareRevision(undefined)}
              >
                بدون مقایسه
              </DropdownMenuItem>
              {revisions
                .filter((item) => item.id !== revision?.id)
                .map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    icon={<Rows2 className="h-3.5 w-3.5" />}
                    selected={item.id === state.preview.compareRevisionId}
                    onSelect={() => actions.setCompareRevision(item.id)}
                  >
                    <span className="flex items-center gap-2">
                      نسخهٔ {fa(item.revision)}
                      <span className="text-y-xs text-y-ink-dim">{formatClock(item.createdAt)}</span>
                    </span>
                  </DropdownMenuItem>
                ))}

              {state.preview.height > 0 ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>ارتفاع صفحه: {fa(state.preview.height)} px</DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip label="بستن کارگاه پیش‌نمایش">
            <IconButton label="بستن پیش‌نمایش" size="md" onClick={onClose}>
              <X className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {state.preview.annotate ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-y-line bg-y-accent-soft/40 px-3 py-2">
          <Highlighter className="h-3.5 w-3.5 shrink-0 text-y-accent" />
          <span className="text-y-xs leading-6 text-y-ink-muted">
            روی یک بخش بزن تا پین بگذاری، یا ناحیه‌ای بکش. توضیح را در پنل کنار بنویس.
          </span>
          <div className="ms-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={draftCount === 0}
              onClick={() => actions.undoAnnotation()}
              title="واگرد آخرین علامت"
            >
              <Undo2 className="h-3.5 w-3.5" />
              واگرد
            </Button>
            <Button
              size="sm"
              variant={draftCount > 0 ? 'primary' : 'secondary'}
              disabled={draftCount === 0}
              onClick={() => void actions.sendFeedback()}
            >
              <Check className="h-3.5 w-3.5" />
              فرستادن {draftCount > 0 ? `${fa(draftCount)} اصلاح` : 'اصلاحات'}
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        {publishOpen ? (
          <DialogContent
            title={`انتشار آزمایشی نسخهٔ ${fa(revision?.revision ?? 1)}`}
            description="این نسخه نمایشی است: انتشار روی سایت واقعی انجام نمی‌شود و فقط رفتار رابط را نشان می‌دهد."
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setPublishOpen(false)} disabled={publishing}>
                  انصراف
                </Button>
                <Button variant="success" size="sm" onClick={() => void publish()} disabled={publishing}>
                  {publishing ? <Spinner size={14} /> : <Check className="h-3.5 w-3.5" />}
                  انتشار آزمایشی
                </Button>
              </>
            }
          >
            <ul className="space-y-1.5">
              <li className="text-y-sm text-y-ink-muted">
                <span className="text-y-ink-dim">صفحه: </span>
                {revision?.pageTitle}
              </li>
              <li className="text-y-sm leading-7 text-y-ink-muted">
                <span className="text-y-ink-dim">خلاصهٔ تغییر: </span>
                {revision?.summary}
              </li>
              <li className="text-y-sm text-y-ink-muted">
                <span className="text-y-ink-dim">نظرهای ثبت‌شده روی این نسخه: </span>
                <span className="yagent-num">{fa(derived.draftAnnotations.length)}</span>
              </li>
              <li className="flex items-start gap-1.5 pt-1 text-y-xs leading-6 text-y-ink-dim">
                در نسخهٔ نمایشی، لینک صفحهٔ منتشرشده وجود ندارد.
              </li>
            </ul>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  )
}
