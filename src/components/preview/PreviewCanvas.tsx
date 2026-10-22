import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AnnotationLayer } from './AnnotationLayer'
import { Badge } from '@/components/ui/badge'
import { cn, fa } from '@/lib/utils'
import { useYAgent } from '@/state/YAgentProvider'
import type { BridgeAnnotation, BridgeAnnotationDraft, PreviewMode } from '@/preview/bridge'
import type { PreviewRevision } from '@/types/model'

/** Canvas box model, kept in one place so the fit-scale math stays honest. */
const CANVAS_PADDING = 16
const FRAME_GAP = 16
const FRAME_HEADER_H = 24
const FRAME_HEADER_GAP = 8

/**
 * The preview surface.
 *
 * Two independent values drive what is rendered:
 * - the *device width* (`state.preview.width`) is the real CSS width the page is
 *   laid out at inside the iframe — it never changes with the window;
 * - the *display scale* (`state.preview.zoom`) only scales the frame on screen,
 *   `fit` (default) shrinking it to the canvas and `100%` showing it 1:1.
 *
 * Scaling is a CSS transform on the host side, so coordinates inside the page —
 * and therefore annotation geometry, which is stored normalised (0..1) — are
 * untouched. In comparison mode both revisions keep the same device width; they
 * are scaled down together instead of being squeezed into half-width frames.
 */
export function PreviewCanvas({ frameKey }: { frameKey: number }) {
  const { state, actions, derived } = useYAgent()
  const revision = derived.currentRevision
  const compareRevision = state.preview.compareRevisionId
    ? state.revisions[state.preview.compareRevisionId]
    : undefined

  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvas, setCanvas] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const update = () => setCanvas({ width: element.clientWidth, height: element.clientHeight })
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const bridgeAnnotations = useMemo<BridgeAnnotation[]>(() => {
    if (!revision) return []
    return Object.values(state.annotations)
      .filter((annotation) => annotation.revisionId === revision.id)
      .sort((a, b) => a.index - b.index)
      .map((annotation) => ({
        id: annotation.id,
        index: annotation.index,
        kind: annotation.kind,
        rect: annotation.rect,
        comment: annotation.comment,
        status: annotation.status,
        selected: annotation.id === state.preview.selectedAnnotationId,
      }))
  }, [revision, state.annotations, state.preview.selectedAnnotationId])

  const handleCreated = useCallback(
    (draft: BridgeAnnotationDraft) => actions.addBridgeAnnotation(draft),
    [actions],
  )
  const handleClick = useCallback((id: string) => actions.selectAnnotation(id), [actions])
  const handleResize = useCallback((height: number) => actions.reportPreviewHeight(height), [actions])

  const mode: PreviewMode = state.preview.annotate ? 'annotate' : 'browse'

  if (!revision) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-y-base text-y-ink-muted">
        نسخه‌ای از این صفحه موجود نیست.
      </div>
    )
  }

  const comparing = Boolean(compareRevision && compareRevision.id !== revision.id)
  const frames = comparing ? 2 : 1
  const deviceWidth = state.preview.width

  const availableWidth = Math.max(
    160,
    canvas.width - CANVAS_PADDING * 2 - FRAME_GAP * (frames - 1),
  )
  const scale =
    state.preview.zoom === 'fit' ? Math.max(0.2, Math.min(1, availableWidth / frames / deviceWidth)) : 1
  const availableHeight = Math.max(160, (canvas.height || 640) - CANVAS_PADDING * 2)
  const frameHeight = availableHeight - FRAME_HEADER_H - FRAME_HEADER_GAP
  const scaleLabel = `جای‌گیری ${fa(Math.round(scale * 100))}٪`

  return (
    <div
      ref={canvasRef}
      className="yagent-canvas-bg flex h-full min-h-0 w-full justify-center gap-4 overflow-auto p-4"
    >
      <PreviewFrame
        revision={revision}
        badge="نسخهٔ فعلی"
        width={deviceWidth}
        height={Math.round(frameHeight / scale)}
        scale={scale}
        note={state.preview.zoom === 'fit' ? scaleLabel : null}
        mode={mode}
        annotations={bridgeAnnotations}
        selectedAnnotationId={state.preview.selectedAnnotationId}
        frameKey={frameKey}
        onResize={handleResize}
        onAnnotationCreated={handleCreated}
        onAnnotationClick={handleClick}
        highlight
      />

      {comparing && compareRevision ? (
        <PreviewFrame
          revision={compareRevision}
          badge={`نسخهٔ ${fa(compareRevision.revision)}`}
          width={deviceWidth}
          height={Math.round(frameHeight / scale)}
          scale={scale}
          mode="browse"
          annotations={[]}
          frameKey={frameKey}
          onResize={() => undefined}
          interactive={false}
        />
      ) : null}
    </div>
  )
}

function PreviewFrame({
  revision,
  badge,
  width,
  height,
  scale,
  note,
  mode,
  annotations,
  selectedAnnotationId,
  frameKey,
  onReady,
  onResize,
  onAnnotationCreated,
  onAnnotationClick,
  interactive = true,
  highlight = false,
}: {
  revision: PreviewRevision
  badge: string
  /** Real device width the page is laid out at (before the display scale). */
  width: number
  /** Layout height of the frame before the display scale is applied. */
  height: number
  scale: number
  note?: string | null
  mode: PreviewMode
  annotations: BridgeAnnotation[]
  selectedAnnotationId?: string
  frameKey: number
  onReady?: () => void
  onResize: (height: number) => void
  onAnnotationCreated?: (draft: BridgeAnnotationDraft) => void
  onAnnotationClick?: (id: string) => void
  interactive?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex h-full min-h-0 shrink-0 flex-col gap-2" style={{ width: Math.round(width * scale) }}>
      <div className="flex shrink-0 items-center justify-between gap-2 px-1" style={{ height: FRAME_HEADER_H }}>
        <span className="truncate text-y-xs text-y-ink-dim">{revision.pageTitle}</span>
        <span className="flex shrink-0 items-center gap-2">
          {note ? <span className="yagent-num text-y-xs text-y-ink-dim">{note}</span> : null}
          <Badge variant={revision.status === 'published' ? 'success' : 'neutral'}>{badge}</Badge>
          <Badge variant={revision.status === 'published' ? 'plain' : 'accent'}>
            {revision.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
          </Badge>
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            'overflow-hidden rounded-y-md border bg-white shadow-y-soft',
            highlight && mode === 'annotate' ? 'border-y-accent-border' : 'border-y-line-strong',
          )}
          style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          <AnnotationLayer
            revision={revision}
            mode={mode}
            annotations={annotations}
            selectedAnnotationId={selectedAnnotationId}
            nonce={frameKey}
            interactive={interactive}
            onReady={onReady}
            onResize={onResize}
            onAnnotationCreated={onAnnotationCreated}
            onAnnotationClick={onAnnotationClick}
          />
        </div>
      </div>
    </div>
  )
}
