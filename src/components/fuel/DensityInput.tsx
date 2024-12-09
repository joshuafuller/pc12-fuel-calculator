import React from 'react';
import { Thermometer, Droplet } from 'lucide-react';
import { adjustDensityForTemperature, fahrenheitToCelsius } from '../../utils/temperature';
import { UnitSystem } from '../../types/fuel';
import { StandardInput } from '../ui/StandardInput';

interface DensityInputProps {
  value: number;
  temperature: number;
  onChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  isDark: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  defaultDensity: number;
  defaultTemperature: number;
  unitSystem: UnitSystem;
}

export function DensityInput({ 
  value, 
  temperature,
  onChange, 
  onTemperatureChange,
  isDark, 
  isFocused,
  onFocus,
  onBlur,
  defaultDensity,
  defaultTemperature,
  unitSystem
}: DensityInputProps) {
  // Calculate adjusted density based on current temperature
  const adjustedDefaultDensity = adjustDensityForTemperature(
    defaultDensity,
    temperature,
    unitSystem === 'metric'
  );

  const tempLimits = unitSystem === 'metric' 
    ? { min: -60, max: 60 }   // °C
    : { min: -76, max: 140 }; // °F

  const standardTemp = unitSystem === 'metric'
    ? Math.round(fahrenheitToCelsius(defaultTemperature))
    : defaultTemperature;

  const isNonStandard = value !== adjustedDefaultDensity || temperature !== defaultTemperature;

  const handleReset = () => {
    onChange(defaultDensity);
    onTemperatureChange(defaultTemperature);
  };

  return (
    <div className="flex items-start gap-6">
      <div className="flex items-start gap-6">
        <StandardInput
          label="Fuel Density"
          value={value}
          onChange={onChange}
          isDark={isDark}
          isFocused={isFocused}
          onFocus={onFocus}
          onBlur={onBlur}
          min={5}
          max={8}
          step="0.1"
          icon={<Droplet className="w-3 h-3" />}
          unit="lbs/gal"
          standardValue={adjustedDefaultDensity}
          width="w-40"
          showResetButton={false}
          allowEmpty={false}
        />

        <StandardInput
          label="Temperature"
          value={temperature}
          onChange={onTemperatureChange}
          isDark={isDark}
          isFocused={isFocused}
          onFocus={onFocus}
          onBlur={onBlur}
          min={tempLimits.min}
          max={tempLimits.max}
          step="1"
          icon={<Thermometer className="w-3 h-3" />}
          unit={unitSystem === 'metric' ? '°C' : '°F'}
          standardValue={standardTemp}
          width="w-40"
          showResetButton={false}
          allowEmpty={false}
        />
      </div>

      {isNonStandard && (
        <div className="flex items-center gap-2 mt-6">
          <span className="text-yellow-500 text-xs whitespace-nowrap">
            Non-std
          </span>
          <button
            onClick={handleReset}
            className={`flex items-center transition-colors ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            }`}
            title="Reset to standard values"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}