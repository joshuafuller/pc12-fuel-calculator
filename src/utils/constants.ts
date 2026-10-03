import type { UnitSystem } from '../types/fuel';

export const DEFAULT_FUEL_DENSITY = 6.7; // lbs per US gallon at standard temperature
export const MAX_FUEL_POUNDS = 2704; // PC-12 usable fuel capacity, lbs
export const LITERS_PER_GALLON = 3.78541;

export const poundsToGallons = (pounds: number, density: number = DEFAULT_FUEL_DENSITY): number =>
  pounds / density;

export const gallonsToLiters = (gallons: number): number => gallons * LITERS_PER_GALLON;

export const litersToGallons = (liters: number): number => liters / LITERS_PER_GALLON;

/** Fuel volume in the active unit system (US gallons or liters). */
export const poundsToVolume = (
  pounds: number,
  density: number,
  unitSystem: UnitSystem
): number => {
  const gallons = poundsToGallons(pounds, density);
  return unitSystem === 'metric' ? gallonsToLiters(gallons) : gallons;
};
