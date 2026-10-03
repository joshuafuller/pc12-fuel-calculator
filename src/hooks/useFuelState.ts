import { useState, useEffect, useRef, useCallback } from 'react';
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
    density: settings.defaultDensity,
    temperature: settings.defaultTemperature,
    unitSystem: 'imperial'
  };
}

export function useFuelState(settings: Settings) {
  const { defaultDensity, maxFuelLoad, persistSettings } = settings;
  const [state, setState] = useState<FuelState>(() => initialState(settings));

  // A new default density invalidates the temperature-adjusted density; the initial
  // render keeps whatever density was restored from storage.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setState(prev => ({
      ...prev,
      density: adjustDensityForTemperature(defaultDensity, prev.temperature, prev.unitSystem === 'metric')
    }));
  }, [defaultDensity]);

  // Lowering the maximum fuel load must not leave fuel above the new maximum.
  useEffect(() => {
    setState(prev =>
      prev.currentFuel > maxFuelLoad || prev.desiredFuel > maxFuelLoad
        ? {
            ...prev,
            currentFuel: clampFuel(prev.currentFuel, maxFuelLoad),
            desiredFuel: clampFuel(prev.desiredFuel, maxFuelLoad)
          }
        : prev
    );
  }, [maxFuelLoad]);

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

  return { ...state, setCurrentFuel, setDesiredFuel, setDensity, setTemperature, setUnitSystem };
}
