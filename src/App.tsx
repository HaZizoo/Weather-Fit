import { useCallback, useEffect, useRef, useState } from 'react'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { WardrobeCard } from './components/WardrobeCard'
import { WeatherErrorCard, WeatherSkeleton } from './components/WeatherStates'
import { buildMockWardrobe } from './data/mockWardrobe'
import {
  WeatherApiError,
  fetchCurrentWeather,
  toWeatherApiError,
  type CurrentWeather,
} from './services/weatherService'

const DEFAULT_CITY = 'Düsseldorf'

const today = new Date()
const todayLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(today)
const currentYear = today.getFullYear()

function App() {
  const [query, setQuery] = useState(DEFAULT_CITY)
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<WeatherApiError | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const loadWeather = useCallback(async (rawCity: string) => {
    const city = rawCity.trim()

    abortRef.current?.abort()
    const requestId = ++requestIdRef.current

    if (!city) {
      setIsLoading(false)
      setError(
        new WeatherApiError(
          'invalid-city',
          'Enter a city name to check its weather.',
        ),
      )
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setIsLoading(true)
    setError(null)

    try {
      const nextWeather = await fetchCurrentWeather(city, {
        signal: controller.signal,
      })

      if (requestId !== requestIdRef.current) return

      setWeather(nextWeather)
    } catch (cause) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) return

      setError(toWeatherApiError(cause))
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    const requestId = ++requestIdRef.current

    void fetchCurrentWeather(DEFAULT_CITY, { signal: controller.signal })
      .then((nextWeather) => {
        if (requestId === requestIdRef.current) setWeather(nextWeather)
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted || requestId !== requestIdRef.current)
          return

        setError(toWeatherApiError(cause))
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false)
      })

    return () => {
      requestIdRef.current += 1
      abortRef.current?.abort()
    }
  }, [])

  function handleSearch() {
    void loadWeather(query)
  }

  function handleRetry() {
    void loadWeather(query || DEFAULT_CITY)
  }

  const isMissingKey = error?.code === 'missing-api-key'

  return (
    <div className="relative flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/60 via-indigo-100/50 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -right-16 size-[380px] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] opacity-60 [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
      </div>

      <Header />

      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-14"
      >
        <section className="animate-rise">
          <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            <span className="h-px w-6 bg-sky-300" aria-hidden="true" />
            {todayLabel}
          </p>
          <h1 className="mt-4 max-w-xl text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-slate-900 sm:text-[44px]">
            Weather, meet <span className="text-sky-600">your wardrobe.</span>
          </h1>
          <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-slate-500">
            Check live conditions, then preview how AI would style the fit. Search
            any city below to get started.
          </p>
        </section>

        <div className="mt-7 sm:mt-8">
          <SearchBar
            query={query}
            notice={error?.message ?? null}
            isError={Boolean(error)}
            isLoading={isLoading}
            onQueryChange={setQuery}
            onSearch={handleSearch}
          />
        </div>

        <div className="mt-4 sm:mt-5">
          {isLoading ? (
            <WeatherSkeleton />
          ) : weather ? (
            <div key={weather.id} className="space-y-4 sm:space-y-5">
              <div className="animate-rise">
                <CurrentWeatherCard weather={weather} />
              </div>
              <div className="animate-rise [animation-delay:110ms]">
                <WardrobeCard
                  weather={weather}
                  wardrobe={buildMockWardrobe(weather)}
                />
              </div>
            </div>
          ) : (
            <div className="animate-rise">
              <WeatherErrorCard
                message={
                  error?.message ?? 'Unable to load the weather right now.'
                }
                hint={
                  isMissingKey
                    ? 'Create a .env file in the project root (next to package.json). A VITE_WEATHER_API_KEY entry is ready in .env.example.'
                    : undefined
                }
                onRetry={isMissingKey ? undefined : handleRetry}
              />
            </div>
          )}
        </div>

        <p aria-live="polite" className="sr-only">
          {isLoading
            ? 'Loading the current weather.'
            : weather
              ? `Now showing live weather for ${weather.city}${
                  weather.country ? `, ${weather.country}` : ''
                }.`
              : ''}
        </p>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-2 border-t border-slate-900/[0.06] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Weather Fit · React, Vite &amp; Tailwind CSS</p>
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Weather data by OpenWeatherMap
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
