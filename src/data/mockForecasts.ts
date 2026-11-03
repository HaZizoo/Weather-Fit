export type WeatherKind = 'cloudy' | 'sunny' | 'snow'

export type WardrobeIcon =
  | 'coat'
  | 'beanie'
  | 'sneakers'
  | 'layers'
  | 'sunglasses'
  | 'boots'

export type WardrobePick = {
  label: string
  icon: WardrobeIcon
}

export type MockForecast = {
  id: string
  city: string
  country: string
  temperature: number
  condition: string
  kind: WeatherKind
  feelsLike: number
  high: number
  low: number
  humidity: number
  windKmh: number
  updatedAt: string
  wardrobe: {
    summary: string
    advice: string
    picks: WardrobePick[]
  }
}

/**
 * Hardcoded sample data. No weather or AI API is called in this phase.
 * Adding a city here automatically makes it searchable.
 */
export const mockForecasts: MockForecast[] = [
  {
    id: 'duesseldorf',
    city: 'Düsseldorf',
    country: 'Germany',
    temperature: 8,
    condition: 'Overcast',
    kind: 'cloudy',
    feelsLike: 6,
    high: 10,
    low: 4,
    humidity: 82,
    windKmh: 18,
    updatedAt: 'Just now',
    wardrobe: {
      summary: 'Cold & overcast',
      advice:
        'It is quite chilly and overcast! Wear a heavy coat, a beanie, and your white Nike Air Force 1s.',
      picks: [
        { label: 'Heavy coat', icon: 'coat' },
        { label: 'Beanie', icon: 'beanie' },
        { label: 'White Nike Air Force 1s', icon: 'sneakers' },
      ],
    },
  },
  {
    id: 'lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    temperature: 19,
    condition: 'Clear skies',
    kind: 'sunny',
    feelsLike: 20,
    high: 21,
    low: 14,
    humidity: 56,
    windKmh: 12,
    updatedAt: 'Just now',
    wardrobe: {
      summary: 'Mild & bright',
      advice:
        'Warm and bright — keep it light. A breezy overshirt over a tee, sunglasses, and your go-to white sneakers will do.',
      picks: [
        { label: 'Overshirt', icon: 'layers' },
        { label: 'Sunglasses', icon: 'sunglasses' },
        { label: 'White sneakers', icon: 'sneakers' },
      ],
    },
  },
  {
    id: 'oslo',
    city: 'Oslo',
    country: 'Norway',
    temperature: 2,
    condition: 'Light snow',
    kind: 'snow',
    feelsLike: -3,
    high: 3,
    low: -2,
    humidity: 88,
    windKmh: 24,
    updatedAt: 'Just now',
    wardrobe: {
      summary: 'Freezing & snowy',
      advice:
        'Cold with snow in the air. Start with a thermal base layer, add a waterproof parka, and finish with insulated boots.',
      picks: [
        { label: 'Thermal base layer', icon: 'layers' },
        { label: 'Waterproof parka', icon: 'coat' },
        { label: 'Insulated boots', icon: 'boots' },
      ],
    },
  },
]
