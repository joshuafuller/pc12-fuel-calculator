// Convert Fahrenheit to Celsius
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5/9);
}

// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * (9/5)) + 32;
}

// Calculate density adjustment based on temperature
// Using a simplified linear approximation for aviation fuel
export function adjustDensityForTemperature(
  baseDensity: number,
  currentTemp: number,
  isMetric: boolean
): number {
  // Convert temperature to Fahrenheit if metric
  const tempF = isMetric ? celsiusToFahrenheit(currentTemp) : currentTemp;
  
  // Standard day temperature is 59°F
  const tempDiff = tempF - 59;
  
  // Approximate density change of -0.0035 lbs/gal per °F increase
  const densityAdjustment = tempDiff * -0.0035;
  
  // Return rounded to 3 decimal places for precision
  return Number((baseDensity + densityAdjustment).toFixed(3));
}