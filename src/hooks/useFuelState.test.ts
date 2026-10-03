import { renderHook, act } from '@testing-library/react';
import { useFuelState } from './useFuelState';
import { DEFAULT_SETTINGS, Settings } from '../types/settings';
import { saveFuelState } from '../utils/storage';

const settings: Settings = { ...DEFAULT_SETTINGS };

describe('useFuelState', () => {
  it('starts empty at the default density and temperature', () => {
    const { result } = renderHook(() => useFuelState(settings));
    expect(result.current).toMatchObject({
      currentFuel: 0,
      desiredFuel: 0,
      density: 6.7,
      temperature: 59,
      unitSystem: 'imperial'
    });
  });

  it('adjusts the initial density for a non-standard default temperature', () => {
    const { result } = renderHook(() => useFuelState({ ...settings, defaultTemperature: 100 }));
    expect(result.current.temperature).toBe(100);
    expect(result.current.density).toBeCloseTo(6.7 - 41 * 0.0035, 3);
  });

  it('clamps fuel to [0, max]', () => {
    const { result } = renderHook(() => useFuelState(settings));
    act(() => result.current.setCurrentFuel(99999));
    act(() => result.current.setDesiredFuel(-10));
    expect(result.current.currentFuel).toBe(settings.maxFuelLoad);
    expect(result.current.desiredFuel).toBe(0);
  });

  it('adjusts density when the temperature changes', () => {
    const { result } = renderHook(() => useFuelState(settings));
    act(() => result.current.setTemperature(100));
    expect(result.current.density).toBeLessThan(6.7);
  });

  it('converts the temperature when switching unit systems and back', () => {
    const { result } = renderHook(() => useFuelState(settings));
    act(() => result.current.setUnitSystem('metric'));
    expect(result.current.temperature).toBe(15);
    expect(result.current.density).toBe(6.7);
    act(() => result.current.setUnitSystem('imperial'));
    expect(result.current.temperature).toBe(59);
  });

  it('restores saved state, including a manually overridden density', () => {
    saveFuelState({ currentFuel: 300, desiredFuel: 1200, density: 6.55, temperature: 59, unitSystem: 'imperial' });
    const { result } = renderHook(() => useFuelState(settings));
    expect(result.current.currentFuel).toBe(300);
    expect(result.current.density).toBe(6.55);
  });

  it('does not restore state when persistence is off', () => {
    saveFuelState({ currentFuel: 300, desiredFuel: 1200, density: 6.7, temperature: 59, unitSystem: 'imperial' });
    const { result } = renderHook(() => useFuelState({ ...settings, persistSettings: false }));
    expect(result.current.currentFuel).toBe(0);
  });

  it('caps displayed fuel at a lowered maximum without losing the stored amount', () => {
    const { result, rerender } = renderHook(({ s }) => useFuelState(s), { initialProps: { s: settings } });
    act(() => result.current.setCurrentFuel(2000));

    // Retyping the maximum passes through smaller intermediate values.
    rerender({ s: { ...settings, maxFuelLoad: 270 } });
    expect(result.current.currentFuel).toBe(270);

    rerender({ s: { ...settings, maxFuelLoad: 2500 } });
    expect(result.current.currentFuel).toBe(2000);
  });
});
