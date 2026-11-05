import type { CurrentWeather } from '../services/weatherService'

export type WardrobeIcon =
  | 'coat'
  | 'beanie'
  | 'sneakers'
  | 'layers'
  | 'sunglasses'
  | 'boots'
  | 'tee'
  | 'umbrella'

export type WardrobePick = {
  label: string
  icon: WardrobeIcon
}

export type WardrobeRecommendation = {
  summary: string
  advice: string
  picks: WardrobePick[]
}

/**
 * Temporary rule-based stand-in for the LLM recommendation. It only reads the
 * real temperature so the layout can be previewed with live weather data.
 */
export function buildMockWardrobe(
  weather: CurrentWeather,
): WardrobeRecommendation {
  if (weather.temperature <= 5) {
    return {
      summary: 'Freezing outside',
      advice:
        'Near-freezing temperatures call for serious layers. Start with a thermal base, add a waterproof parka, and finish with insulated boots.',
      picks: [
        { label: 'Thermal base layer', icon: 'layers' },
        { label: 'Waterproof parka', icon: 'coat' },
        { label: 'Insulated boots', icon: 'boots' },
      ],
    }
  }

  if (weather.temperature <= 12) {
    return {
      summary: 'Cold & crisp',
      advice:
        'It is quite chilly out. Wear a heavy coat, a beanie, and your white Nike Air Force 1s.',
      picks: [
        { label: 'Heavy coat', icon: 'coat' },
        { label: 'Beanie', icon: 'beanie' },
        { label: 'White Nike Air Force 1s', icon: 'sneakers' },
      ],
    }
  }

  if (weather.temperature <= 18) {
    return {
      summary: 'Cool layers',
      advice:
        'Cool but comfortable. An overshirt over a tee and your go-to sneakers should do the job today.',
      picks: [
        { label: 'Light overshirt', icon: 'layers' },
        { label: 'Everyday tee', icon: 'tee' },
        { label: 'White sneakers', icon: 'sneakers' },
      ],
    }
  }

  if (weather.temperature <= 24) {
    return {
      summary: 'Mild & easy',
      advice:
        'Mild enough to keep things light. A tee, a light overshirt, and sunglasses will carry you through the day.',
      picks: [
        { label: 'Breathable tee', icon: 'tee' },
        { label: 'Light overshirt', icon: 'layers' },
        { label: 'Sunglasses', icon: 'sunglasses' },
      ],
    }
  }

  return {
    summary: 'Warm & bright',
    advice:
      'Warm and bright. Go light with a breathable tee, sunglasses, and fresh white sneakers.',
    picks: [
      { label: 'Breathable tee', icon: 'tee' },
      { label: 'Sunglasses', icon: 'sunglasses' },
      { label: 'White sneakers', icon: 'sneakers' },
    ],
  }
}
