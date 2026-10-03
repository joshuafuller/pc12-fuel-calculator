import { LITERS_PER_GALLON } from './constants';
import type { UnitSystem } from '../types/fuel';

export interface ScaleMarker {
  /** Position along the meter, 0–100 (% of max fuel). */
  position: number;
  isMajor: boolean;
  /** Label for major ticks, in the active unit; empty for minor ticks. */
  label: string;
}

const MINOR_STEP = 100;
const MAJOR_STEP = 500;

/**
 * Tick marks for the fuel meter. Ticks are every 100 lbs (imperial) or 100 L (metric),
 * with labelled major ticks every 500. In metric, `density` (lbs/gal) converts litres to
 * pounds so tick positions match the litre values shown elsewhere in the UI.
 */
export function buildScaleMarkers(
  maxFuelLoad: number,
  unitSystem: UnitSystem,
  density: number
): ScaleMarker[] {
  if (!(maxFuelLoad > 0) || !(density > 0)) return [];

  const toPounds = (value: number) =>
    unitSystem === 'metric' ? (value / LITERS_PER_GALLON) * density : value;
  const maxInUnit =
    unitSystem === 'metric' ? (maxFuelLoad / density) * LITERS_PER_GALLON : maxFuelLoad;

  const markers: ScaleMarker[] = [];
  for (let value = 0; value <= maxInUnit; value += MINOR_STEP) {
    const isMajor = value % MAJOR_STEP === 0 || value === 0;
    markers.push({
      position: (toPounds(value) / maxFuelLoad) * 100,
      isMajor,
      label: isMajor ? String(value) : ''
    });
  }
  return markers;
}

/** Fill height as a percentage of the meter, clamped to 0–100. */
export function fillPercent(fuel: number, maxFuelLoad: number): number {
  if (!(maxFuelLoad > 0)) return 0;
  return Math.min(100, Math.max(0, (fuel / maxFuelLoad) * 100));
}
