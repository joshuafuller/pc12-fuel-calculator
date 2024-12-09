import React from 'react';
import { poundsToGallons, gallonsToLiters } from '../../utils/constants';
import { UnitSystem } from '../../types/fuel';

interface FuelMeterProps {
  currentFuel: number;
  desiredFuel: number;
  unitSystem: UnitSystem;
  isDark: boolean;
  maxFuelLoad: number;
}

export function FuelMeter({ currentFuel, desiredFuel, unitSystem, isDark, maxFuelLoad }: FuelMeterProps) {
  // Calculate heights as exact percentages
  const currentHeight = (currentFuel / maxFuelLoad) * 100;
  const desiredHeight = (desiredFuel / maxFuelLoad) * 100;
  
  // Generate scale markers
  const scaleMarkers = [];
  if (unitSystem === 'imperial') {
    // Minor ticks at 100 lbs, major at 500 lbs
    for (let value = 0; value <= maxFuelLoad; value += 100) {
      const isMajor = value % 500 === 0 || value === 0 || value === maxFuelLoad;
      scaleMarkers.push({
        value,
        position: (value / maxFuelLoad) * 100,
        isMajor,
        displayValue: isMajor ? value.toString() : ''
      });
    }
  } else {
    // Convert max fuel to liters for metric scale
    const maxLiters = gallonsToLiters(poundsToGallons(maxFuelLoad));
    // Minor ticks at 100L, major at 500L
    for (let liters = 0; liters <= maxLiters; liters += 100) {
      const isMajor = liters % 500 === 0 || liters === 0 || liters >= maxLiters;
      const gallons = liters / 3.78541;
      const pounds = gallons * 6.7;
      scaleMarkers.push({
        value: pounds,
        position: (pounds / maxFuelLoad) * 100,
        isMajor,
        displayValue: isMajor ? Math.round(liters).toString() : ''
      });
    }
  }

  // Helper function to determine if a marker should be shifted down
  const shouldShiftDown = (height: number) => height > 95;
  
  return (
    <div className="relative group h-full">
      <div className={`w-full h-full rounded-lg relative overflow-hidden border transition-colors duration-300 ${
        isDark 
          ? 'bg-black/40 backdrop-blur-md border-white/10 ring-1 ring-blue-500/20'
          : 'bg-gray-900/90 backdrop-blur-md border-black/20 ring-1 ring-blue-500/30'
      }`}>
        {/* Scale markers */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {scaleMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 flex items-center justify-between"
              style={{ bottom: `calc(${marker.position}% - 1px)` }}
            >
              <div 
                className={`${
                  marker.isMajor 
                    ? 'w-6 h-[2px] bg-white/80' 
                    : 'w-3 h-[1px] bg-white/30'
                }`} 
              />
              
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
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            </div>
          )}

          {/* Current fuel level */}
          <div 
            className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
            style={{ height: `${currentHeight}%` }}
          >
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-90" />
            
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

            {/* Animated bubbles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/30 animate-bubble"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${4 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Level indicators */}
        <div className="absolute inset-y-0 -right-1 z-10">
          {/* Current level marker */}
          <div 
            className="absolute right-0 transition-all duration-700 ease-out flex items-center"
            style={{ 
              bottom: `calc(${currentHeight}% - 1px)`,
              transform: shouldShiftDown(currentHeight) ? 'translateY(100%)' : 'none'
            }}
          >
            <div className="text-[11px] font-medium whitespace-nowrap
                         text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
                         bg-black/20 px-1 py-0.5 rounded backdrop-blur-sm">
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
              style={{ 
                bottom: `calc(${desiredHeight}% - 1px)`,
                transform: shouldShiftDown(desiredHeight) ? 'translateY(100%)' : 'none'
              }}
            >
              <div className="text-[11px] font-medium whitespace-nowrap
                           text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
                           bg-black/20 px-1 py-0.5 rounded backdrop-blur-sm">
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