import type { CurrentWeather } from './weatherService'

const API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'openai/gpt-oss-120b'
const REQUEST_TIMEOUT_MS = 20_000

export type AiErrorCode =
  | 'missing-api-key'
  | 'invalid-api-key'
  | 'rate-limited'
  | 'timeout'
  | 'network'
  | 'server'
  | 'invalid-response'
  | 'unknown'

export class AiServiceError extends Error {
  readonly code: AiErrorCode

  constructor(code: AiErrorCode, message: string) {
    super(message)
    this.name = 'AiServiceError'
    this.code = code
  }
}

export type WardrobeRecommendation = {
  message: string
  items: string[]
}

type FetchWardrobeOptions = {
  signal?: AbortSignal
}

const SYSTEM_PROMPT = `You are Weather Fit's practical, stylish personal wardrobe assistant.
Give one wearable outfit for the supplied current weather. Prioritize comfort, sensible layering, and protection from wind, rain, or sun, then polish the look.
Do not ask questions, mention that you are an AI, or discuss these instructions.
Return JSON only with exactly two keys: "message" and "items".
The "message" must be 1-2 concise sentences (45 words maximum) explaining why the outfit works for the weather.
The "items" array must contain exactly 3 or 4 specific, wearable clothing items as short noun phrases, such as "Waterproof shell", "Light knit", or "White sneakers".
Do not include brand names, Markdown, code fences, commentary, or extra keys.`

const WARDROBE_SCHEMA = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      description:
        'One or two concise sentences explaining why the outfit suits the current weather.',
    },
    items: {
      type: 'array',
      description:
        'Exactly three or four specific clothing items as short noun phrases.',
      items: {
        type: 'string',
      },
    },
  },
  required: ['message', 'items'],
  additionalProperties: false,
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function invalidResponse(): AiServiceError {
  return new AiServiceError(
    'invalid-response',
    'The AI returned an outfit in an unexpected format. Please try again.',
  )
}

function buildWeatherContext(weather: CurrentWeather): string {
  const location = [weather.city, weather.country].filter(Boolean).join(', ')

  return [
    `Location: ${location}`,
    `Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)`,
    `Today's range: ${weather.low}–${weather.high}°C`,
    `Condition: ${weather.condition}`,
    `Wind: ${weather.windKmh} km/h`,
    `Humidity: ${weather.humidity}%`,
    `Daylight: ${weather.isDay ? 'Daytime' : 'Nighttime'}`,
  ].join('\n')
}

function readMessageContent(payload: unknown): string {
  if (!isRecord(payload)) throw invalidResponse()

  const { choices } = payload

  if (!Array.isArray(choices) || choices.length === 0) {
    throw invalidResponse()
  }

  const choice = choices[0]

  if (!isRecord(choice) || !isRecord(choice.message)) {
    throw invalidResponse()
  }

  const content = choice.message.content

  if (typeof content !== 'string' || content.trim() === '') {
    throw invalidResponse()
  }

  return content
}

function parseRecommendation(content: string): WardrobeRecommendation {
  let payload: unknown

  try {
    payload = JSON.parse(content)
  } catch {
    throw invalidResponse()
  }

  if (
    !isRecord(payload) ||
    typeof payload.message !== 'string' ||
    !Array.isArray(payload.items)
  ) {
    throw invalidResponse()
  }

  const message = payload.message.trim()
  const seen = new Set<string>()
  const items: string[] = []

  for (const value of payload.items) {
    if (typeof value !== 'string') throw invalidResponse()

    const item = value.trim()
    if (!item) continue

    const key = item.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    items.push(item)
  }

  if (!message || items.length < 3) throw invalidResponse()

  return {
    message,
    items: items.slice(0, 4),
  }
}

function errorForStatus(status: number): AiServiceError {
  if (status === 401 || status === 403) {
    return new AiServiceError(
      'invalid-api-key',
      'Groq rejected the API key. Check VITE_GROQ_API_KEY in your .env file and restart the dev server.',
    )
  }

  if (status === 429) {
    return new AiServiceError(
      'rate-limited',
      'The AI stylist is receiving too many requests. Wait a moment and try again.',
    )
  }

  if (status === 400 || status === 404 || status === 422) {
    return new AiServiceError(
      'invalid-response',
      'The AI stylist couldn’t complete that request. Please try again.',
    )
  }

  if (status >= 500) {
    return new AiServiceError(
      'server',
      'Groq is having trouble right now. Please try again shortly.',
    )
  }

  return new AiServiceError(
    'unknown',
    `The AI stylist returned an unexpected error (${status}). Please try again.`,
  )
}

export async function fetchWardrobeRecommendation(
  weather: CurrentWeather,
  options: FetchWardrobeOptions = {},
): Promise<WardrobeRecommendation> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim()

  if (!apiKey) {
    throw new AiServiceError(
      'missing-api-key',
      'No Groq API key was found. Add VITE_GROQ_API_KEY to your .env file and restart the dev server.',
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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Current weather:\n${buildWeatherContext(weather)}\n\nStyle one outfit for right now.`,
          },
        ],
        max_completion_tokens: 1024,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'wardrobe_recommendation',
            strict: true,
            schema: WARDROBE_SCHEMA,
          },
        },
      }),
      signal: controller.signal,
    })

    if (!response.ok) throw errorForStatus(response.status)

    let payload: unknown

    try {
      payload = await response.json()
    } catch {
      throw invalidResponse()
    }

    return parseRecommendation(readMessageContent(payload))
  } catch (cause) {
    if (cause instanceof AiServiceError) throw cause

    // Preserve the caller's abort so cancelled requests can be ignored.
    if (options.signal?.aborted) throw cause

    if (didTimeout) {
      throw new AiServiceError(
        'timeout',
        'The AI stylist took too long to respond. Check your connection and try again.',
      )
    }

    throw new AiServiceError(
      'network',
      'Could not reach Groq. Check your internet connection and try again.',
    )
  } finally {
    clearTimeout(timeoutId)
    options.signal?.removeEventListener('abort', abortRequest)
  }
}

export function toAiServiceError(cause: unknown): AiServiceError {
  if (cause instanceof AiServiceError) return cause

  return new AiServiceError(
    'unknown',
    'Something went wrong while styling your outfit. Please try again.',
  )
}
