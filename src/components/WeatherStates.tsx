import { CloudOff, Info, RefreshCw } from 'lucide-react'

export function WeatherSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading current weather…</span>

      <div
        aria-hidden="true"
        className="animate-pulse space-y-4 sm:space-y-5"
      >
        <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-card sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-4 w-36 rounded-md bg-slate-200" />
              <div className="h-2.5 w-28 rounded bg-slate-100" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-100" />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_190px]">
            <div>
              <div className="h-[76px] w-32 rounded-2xl bg-slate-200 sm:h-[92px]" />
              <div className="mt-5 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-3.5 w-28 rounded bg-slate-200" />
                  <div className="h-2.5 w-40 rounded bg-slate-100" />
                </div>
              </div>
            </div>
            <div className="hidden aspect-square w-full max-w-[190px] justify-self-center rounded-[26px] bg-slate-100 sm:block" />
          </div>

          <div className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2 bg-white px-3 py-4 sm:px-4"
              >
                <div className="h-2.5 w-16 rounded bg-slate-100" />
                <div className="h-3.5 w-12 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-800/70 bg-[#0b1220] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10" />
            <div className="space-y-2">
              <div className="h-3.5 w-44 rounded bg-white/15" />
              <div className="h-2.5 w-32 rounded bg-white/[0.07]" />
            </div>
          </div>
          <div className="mt-6 space-y-2.5">
            <div className="h-5 w-full max-w-md rounded bg-white/10" />
            <div className="h-5 w-2/3 rounded bg-white/10" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="h-9 w-24 rounded-full bg-white/[0.07]" />
            <div className="h-9 w-20 rounded-full bg-white/[0.07]" />
            <div className="h-9 w-32 rounded-full bg-white/[0.07]" />
          </div>
        </div>
      </div>
    </div>
  )
}

type WeatherErrorCardProps = {
  message: string
  hint?: string
  onRetry?: () => void
}

export function WeatherErrorCard({
  message,
  hint,
  onRetry,
}: WeatherErrorCardProps) {
  return (
    <section
      role="alert"
      className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-card sm:p-7"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100">
          <CloudOff className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-600">
            Weather unavailable
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            We couldn’t fetch the forecast
          </h2>
          <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-slate-500">
            {message}
          </p>

          {hint && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200/70">
              <Info
                className="mt-px size-3.5 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <span>{hint}</span>
            </p>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
