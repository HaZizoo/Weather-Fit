import {
  Footprints,
  Glasses,
  Info,
  Layers,
  Shirt,
  Snowflake,
  Sparkles,
  Umbrella,
  type LucideIcon,
} from 'lucide-react'
import type {
  WardrobeIcon,
  WardrobeRecommendation,
} from '../data/mockWardrobe'
import type { CurrentWeather } from '../services/weatherService'

const wardrobeIcons: Record<WardrobeIcon, LucideIcon> = {
  coat: Shirt,
  beanie: Snowflake,
  sneakers: Footprints,
  layers: Layers,
  sunglasses: Glasses,
  boots: Footprints,
  tee: Shirt,
  umbrella: Umbrella,
}

type WardrobeCardProps = {
  weather: CurrentWeather
  wardrobe: WardrobeRecommendation
}

export function WardrobeCard({ weather, wardrobe }: WardrobeCardProps) {
  return (
    <section
      aria-labelledby="wardrobe-title"
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
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/30 to-indigo-400/20 ring-1 ring-inset ring-white/15">
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
                {wardrobe.summary} · {weather.city}, {weather.temperature}°C
              </p>
            </div>
          </div>

          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300 sm:inline-flex">
            Preview
          </span>
        </div>

        <p className="mt-6 max-w-xl text-pretty text-xl font-medium leading-snug tracking-[-0.015em] text-slate-100 sm:text-[22px]">
          {wardrobe.advice}
        </p>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Today&rsquo;s picks
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {wardrobe.picks.map((pick) => {
              const PickIcon = wardrobeIcons[pick.icon]

              return (
                <li
                  key={pick.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[13px] font-medium text-slate-200 backdrop-blur"
                >
                  <PickIcon
                    className="size-4 shrink-0 text-sky-300"
                    aria-hidden="true"
                  />
                  {pick.label}
                </li>
              )
            })}
          </ul>
        </div>

        <p className="mt-6 flex items-start gap-2 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-slate-400">
          <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          Mock recommendation based on live temperature. Real AI styling arrives in
          the next phase.
        </p>
      </div>
    </section>
  )
}
