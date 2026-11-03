# Weather Fit

A weather-aware wardrobe assistant — search a city, see the current conditions,
and get an AI outfit recommendation. This first phase is UI scaffolding only:
every forecast and recommendation is hardcoded mock data.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build   # typecheck + production build
npm run lint    # oxlint
npm run preview # serve the production build
```

## Project structure

```
src/
  App.tsx                        Page layout + mock search state
  data/mockForecasts.ts          Typed sample forecasts and wardrobe picks
  components/
    Header.tsx                   Logo, title, demo badge
    SearchBar.tsx                Controlled city search + feedback
    CurrentWeatherCard.tsx       Temperature, condition, stats
    WardrobeCard.tsx             AI recommendation + outfit picks
```

## What is mocked

- Three cities: Düsseldorf, Lisbon, and Oslo. Searching for one of them swaps the
  displayed forecast; other cities show an "no sample forecast" hint.
- Weather values, condition icons, and wardrobe advice all come from
  `src/data/mockForecasts.ts`.
- No network requests are made. There is no OpenWeather, Groq, or OpenAI
  integration yet.

## Next step

Connect a weather API for the search results, then pass the forecast to an LLM to
generate the wardrobe recommendation. Replace the mock state in `App.tsx` with the
real request lifecycle and keep the existing presentational components.
