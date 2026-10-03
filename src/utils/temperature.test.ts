import {
  adjustDensityForTemperature,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  isNonStandardTemperature,
  toFahrenheit
} from './temperature';

describe('temperature conversion', () => {
  it('converts between °F and °C', () => {
    expect(fahrenheitToCelsius(32)).toBeCloseTo(0);
    expect(fahrenheitToCelsius(212)).toBeCloseTo(100);
    expect(celsiusToFahrenheit(15)).toBeCloseTo(59);
    expect(celsiusToFahrenheit(fahrenheitToCelsius(77))).toBeCloseTo(77);
  });

  it('toFahrenheit leaves °F alone and converts °C', () => {
    expect(toFahrenheit(59, false)).toBe(59);
    expect(toFahrenheit(15, true)).toBeCloseTo(59);
  });
});

describe('adjustDensityForTemperature', () => {
  it('returns the base density at standard temperature', () => {
    expect(adjustDensityForTemperature(6.7, 59, false)).toBe(6.7);
    expect(adjustDensityForTemperature(6.7, 15, true)).toBe(6.7);
  });

  it('is lighter when hot and denser when cold', () => {
    expect(adjustDensityForTemperature(6.7, 100, false)).toBeLessThan(6.7);
    expect(adjustDensityForTemperature(6.7, 0, false)).toBeGreaterThan(6.7);
  });

  it('gives the same answer for equivalent °C and °F inputs', () => {
    expect(adjustDensityForTemperature(6.7, 30, true)).toBeCloseTo(
      adjustDensityForTemperature(6.7, 86, false),
      3
    );
  });
});

describe('isNonStandardTemperature', () => {
  it('compares in °F regardless of the active unit', () => {
    expect(isNonStandardTemperature(59, 59, false)).toBe(false);
    expect(isNonStandardTemperature(15, 59, true)).toBe(false);
    expect(isNonStandardTemperature(16, 59, true)).toBe(true);
    expect(isNonStandardTemperature(60, 59, false)).toBe(true);
  });
});
