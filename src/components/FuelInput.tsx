import React from 'react';
import { AlertCircle } from 'lucide-react';
import { poundsToGallons, gallonsToLiters, MAX_FUEL_POUNDS, UnitSystem } from '../utils/constants';

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
  onBlur
}: FuelInputProps) {
  const isNearMax = value > MAX_FUEL_POUNDS * 0.9;
  const isOverMax = value > MAX_FUEL_POUNDS;
  const gallons = poundsToGallons(value, density);
  const volume = unitSystem === 'metric' ? gallonsToLiters(gallons) : gallons;
  const unit = unitSystem === 'metric' ? 'L' : 'gal';

  return (
    <div className="w-full">
      <label className={`block text-xs font-medium mb-1 ${
        isDark ? 'text-white' : 'text-gray-700'
      }`}>
        {label}
        <span className={`text-xs ml-1 ${
          isDark ? 'text-white/60' : 'text-gray-500'
        }`}>
          (Max: {MAX_FUEL_POUNDS})
        </span>
      </label>
      <div className="relative">
        {isFocused && (
          <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 to-purple-500 
                       opacity-50 blur-sm rounded-lg animate-pulse -z-10" />
        )}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full px-2 py-1.5 border rounded text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-16 
                   transition-all duration-300 ${
                     isDark 
                       ? 'bg-black/30 text-white placeholder-white/50' 
                       : 'bg-white/30 text-gray-900 placeholder-gray-500'
                   } ${
                     isOverMax 
                       ? 'border-red-500' 
                       : isNearMax 
                         ? 'border-yellow-500' 
                         : isDark 
                           ? 'border-white/30' 
                           : 'border-black/30'
                   }`}
          placeholder="Enter fuel in pounds"
          min="0"
          max={MAX_FUEL_POUNDS}
          step="10"
        />
        <div className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${
          isDark ? 'text-white/60' : 'text-gray-500'
        }`}>
          {volume.toFixed(1)} {unit}
        </div>
        {isOverMax && (
          <div className="absolute -bottom-4 left-0 flex items-center text-red-400 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Exceeds max
          </div>
        )}
      </div>
    </div>
  );
}