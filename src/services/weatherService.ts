const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const REQUEST_TIMEOUT_MS = 10_000

export type WeatherKind =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'

export type WeatherErrorCode =
  | 'missing-api-key'
  | 'invalid-city'
  | 'city-not-found'
  | 'invalid-api-key'
  | 'rate-limited'
  | 'network'
  | 'timeout'
  | 'server'
  | 'invalid-response'
  | 'unknown'

export class WeatherApiError extends Error {
  readonly code: WeatherErrorCode

  constructor(code: WeatherErrorCode, message: string) {
    super(message)
    this.name = 'WeatherApiError'
    this.code = code
  }
}

export type CurrentWeather = {
  id: string
  city: string
  country: string
  temperature: number
  feelsLike: number
  high: number
  low: number
  condition: string
  kind: WeatherKind
  isDay: boolean
  humidity: number
  windKmh: number
  updatedAt: string
}

type OpenWeatherResponse = {
  id: number
  dt: number
  name: string
  timezone: number
  weather: Array<{
    id: number
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  wind: {
    speed: number
  }
  sys: {
    country?: string
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isOpenWeatherResponse(value: unknown): value is OpenWeatherResponse {
  if (!isRecord(value)) return false

  const { main, wind, weather, sys } = value

  if (
    !isFiniteNumber(value.id) ||
    !isFiniteNumber(value.dt) ||
    typeof value.name !== 'string' ||
    !isFiniteNumber(value.timezone)
  ) {
    return false
  }

  if (
    !isRecord(main) ||
    !isFiniteNumber(main.temp) ||
    !isFiniteNumber(main.feels_like) ||
    !isFiniteNumber(main.temp_min) ||
    !isFiniteNumber(main.temp_max) ||
    !isFiniteNumber(main.humidity)
  ) {
    return false
  }

  if (!isRecord(wind) || !isFiniteNumber(wind.speed)) return false
  if (!isRecord(sys)) return false
  if (sys.country !== undefined && typeof sys.country !== 'string') {
    return false
  }

  if (!Array.isArray(weather) || weather.length === 0) return false

  const condition = weather[0]

  return (
    isRecord(condition) &&
    isFiniteNumber(condition.id) &&
    typeof condition.description === 'string' &&
    typeof condition.icon === 'string'
  )
}

function toWeatherKind(conditionId: number): WeatherKind {
  if (conditionId >= 200 && conditionId < 300) return 'thunderstorm'
  if (conditionId >= 300 && conditionId < 400) return 'drizzle'
  if (conditionId >= 500 && conditionId < 600) return 'rain'
  if (conditionId >= 600 && conditionId < 700) return 'snow'
  if (conditionId >= 700 && conditionId < 800) return 'mist'
  if (conditionId === 800) return 'clear'
  if (conditionId === 801 || conditionId === 802) return 'partly-cloudy'
  return 'cloudy'
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toCountryName(countryCode: string | undefined): string {
  if (!countryCode) return ''

  try {
    return (
      new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) ??
      countryCode
    )
  } catch {
    return countryCode
  }
}

function formatLocalTime(
  timestampSeconds: number,
  timezoneOffsetSeconds: number,
): string {
  const cityTime = new Date(
    (timestampSeconds + timezoneOffsetSeconds) * 1000,
  )

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(cityTime)
}

function mapResponse(payload: OpenWeatherResponse): CurrentWeather {
  const condition = payload.weather[0]

  return {
    id: `${payload.id}-${payload.dt}`,
    city: payload.name,
    country: toCountryName(payload.sys.country),
    temperature: Math.round(payload.main.temp),
    feelsLike: Math.round(payload.main.feels_like),
    high: Math.round(payload.main.temp_max),
    low: Math.round(payload.main.temp_min),
    condition: titleCase(condition.description),
    kind: toWeatherKind(condition.id),
    isDay: !condition.icon.endsWith('n'),
    humidity: Math.round(payload.main.humidity),
    windKmh: Math.round(payload.wind.speed * 3.6),
    updatedAt: formatLocalTime(payload.dt, payload.timezone),
  }
}

function errorForStatus(status: number, city: string): WeatherApiError {
  if (status === 401 || status === 403) {
    return new WeatherApiError(
      'invalid-api-key',
      'OpenWeatherMap rejected the API key. Check VITE_WEATHER_API_KEY in your .env file and restart the dev server.',
    )
  }

  if (status === 400 || status === 404) {
    return new WeatherApiError(
      'city-not-found',
      `We couldn’t find “${city}”. Check the spelling and try again.`,
    )
  }

  if (status === 429) {
    return new WeatherApiError(
      'rate-limited',
      'The weather service is receiving too many requests. Wait a moment and try again.',
    )
  }

  if (status >= 500) {
    return new WeatherApiError(
      'server',
      'OpenWeatherMap is having trouble right now. Please try again shortly.',
    )
  }

  return new WeatherApiError(
    'unknown',
    `OpenWeatherMap returned an unexpected error (${status}). Please try again.`,
  )
}

export async function fetchCurrentWeather(
  city: string,
  options: { signal?: AbortSignal } = {},
): Promise<CurrentWeather> {
  const cityName = city.trim()

  if (!cityName) {
    throw new WeatherApiError(
      'invalid-city',
      'Enter a city name to check its weather.',
    )
  }

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY?.trim()

  if (!apiKey) {
    throw new WeatherApiError(
      'missing-api-key',
      'No OpenWeatherMap API key was found. Add VITE_WEATHER_API_KEY to your .env file and restart the dev server.',
    )
  }

  const controller = new AbortController()
  let didTimeout = false

  const timeoutId = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  const abortRequest = () => controller.abort()

  if (options.signal?.aborted) {
    controller.abort()
  } else {
    options.signal?.addEventListener('abort', abortRequest, { once: true })
  }

  try {
    const params = new URLSearchParams({
      q: cityName,
      appid: apiKey,
      units: 'metric',
      lang: 'en',
    })

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw errorForStatus(response.status, cityName)
    }

    let payload: unknown

    try {
      payload = await response.json()
    } catch {
      throw new WeatherApiError(
        'invalid-response',
        'OpenWeatherMap returned an unreadable response. Please try again.',
      )
    }

    if (!isOpenWeatherResponse(payload)) {
      throw new WeatherApiError(
        'invalid-response',
        'OpenWeatherMap returned data in an unexpected format. Please try again.',
      )
    }

    return mapResponse(payload)
  } catch (cause) {
    if (cause instanceof WeatherApiError) throw cause

    // Preserve the caller's own abort so the UI can ignore cancelled requests.
    if (options.signal?.aborted) throw cause

    if (didTimeout) {
      throw new WeatherApiError(
        'timeout',
        'The weather request took too long. Check your connection and try again.',
      )
    }

    throw new WeatherApiError(
      'network',
      'Could not reach OpenWeatherMap. Check your internet connection and try again.',
    )
  } finally {
    clearTimeout(timeoutId)
    options.signal?.removeEventListener('abort', abortRequest)
  }
}

export function toWeatherApiError(cause: unknown): WeatherApiError {
  if (cause instanceof WeatherApiError) return cause

  return new WeatherApiError(
    'unknown',
    'Something went wrong while loading the weather. Please try again.',
  )
}
