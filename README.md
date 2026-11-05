# Weather Fit

A weather-aware wardrobe assistant — search a city, see live current
conditions, and preview a mock AI outfit recommendation.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- lucide-react icons
- OpenWeatherMap Current Weather API

## Getting started

```bash
npm install
```

Create a local environment file and add your key:

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

You can create a key at
[home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys).
New keys can take a few minutes to become active. Restart `npm run dev` after
adding or changing the key.

```bash
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
  App.tsx                        Search lifecycle, loading/error states
  services/weatherService.ts     OpenWeatherMap fetch, validation, errors
  data/mockWardrobe.ts           Temperature-based mock recommendation
  components/
    Header.tsx                   Logo, title, live-data badge
    SearchBar.tsx                Controlled city search + feedback
    CurrentWeatherCard.tsx       Live conditions and dynamic icons
    WardrobeCard.tsx             AI recommendation preview
    WeatherStates.tsx            Loading skeleton + error card
```

## How it works

- Searches call the OpenWeatherMap Current Weather API through
  `src/services/weatherService.ts`.
- Responses are validated and normalized into a typed `CurrentWeather` model.
- Requests time out after 10 seconds and map HTTP/network failures to
  user-friendly errors. A search can be retried from the error card.
- Both metric and wind speed are normalized for the UI (m/s → km/h).
- Weather condition IDs select the matching day or night icon.

## Still mocked

The wardrobe recommendation is rule-based for now: `src/data/mockWardrobe.ts`
picks outfit advice from the real temperature band. The AI card is unchanged
visually, and the real LLM will replace `buildMockWardrobe` in the next phase.

## API key note

Vite exposes `VITE_*` variables to the browser bundle, so this key is public by
design. That is acceptable for a local portfolio demo, but a production app
should proxy OpenWeatherMap requests through a server so the key stays private.

Weather data by [OpenWeatherMap](https://openweathermap.org/).
