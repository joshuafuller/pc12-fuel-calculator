import { DEFAULT_FUEL_DENSITY, MAX_FUEL_POUNDS } from '../utils/constants';
import { STANDARD_TEMPERATURE_F } from '../utils/temperature';

export interface Settings {
  maxFuelLoad: number;
  defaultDensity: number;
  defaultPresetLoad: number;
  defaultTemperature: number; // always stored in °F
  persistSettings: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  maxFuelLoad: MAX_FUEL_POUNDS,
  defaultDensity: DEFAULT_FUEL_DENSITY,
  defaultPresetLoad: 2000,
  defaultTemperature: STANDARD_TEMPERATURE_F,
  persistSettings: true
};
