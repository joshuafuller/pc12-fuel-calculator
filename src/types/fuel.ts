export type UnitSystem = 'imperial' | 'metric';

export interface FuelState {
  currentFuel: number;
  desiredFuel: number;
  density: number;
  temperature: number;
  unitSystem: UnitSystem;
}
