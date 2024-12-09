import React from 'react';
import { poundsToGallons, gallonsToLiters, MAX_FUEL_POUNDS, UnitSystem } from '../utils/constants';

interface FuelMeterProps {
  currentFuel: number;
  desiredFuel: number;
  unitSystem: UnitSystem;
  isDark: boolean;
}

export function FuelMeter({ currentFuel, desiredFuel, unitSystem, isDark }: FuelMeterProps) {
  const currentHeight = (currentFuel / MAX_FUEL_POUNDS) * 100;
  const desiredHeight = (desiredFuel / MAX_FUEL_POUNDS) * 100;
  
  // Generate scale markers with major and minor ticks
  const scaleMarkers = [];
  
  if (unitSystem === 'imperial') {
    // Imperial scale: Minor ticks at 100 lbs, major at 500 lbs
    for (let value = 0; value <= MAX_FUEL_POUNDS; value += 100) {
      const isMajor = value % 500 === 0 || value === 0 || value === MAX_FUEL_POUNDS;
      scaleMarkers.push({
        value,
        position: (value / MAX_FUEL_POUNDS) * 100,
        isMajor,
        displayValue: isMajor ? value.toString() : ''
      });
    }
  } else {
    // Metric scale: Minor ticks at 100L, major at 500L
    const maxLiters = gallonsToLiters(poundsToGallons(MAX_FUEL_POUNDS));
    for (let liters = 0; liters <= maxLiters; liters += 100) {
      const isMajor = liters % 500 === 0 || liters === 0 || liters >= maxLiters;
      const gallons = liters / 3.78541;
      const pounds = gallons * 6.7;
      scaleMarkers.push({
        value: pounds,
        position: (pounds / MAX_FUEL_POUNDS) * 100,
        isMajor,
        displayValue: isMajor ? Math.round(liters).toString() : ''
      });
    }
  }
  
  return (
    <div className="relative group h-full">
      <div className={`w-full h-full rounded-lg relative overflow-hidden border transition-colors duration-300 ${
        isDark 
          ? 'bg-black/40 backdrop-blur-md border-white/10 ring-1 ring-blue-500/20'
          : 'bg-white/90 backdrop-blur-md border-black/5'
      }`}>
        {/* Scale markers */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {scaleMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 flex items-center justify-between"
              style={{ bottom: `${marker.position}%` }}
            >
              {/* Left tick marks */}
              <div 
                className={`${
                  marker.isMajor 
                    ? 'w-6 h-[2px] bg-white/80' 
                    : 'w-3 h-[1px] bg-white/30'
                }`} 
              />
              
              {/* Right tick marks and numbers */}
              <div className="flex items-center">
                {marker.displayValue && (
                  <div className="mr-1 text-[10px] font-medium text-white/90 select-none whitespace-nowrap">
                    {marker.displayValue}
                    <span className="text-[8px] ml-0.5 text-white/70">
                      {unitSystem === 'imperial' ? 'lbs' : 'L'}
                    </span>
                  </div>
                )}
                <div 
                  className={`${
                    marker.isMajor 
                      ? 'w-6 h-[2px] bg-white/80' 
                      : 'w-3 h-[1px] bg-white/30'
                  }`} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Liquid container */}
        <div className="absolute inset-0">
          {/* Desired fuel level indicator */}
          {desiredFuel > currentFuel && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                       transition-all duration-700 ease-out"
              style={{ height: `${desiredHeight}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
            </div>
          )}

          {/* Current fuel level */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 
                     transition-all duration-700 ease-out"
            style={{ height: `${currentHeight}%` }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            
            {/* Liquid surface effect */}
            <div className="absolute inset-x-0 top-0">
              <div className="h-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                <div className="absolute inset-0 animate-wave-slow opacity-70">
                  <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
                <div className="absolute inset-0 animate-wave-fast opacity-50 delay-150">
                  <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level indicators */}
        <div className="absolute inset-y-0 -right-1">
          {/* Current level marker */}
          <div 
            className="absolute right-0 transition-all duration-700 ease-out flex items-center"
            style={{ bottom: `${currentHeight}%`, transform: 'translateY(50%)' }}
          >
            <div className="text-[11px] font-medium text-white mr-1 whitespace-nowrap">
              {unitSystem === 'imperial' 
                ? `${currentFuel.toFixed(0)} lbs`
                : `${gallonsToLiters(poundsToGallons(currentFuel)).toFixed(0)} L`}
            </div>
            <div className="w-3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 
                         shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>

          {/* Desired level marker */}
          {desiredFuel !== currentFuel && (
            <div 
              className="absolute right-0 transition-all duration-700 ease-out flex items-center"
              style={{ bottom: `${desiredHeight}%`, transform: 'translateY(50%)' }}
            >
              <div className="text-[11px] font-medium text-yellow-300 mr-1 whitespace-nowrap">
                {unitSystem === 'imperial'
                  ? `${desiredFuel.toFixed(0)} lbs`
                  : `${gallonsToLiters(poundsToGallons(desiredFuel)).toFixed(0)} L`}
              </div>
              <div className="w-3 h-1 bg-gradient-to-r from-yellow-300 to-amber-400
                         shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}