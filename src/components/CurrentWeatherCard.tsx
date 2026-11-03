import {
  Cloud,
  CloudSnow,
  Droplets,
  MapPin,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import type { MockForecast, WeatherKind } from '../data/mockForecasts'

const weatherIcons: Record<WeatherKind, LucideIcon> = {
  cloudy: Cloud,
  sunny: Sun,
  snow: CloudSnow,
}

type CurrentWeatherCardProps = {
  forecast: MockForecast
}

export function CurrentWeatherCard({ forecast }: CurrentWeatherCardProps) {
  const WeatherIcon = weatherIcons[forecast.kind]

  return (
    <article className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-card">
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-sky-600" aria-hidden="true" />
              <h2 className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
                {forecast.city}
                <span className="font-normal text-slate-500">, {forecast.country}</span>
              </h2>
            </div>
            <p className="mt-1.5 pl-[22px] text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Current weather · {forecast.updatedAt}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            <span className="size-1.5 rounded-full bg-sky-500" aria-hidden="true" />
            Sample data
          </span>
        </div>

        <div className="mt-5 grid items-center gap-6 sm:mt-6 sm:grid-cols-[minmax(0,1fr)_190px]">
          <div>
            <div className="flex items-start gap-1">
              <span className="text-[76px] font-semibold leading-[0.9] tracking-[-0.055em] text-slate-900 tabular-nums sm:text-[92px]">
                {forecast.temperature}
              </span>
              <span className="-mt-1 text-3xl font-light text-slate-400 sm:text-4xl">
                °C
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100">
                <WeatherIcon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{forecast.condition}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Feels like {forecast.feelsLike}° · H {forecast.high}° L {forecast.low}°
                </p>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative hidden aspect-square w-full max-w-[190px] items-center justify-center justify-self-center overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-br from-sky-100 via-white to-indigo-100 shadow-[inset_0_1px_0_#fff,0_18px_40px_-30px_rgba(2,132,199,0.55)] sm:flex"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.95),transparent_65%)]" />
            <div className="absolute right-6 top-6 size-9 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 shadow-[0_0_24px_8px_rgba(253,230,138,0.45)]" />
            <div className="absolute inset-4 rounded-[20px] border border-white/70" />
            <WeatherIcon
              className="relative size-[84px] text-sky-600/90 drop-shadow-sm"
              strokeWidth={1}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70 sm:mt-7">
          <Stat icon={Thermometer} label="Feels like" value={`${forecast.feelsLike}°C`} />
          <Stat icon={Droplets} label="Humidity" value={`${forecast.humidity}%`} />
          <Stat icon={Wind} label="Wind" value={`${forecast.windKmh} km/h`} />
        </dl>
      </div>
    </article>
  )
}

type StatProps = {
  icon: LucideIcon
  label: string
  value: string
}

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-1.5 bg-white px-3 py-3.5 sm:px-4">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        <Icon className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  )
}
