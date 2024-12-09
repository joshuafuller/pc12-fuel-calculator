import { useState, useEffect } from 'react';
import { FuelState } from '../types/fuel';
import { Settings } from '../types/settings';
import { saveFuelState, loadFuelState } from '../utils/storage';
import { adjustDensityForTemperature, fahrenheitToCelsius, celsiusToFahrenheit } from '../utils/temperature';

export function useFuelState(settings: Settings) {
  const [state, setState] = useState<FuelState>({
    currentFuel: 0,
    desiredFuel: 0,
    density: settings.defaultDensity,
    temperature: settings.defaultTemperature,
    unitSystem: 'imperial'
  });

  // Load saved state on mount
  useEffect(() => {
    if (settings.persistSettings) {
      const savedState = loadFuelState();
      if (savedState) {
        setState(savedState);
      }
    }
  }, [settings.persistSettings]);

  // Update density when temperature changes
  useEffect(() => {
    const adjustedDensity = adjustDensityForTemperature(
      settings.defaultDensity,
      state.temperature,
      state.unitSystem === 'metric'
    );
    setState(prev => ({ ...prev, density: adjustedDensity }));
  }, [state.temperature, state.unitSystem, settings.defaultDensity]);

  // Save state when it changes
  useEffect(() => {
    if (settings.persistSettings) {
      saveFuelState(state);
    }
  }, [state, settings.persistSettings]);

  // Handle unit system changes for temperature
  const handleUnitSystemChange = (unitSystem: FuelState['unitSystem']) => {
    setState(prev => {
      const newTemp = unitSystem === 'metric' 
        ? Math.round(fahrenheitToCelsius(prev.temperature))
        : Math.round(celsiusToFahrenheit(prev.temperature));
      
      // Recalculate density for new unit system
      const newDensity = adjustDensityForTemperature(
        settings.defaultDensity,
        newTemp,
        unitSystem === 'metric'
      );

      return { 
        ...prev, 
        unitSystem, 
        temperature: newTemp,
        density: newDensity
      };
    });
  };

  return {
    ...state,
    setState,
    setCurrentFuel: (currentFuel: number) => 
      setState(prev => ({ ...prev, currentFuel: Math.min(currentFuel, settings.maxFuelLoad) })),
    setDesiredFuel: (desiredFuel: number) => 
      setState(prev => ({ ...prev, desiredFuel: Math.min(desiredFuel, settings.maxFuelLoad) })),
    setDensity: (density: number) => setState(prev => ({ ...prev, density })),
    setTemperature: (temperature: number) => {
      const adjustedDensity = adjustDensityForTemperature(
        settings.defaultDensity,
        temperature,
        state.unitSystem === 'metric'
      );
      setState(prev => ({ 
        ...prev, 
        temperature,
        density: adjustedDensity
      }));
    },
    setUnitSystem: handleUnitSystemChange
  };
}