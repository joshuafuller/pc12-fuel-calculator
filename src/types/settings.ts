export interface Settings {
  maxFuelLoad: number;
  defaultDensity: number;
  defaultPresetLoad: number;
  defaultTemperature: number;
  persistSettings: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  maxFuelLoad: 2704,
  defaultDensity: 6.7,
  defaultPresetLoad: 2000,
  defaultTemperature: 59, // Standard day temperature in Fahrenheit
  persistSettings: true
};