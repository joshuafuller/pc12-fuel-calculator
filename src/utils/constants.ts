export const DEFAULT_FUEL_DENSITY = 6.7; // Default lbs per gallon
export const MAX_FUEL_POUNDS = 2704; // Maximum fuel capacity in pounds
export const MAX_FUEL_GALLONS = 402; // Maximum fuel capacity in gallons
export const LITERS_PER_GALLON = 3.78541; // Conversion factor for gallons to liters

export const poundsToGallons = (pounds: number, density: number = DEFAULT_FUEL_DENSITY): number => {
  return pounds / density;
};

export const gallonsToPounds = (gallons: number, density: number = DEFAULT_FUEL_DENSITY): number => {
  return gallons * density;
};

export const gallonsToLiters = (gallons: number): number => {
  return gallons * LITERS_PER_GALLON;
};

export type UnitSystem = 'imperial' | 'metric';