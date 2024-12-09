import React from 'react';
import { Fuel } from 'lucide-react';
import { poundsToGallons, gallonsToLiters } from '../../utils/constants';
import { UnitSystem } from '../../types/fuel';
import { StandardInput } from '../ui/StandardInput';

interface FuelInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  density: number;
  unitSystem: UnitSystem;
  isDark: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  maxFuelLoad: number;
}

export function FuelInput({ 
  label, 
  value, 
  onChange, 
  density, 
  unitSystem,
  isDark,
  isFocused,
  onFocus,
  onBlur,
  maxFuelLoad
}: FuelInputProps) {
  const gallons = poundsToGallons(value, density);
  const volume = unitSystem === 'metric' ? gallonsToLiters(gallons) : gallons;
  const unit = unitSystem === 'metric' ? 'L' : 'gal';

  return (
    <div className="w-full">
      <StandardInput
        label={label}
        value={value}
        onChange={onChange}
        isDark={isDark}
        isFocused={isFocused}
        onFocus={onFocus}
        onBlur={onBlur}
        min={0}
        max={maxFuelLoad}
        step="10"
        icon={<Fuel className="w-3 h-3" />}
        unit={`lbs (${volume.toFixed(1)} ${unit})`}
        width="w-56"
        warningThreshold={maxFuelLoad * 0.9}
        allowEmpty={false}
      />
    </div>
  );
}