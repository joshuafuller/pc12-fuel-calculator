import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import { FuelState } from '../types/fuel';

const STORAGE_KEY = 'pc12-fuel-calculator';
const SETTINGS_KEY = 'pc12-fuel-calculator-settings';
const THEME_KEY = 'pc12-fuel-calculator-theme';

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function read(key: string): unknown {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? null : JSON.parse(stored);
  } catch (e) {
    console.warn(`Failed to read "${key}" from storage:`, e);
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write "${key}" to storage:`, e);
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to remove "${key}" from storage:`, e);
  }
}

/** Keep only well-typed settings fields so corrupt storage can't break the app. */
function sanitizeSettings(raw: unknown): Settings {
  const merged: Settings = { ...DEFAULT_SETTINGS };
  if (typeof raw !== 'object' || raw === null) return merged;
  const input = raw as Record<string, unknown>;

  for (const key of ['maxFuelLoad', 'defaultDensity', 'defaultPresetLoad', 'defaultTemperature'] as const) {
    const value = input[key];
    if (isFiniteNumber(value)) merged[key] = value;
  }
  if (merged.maxFuelLoad <= 0) merged.maxFuelLoad = DEFAULT_SETTINGS.maxFuelLoad;
  if (merged.defaultDensity <= 0) merged.defaultDensity = DEFAULT_SETTINGS.defaultDensity;
  if (typeof input.persistSettings === 'boolean') merged.persistSettings = input.persistSettings;
  return merged;
}

function parseFuelState(raw: unknown): FuelState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const s = raw as Record<string, unknown>;
  if (
    !isFiniteNumber(s.currentFuel) ||
    !isFiniteNumber(s.desiredFuel) ||
    !isFiniteNumber(s.density) ||
    s.density <= 0 ||
    !isFiniteNumber(s.temperature) ||
    (s.unitSystem !== 'imperial' && s.unitSystem !== 'metric')
  ) {
    return null;
  }
  return {
    currentFuel: Math.max(0, s.currentFuel),
    desiredFuel: Math.max(0, s.desiredFuel),
    density: s.density,
    temperature: s.temperature,
    unitSystem: s.unitSystem
  };
}

export const saveSettings = (settings: Settings): void => write(SETTINGS_KEY, settings);
export const loadSettings = (): Settings => sanitizeSettings(read(SETTINGS_KEY));

export const saveFuelState = (state: FuelState): void => write(STORAGE_KEY, state);
export const loadFuelState = (): FuelState | null => parseFuelState(read(STORAGE_KEY));
export const clearFuelState = (): void => remove(STORAGE_KEY);

export const saveTheme = (isDark: boolean): void => write(THEME_KEY, isDark ? 'dark' : 'light');
export const loadTheme = (): boolean => read(THEME_KEY) !== 'light';
