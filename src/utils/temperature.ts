/** Standard day temperature the base fuel density is quoted at. */
export const STANDARD_TEMPERATURE_F = 59;

/** Approximate jet-fuel density change, lbs/gal per °F (simplified linear model). */
const DENSITY_CHANGE_PER_F = -0.0035;

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9);
}

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

/** Fuel density at the given temperature, rounded to 3 decimal places. */
export function adjustDensityForTemperature(
  baseDensity: number,
  currentTemp: number,
  isMetric: boolean
): number {
  const tempF = isMetric ? celsiusToFahrenheit(currentTemp) : currentTemp;
  const adjustment = (tempF - STANDARD_TEMPERATURE_F) * DENSITY_CHANGE_PER_F;
  return Number((baseDensity + adjustment).toFixed(3));
}

/** Convert a temperature in the active unit system to °F. */
export function toFahrenheit(temp: number, isMetric: boolean): number {
  return isMetric ? celsiusToFahrenheit(temp) : temp;
}

/** True when the temperature differs from the (°F) default by half a degree or more. */
export function isNonStandardTemperature(
  temp: number,
  defaultTemperatureF: number,
  isMetric: boolean
): boolean {
  return Math.abs(toFahrenheit(temp, isMetric) - defaultTemperatureF) >= 0.5;
}
