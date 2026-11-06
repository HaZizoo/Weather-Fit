import {
  Check,
  Info,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import type {
  AiServiceError,
  WardrobeRecommendation,
} from '../services/aiService'
import type { CurrentWeather } from '../services/weatherService'

type WardrobeCardProps = {
  weather: CurrentWeather
  recommendation: WardrobeRecommendation | null
  isLoading: boolean
  error: AiServiceError | null
  onRetry?: () => void
}

export function WardrobeCard({
  weather,
  recommendation,
  isLoading,
  error,
  onRetry,
}: WardrobeCardProps) {
  const isPending = isLoading || (!recommendation && !error)

  return (
    <section
      aria-labelledby="wardrobe-title"
      aria-busy={isPending}
      className="relative overflow-hidden rounded-[26px] border border-slate-800/70 bg-[#0b1220] p-5 text-white shadow-ai sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-sky-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-64 rounded-full bg-indigo-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_75%)]"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/30 to-indigo-400/20 ring-1 ring-inset ring-white/15 ${
                isPending
                  ? 'animate-pulse shadow-[0_0_32px_rgba(56,189,248,0.28)]'
                  : ''
              }`}
            >
              <Sparkles className="size-5 text-sky-300" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="wardrobe-title"
                className="text-sm font-semibold tracking-tight text-white"
              >
                AI Wardrobe Recommendation
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {isPending
                  ? `Styling for ${weather.city} · ${weather.temperature}°C`
                  : `${weather.city} · ${weather.temperature}°C · ${weather.condition}`}
              </p>
            </div>
          </div>

          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300 sm:inline-flex">
            {isPending ? (
              <>
                <LoaderCircle
                  className="size-3 animate-spin text-sky-300"
                  aria-hidden="true"
                />
                Styling
              </>
            ) : error ? (
              'Unavailable'
            ) : (
              'Groq AI'
            )}
          </span>
        </div>

        {isPending ? (
          <WardrobeLoading />
        ) : error ? (
          <WardrobeError error={error} onRetry={onRetry} />
        ) : recommendation ? (
          <WardrobeRecommendationContent recommendation={recommendation} />
        ) : null}

        <p className="mt-6 flex items-start gap-2 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-slate-400">
          <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {isPending
            ? 'Groq is reading the forecast and putting a look together.'
            : error
              ? 'Your live weather is still up to date.'
              : 'AI-generated from live weather. Groq can make mistakes—use your judgment.'}
        </p>
      </div>
    </section>
  )
}

function WardrobeLoading() {
  return (
    <div role="status" className="relative mt-6">
      <span className="sr-only">
        Generating your AI wardrobe recommendation…
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-6 h-24 w-56 animate-pulse rounded-full bg-sky-400/10 blur-3xl"
      />
      <div aria-hidden="true" className="relative animate-pulse space-y-3">
        <div className="h-5 w-full max-w-lg rounded-md bg-white/10" />
        <div className="h-5 w-2/3 rounded-md bg-white/10" />
        <div className="mt-6 flex flex-wrap gap-2">
          <div className="h-9 w-28 rounded-full border border-white/10 bg-white/[0.06]" />
          <div className="h-9 w-24 rounded-full border border-white/10 bg-white/[0.06]" />
          <div className="h-9 w-36 rounded-full border border-white/10 bg-white/[0.06]" />
        </div>
      </div>
    </div>
  )
}

type WardrobeErrorProps = {
  error: AiServiceError
  onRetry?: () => void
}

function WardrobeError({ error, onRetry }: WardrobeErrorProps) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-2xl border border-rose-300/15 bg-rose-400/[0.07] p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300 ring-1 ring-inset ring-rose-300/15">
          <TriangleAlert className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">
            The AI stylist couldn’t finish the look.
          </p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-300">
            {error.message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-3.5 text-xs font-semibold text-slate-900 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220] active:translate-y-px"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

type WardrobeRecommendationContentProps = {
  recommendation: WardrobeRecommendation
}

function WardrobeRecommendationContent({
  recommendation,
}: WardrobeRecommendationContentProps) {
  return (
    <div className="mt-6">
      <p className="max-w-xl text-pretty text-xl font-medium leading-snug tracking-[-0.015em] text-slate-100 sm:text-[22px]">
        {recommendation.message}
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Today&rsquo;s picks
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {recommendation.items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[13px] font-medium text-slate-200 backdrop-blur"
            >
              <Check
                className="size-3.5 shrink-0 text-sky-300"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
