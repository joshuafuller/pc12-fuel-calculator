import React from 'react';
import { FuelInput } from './FuelInput';
import { PresetButton } from '../ui/PresetButton';
import { UnitSystem } from '../../types/fuel';

interface FuelInputGroupProps {
  currentFuel: number;
  desiredFuel: number;
  density: number;
  unitSystem: UnitSystem;
  isDark: boolean;
  currentFocused: boolean;
  desiredFocused: boolean;
  onCurrentFuelChange: (value: number) => void;
  onDesiredFuelChange: (value: number) => void;
  onCurrentFocus: () => void;
  onCurrentBlur: () => void;
  onDesiredFocus: () => void;
  onDesiredBlur: () => void;
  maxFuelLoad: number;
  defaultPresetLoad: number;
}

export function FuelInputGroup({
  currentFuel,
  desiredFuel,
  density,
  unitSystem,
  isDark,
  currentFocused,
  desiredFocused,
  onCurrentFuelChange,
  onDesiredFuelChange,
  onCurrentFocus,
  onCurrentBlur,
  onDesiredFocus,
  onDesiredBlur,
  maxFuelLoad,
  defaultPresetLoad
}: FuelInputGroupProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <FuelInput
        label="Current Fuel Load"
        value={currentFuel}
        onChange={onCurrentFuelChange}
        density={density}
        unitSystem={unitSystem}
        isDark={isDark}
        isFocused={currentFocused}
        onFocus={onCurrentFocus}
        onBlur={onCurrentBlur}
        maxFuelLoad={maxFuelLoad}
      />
      
      <div className="flex items-start gap-2">
        <FuelInput
          label="Desired Fuel Load"
          value={desiredFuel}
          onChange={onDesiredFuelChange}
          density={density}
          unitSystem={unitSystem}
          isDark={isDark}
          isFocused={desiredFocused}
          onFocus={onDesiredFocus}
          onBlur={onDesiredBlur}
          maxFuelLoad={maxFuelLoad}
        />
        <div className="mt-5">
          <PresetButton 
            onClick={() => onDesiredFuelChange(defaultPresetLoad)} 
            isDark={isDark}
            presetValue={defaultPresetLoad}
          />
        </div>
      </div>
    </div>
  );
}