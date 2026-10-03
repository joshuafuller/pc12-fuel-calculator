import {
  loadSettings,
  saveSettings,
  loadFuelState,
  saveFuelState,
  clearFuelState,
  loadTheme,
  saveTheme
} from './storage';
import { DEFAULT_SETTINGS } from '../types/settings';

describe('settings storage', () => {
  it('defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips settings', () => {
    const custom = { ...DEFAULT_SETTINGS, maxFuelLoad: 2500, persistSettings: false };
    saveSettings(custom);
    expect(loadSettings()).toEqual(custom);
  });

  it('ignores corrupt or wrongly-typed values', () => {
    localStorage.setItem('pc12-fuel-calculator-settings', '{not json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);

    localStorage.setItem(
      'pc12-fuel-calculator-settings',
      JSON.stringify({ maxFuelLoad: 'lots', defaultDensity: -3, persistSettings: 'yes', defaultPresetLoad: 1800 })
    );
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, defaultPresetLoad: 1800 });
  });
});

describe('fuel state storage', () => {
  const state = { currentFuel: 100, desiredFuel: 900, density: 6.6, temperature: 20, unitSystem: 'metric' as const };

  it('round-trips and clears', () => {
    expect(loadFuelState()).toBeNull();
    saveFuelState(state);
    expect(loadFuelState()).toEqual(state);
    clearFuelState();
    expect(loadFuelState()).toBeNull();
  });

  it('rejects malformed state', () => {
    localStorage.setItem('pc12-fuel-calculator', JSON.stringify({ ...state, unitSystem: 'furlongs' }));
    expect(loadFuelState()).toBeNull();
    localStorage.setItem('pc12-fuel-calculator', JSON.stringify({ ...state, density: 0 }));
    expect(loadFuelState()).toBeNull();
    localStorage.setItem('pc12-fuel-calculator', 'null');
    expect(loadFuelState()).toBeNull();
  });

  it('never loads negative fuel', () => {
    localStorage.setItem('pc12-fuel-calculator', JSON.stringify({ ...state, currentFuel: -50 }));
    expect(loadFuelState()?.currentFuel).toBe(0);
  });
});

describe('theme storage', () => {
  it('defaults to dark and remembers light', () => {
    expect(loadTheme()).toBe(true);
    saveTheme(false);
    expect(loadTheme()).toBe(false);
    saveTheme(true);
    expect(loadTheme()).toBe(true);
  });
});
