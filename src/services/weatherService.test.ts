import { describe, expect, it } from 'vitest'
import { WeatherApiError, toWeatherApiError, toWeatherKind } from './weatherService'

describe('weather service', () => {
  it.each([[800, 'clear'], [501, 'rain'], [611, 'snow'], [803, 'cloudy']] as const)(
    'maps OpenWeather condition %i to %s',
    (condition, expected) => expect(toWeatherKind(condition)).toBe(expected),
  )

  it('preserves typed errors and normalizes unknown failures', () => {
    const known = new WeatherApiError('timeout', 'Timed out')
    expect(toWeatherApiError(known)).toBe(known)
    expect(toWeatherApiError(new Error('network')).code).toBe('unknown')
  })
})
