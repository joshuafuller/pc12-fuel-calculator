import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import { FuelState } from '../types/fuel';

const STORAGE_KEY = 'pc12-fuel-calculator';
const SETTINGS_KEY = 'pc12-fuel-calculator-settings';

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.warn('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveFuelState(state: FuelState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save fuel state:', e);
  }
}

export function loadFuelState(): FuelState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.warn('Failed to load fuel state:', e);
    return null;
  }
}

export function clearFuelState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear fuel state:', e);
  }
}