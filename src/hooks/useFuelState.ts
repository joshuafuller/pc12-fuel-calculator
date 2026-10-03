import { useState, useEffect, useCallback } from 'react';
import { FuelState, UnitSystem } from '../types/fuel';
import { Settings } from '../types/settings';
import { saveFuelState, loadFuelState } from '../utils/storage';
import {
  adjustDensityForTemperature,
  fahrenheitToCelsius,
  celsiusToFahrenheit
} from '../utils/temperature';

const clampFuel = (value: number, max: number) => Math.min(Math.max(0, value), max);

function initialState(settings: Settings): FuelState {
  if (settings.persistSettings) {
    const saved = loadFuelState();
    if (saved) {
      return {
        ...saved,
        currentFuel: clampFuel(saved.currentFuel, settings.maxFuelLoad),
        desiredFuel: clampFuel(saved.desiredFuel, settings.maxFuelLoad)
      };
    }
  }
  return {
    currentFuel: 0,
    desiredFuel: 0,
    // defaultTemperature is stored in °F, and the initial unit system is imperial
    density: adjustDensityForTemperature(settings.defaultDensity, settings.defaultTemperature, false),
    temperature: settings.defaultTemperature,
    unitSystem: 'imperial'
  };
}

export function useFuelState(settings: Settings) {
  const { defaultDensity, maxFuelLoad, persistSettings } = settings;
  const [state, setState] = useState<FuelState>(() => initialState(settings));

  // A new default density invalidates the temperature-adjusted density. Adjusting state
  // during render (React's pattern for deriving state from props) avoids painting one
  // stale frame, which an effect would.
  const [prevDefaultDensity, setPrevDefaultDensity] = useState(defaultDensity);
  if (prevDefaultDensity !== defaultDensity) {
    setPrevDefaultDensity(defaultDensity);
    setState(prev => ({
      ...prev,
      density: adjustDensityForTemperature(defaultDensity, prev.temperature, prev.unitSystem === 'metric')
    }));
  }

  useEffect(() => {
    if (persistSettings) saveFuelState(state);
  }, [state, persistSettings]);

  const setCurrentFuel = useCallback(
    (currentFuel: number) => setState(prev => ({ ...prev, currentFuel: clampFuel(currentFuel, maxFuelLoad) })),
    [maxFuelLoad]
  );

  const setDesiredFuel = useCallback(
    (desiredFuel: number) => setState(prev => ({ ...prev, desiredFuel: clampFuel(desiredFuel, maxFuelLoad) })),
    [maxFuelLoad]
  );

  const setDensity = useCallback((density: number) => setState(prev => ({ ...prev, density })), []);

  const setTemperature = useCallback(
    (temperature: number) =>
      setState(prev => ({
        ...prev,
        temperature,
        density: adjustDensityForTemperature(defaultDensity, temperature, prev.unitSystem === 'metric')
      })),
    [defaultDensity]
  );

  const setUnitSystem = useCallback(
    (unitSystem: UnitSystem) =>
      setState(prev => {
        if (prev.unitSystem === unitSystem) return prev;
        const temperature =
          unitSystem === 'metric'
            ? Math.round(fahrenheitToCelsius(prev.temperature))
            : Math.round(celsiusToFahrenheit(prev.temperature));
        return {
          ...prev,
          unitSystem,
          temperature,
          density: adjustDensityForTemperature(defaultDensity, temperature, unitSystem === 'metric')
        };
      }),
    [defaultDensity]
  );

  // Stored fuel is never rewritten when the maximum changes: while the max is being edited
  // it passes through smaller values (2704 -> 270 -> 1500), and clamping the stored amount
  // would lose it for good. Only what is returned is capped.
  return {
    ...state,
    currentFuel: Math.min(state.currentFuel, maxFuelLoad),
    desiredFuel: Math.min(state.desiredFuel, maxFuelLoad),
    setCurrentFuel,     setDesiredFuel,
    setDensity,
    setTemperature,
    setUnitSystem
  };
}
