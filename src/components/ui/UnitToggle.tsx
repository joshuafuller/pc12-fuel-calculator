import React from 'react';
import { Scale } from 'lucide-react';
import { UnitSystem } from '../../types/fuel';

interface UnitToggleProps {
  unitSystem: UnitSystem;
  onChange: (system: UnitSystem) => void;
  isDark: boolean;
}

export function UnitToggle({ unitSystem, onChange, isDark }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Scale className={`w-3 h-3 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
      <div className={`rounded p-0.5 flex ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
        <button
          onClick={() => onChange('imperial')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            unitSystem === 'imperial'
              ? isDark ? 'bg-white text-blue-900' : 'bg-blue-500 text-white'
              : isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Imperial
        </button>
        <button
          onClick={() => onChange('metric')}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            unitSystem === 'metric'
              ? isDark ? 'bg-white text-blue-900' : 'bg-blue-500 text-white'
              : isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Metric
        </button>
      </div>
    </div>
  );
}