import { AlertTriangle, Check, ExternalLink, Eye } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useYAgent } from '@/state/YAgentProvider'

/**
 * Compact outcome card for any finished operation: success or failure, a short
 * explanation, the related link and — collapsed — the technical receipt.
 * Links that the demo cannot honour (`#`) are shown disabled with a note instead
 * of pretending to lead somewhere.
 */
export function ResultCard({ resultId }: { resultId: string }) {
  const { state, actions, derived } = useYAgent()
  const [showTechnical, setShowTechnical] = useState(false)
  const result = state.results[resultId]

  if (!result) return null

  const success = result.status === 'success'
  const previewRevisionId = result.previewRevisionId
  // A restored conversation knows its page even before the revisions are loaded.
  const previewPageId = previewRevisionId
    ? state.revisions[previewRevisionId]?.pageId ?? derived.activeConversation?.previewPageId
    : undefined
  const hasLink = Boolean(result.link)
  const demoLink = hasLink && (result.link === '#' || result.link?.startsWith('#'))

  return (
    <div
      className={cn(
        'my-3 rounded-y-lg border p-3.5',
        success ? 'border-y-success/20 bg-y-success-soft/25' : 'border-y-danger/25 bg-y-danger-soft/25',
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
            success ? 'bg-y-success/15 text-y-success' : 'bg-y-danger/15 text-y-danger',
          )}
        >
          {success ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <AlertTriangle className="h-3.5 w-3.5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn('break-words text-y-base font-medium', success ? 'text-y-ink' : 'text-y-danger')}>
            {result.title}
          </p>
          <p className="mt-1 break-words text-y-sm leading-7 text-y-ink-muted">{result.message}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {previewRevisionId && previewPageId ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void actions.openPreview(previewPageId, previewRevisionId)}
          >
            <Eye className="h-3.5 w-3.5" />
            مشاهدهٔ پیش‌نمایش
          </Button>
        ) : null}

        {demoLink ? (
          <span className="inline-flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled
              title="در نسخهٔ نمایشی، سایت واقعی وصل نیست"
              className="border border-dashed border-y-line text-y-ink-dim"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {result.linkLabel ?? 'مشاهده در سایت'}
            </Button>
            <span className="text-y-xs text-y-ink-dim">لینک نمایشی</span>
          </span>
        ) : result.link ? (
          <Button size="sm" variant="ghost" asChild>
            <a href={result.link} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              {result.linkLabel ?? 'مشاهده در سایت'}
            </a>
          </Button>
        ) : null}

        {result.technical?.length ? (
          <button
            type="button"
            onClick={() => setShowTechnical((value) => !value)}
            className="ms-auto text-y-xs text-y-ink-dim underline decoration-y-line-strong underline-offset-4 transition-colors duration-y-fast hover:text-y-ink-muted"
          >
            {showTechnical ? 'بستن جزئیات' : 'جزئیات فنی'}
          </button>
        ) : null}
      </div>

      {showTechnical && result.technical?.length ? (
        <dl className="mt-2.5 animate-y-fade-in space-y-1 rounded-y-sm border border-y-line bg-y-bg/50 p-2.5 text-y-xs">
          {result.technical.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-y-ink-dim">{item.label}</dt>
              <dd className="yagent-ltr min-w-0 break-all text-y-ink-muted">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  )
}
