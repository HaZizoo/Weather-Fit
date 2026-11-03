import { useState } from 'react'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { WardrobeCard } from './components/WardrobeCard'
import { mockForecasts, type MockForecast } from './data/mockForecasts'

const today = new Date()
const todayLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(today)
const currentYear = today.getFullYear()

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function App() {
  const [query, setQuery] = useState('')
  const [forecast, setForecast] = useState<MockForecast>(mockForecasts[0])
  const [notice, setNotice] = useState<string | null>(null)

  function handleSearch() {
    const term = normalize(query.trim())

    if (!term) {
      setNotice('Type a city name to look up its sample forecast.')
      return
    }

    const match = mockForecasts.find(
      (item) =>
        normalize(item.city) === term || normalize(item.country) === term,
    )

    if (!match) {
      setNotice(
        `No sample forecast for “${query.trim()}” yet. Try Düsseldorf, Lisbon, or Oslo.`,
      )
      return
    }

    setForecast(match)
    setQuery(match.city)
    setNotice(null)
  }

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
            Check the forecast, then let AI style the fit. Search a city below to
            preview how it works.
          </p>
        </section>

        <div className="mt-7 sm:mt-8">
          <SearchBar
            query={query}
            notice={notice}
            onQueryChange={setQuery}
            onSearch={handleSearch}
          />
        </div>

        <div key={forecast.id} className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
          <div className="animate-rise">
            <CurrentWeatherCard forecast={forecast} />
          </div>
          <div className="animate-rise [animation-delay:110ms]">
            <WardrobeCard forecast={forecast} />
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          Now showing the sample forecast for {forecast.city}.
        </p>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-2 border-t border-slate-900/[0.06] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Weather Fit · React, Vite &amp; Tailwind CSS</p>
          <p className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            UI preview — no live APIs yet
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
