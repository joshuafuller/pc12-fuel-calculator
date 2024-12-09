import React from 'react';
import { poundsToGallons, gallonsToLiters } from '../../utils/constants';
import { UnitSystem } from '../../types/fuel';
import { fahrenheitToCelsius } from '../../utils/temperature';

interface FuelReceiptProps {
  currentFuel: number;
  desiredFuel: number;
  density: number;
  temperature: number;
  defaultTemperature: number;
  densityChanged: boolean;
  unitSystem: UnitSystem;
  isDark: boolean;
}

export function FuelReceipt({ 
  currentFuel = 0, 
  desiredFuel = 0, 
  density = 6.7, 
  densityChanged,
  unitSystem,
  isDark,
  temperature = 59,
  defaultTemperature = 59
}: FuelReceiptProps) {
  const fuelDifference = desiredFuel - currentFuel;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0.0';
    return num.toFixed(1);
  };
  
  const currentGallons = poundsToGallons(currentFuel, density);
  const desiredGallons = poundsToGallons(desiredFuel, density);
  const diffGallons = Math.abs(poundsToGallons(fuelDifference, density));

  const currentVolume = unitSystem === 'metric' ? gallonsToLiters(currentGallons) : currentGallons;
  const desiredVolume = unitSystem === 'metric' ? gallonsToLiters(desiredGallons) : desiredGallons;
  const diffVolume = unitSystem === 'metric' ? gallonsToLiters(diffGallons) : diffGallons;
  const volumeUnit = unitSystem === 'metric' ? 'L' : 'GAL';

  // Calculate per-wing values
  const diffPoundsPerWing = Math.abs(fuelDifference) / 2;
  const diffVolumePerWing = diffVolume / 2;

  // Temperature display
  const displayTemp = unitSystem === 'metric'
    ? `${formatNumber(fahrenheitToCelsius(temperature))}°C`
    : `${formatNumber(temperature)}°F`;
  const standardTemp = unitSystem === 'metric'
    ? `${formatNumber(fahrenheitToCelsius(defaultTemperature))}°C`
    : `${formatNumber(defaultTemperature)}°F`;
  const tempChanged = temperature !== defaultTemperature;

  return (
    <div className={`rounded-xl overflow-hidden border shadow-xl transition-colors duration-300 ${
      isDark 
        ? 'bg-black/40 backdrop-blur-md border-white/10 ring-1 ring-blue-500/20' 
        : 'bg-white/90 backdrop-blur-md border-black/5'
    }`}>
      <div className={`p-4 font-mono text-sm leading-tight ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="max-w-[400px] mx-auto">
          <table className="w-full border-separate border-spacing-0 whitespace-pre">
            <tbody>
              <tr><td colSpan={3} className="text-center pb-2">{'═'.repeat(38)}</td></tr>
              <tr><td colSpan={3} className="text-center font-bold">PC-12 FUEL CALCULATION RECEIPT</td></tr>
              <tr><td colSpan={3} className="text-center pb-1">{timestamp}</td></tr>
              <tr><td colSpan={3} className="text-center pb-2">{'═'.repeat(38)}</td></tr>
              
              {/* Conditions Section */}
              <tr><td colSpan={3}>CONDITIONS:</td></tr>
              <tr>
                <td>TEMP:</td>
                <td className="text-right">{displayTemp}</td>
                <td className="pl-2">{tempChanged ? `(!STD: ${standardTemp}!)` : ''}</td>
              </tr>
              <tr>
                <td>DENSITY:</td>
                <td className="text-right">{formatNumber(density)}</td>
                <td className="pl-2">LBS/GAL {densityChanged ? '(!NON-STD!)' : ''}</td>
              </tr>
              
              <tr><td colSpan={3} className="py-2">{'─'.repeat(38)}</td></tr>
              
              {/* Current Fuel Section */}
              <tr>
                <td>CURRENT:</td>
                <td className="text-right">{formatNumber(currentFuel)}</td>
                <td className="pl-2">LBS</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(currentVolume)}</td>
                <td className="pl-2">{volumeUnit}</td>
              </tr>
              
              {/* Desired Fuel Section */}
              <tr>
                <td>DESIRED:</td>
                <td className="text-right">{formatNumber(desiredFuel)}</td>
                <td className="pl-2">LBS</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(desiredVolume)}</td>
                <td className="pl-2">{volumeUnit}</td>
              </tr>
              
              <tr><td colSpan={3} className="py-2">{'─'.repeat(38)}</td></tr>
              
              {/* Calculation Section */}
              <tr><td colSpan={3}>CALCULATION:</td></tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(desiredFuel)}</td>
                <td className="pl-2">LBS (DESIRED)</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(-currentFuel)}</td>
                <td className="pl-2">LBS (CURRENT)</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(Math.abs(fuelDifference))}</td>
                <td className="pl-2">LBS DIFFERENCE</td>
              </tr>
              
              <tr><td colSpan={3} className="py-2">{'═'.repeat(38)}</td></tr>
              
              {/* Required Action Section */}
              <tr><td colSpan={3} className="font-bold">REQUIRED ACTION:</td></tr>
              <tr>
                <td>{fuelDifference > 0 ? 'ADD' : 'REMOVE'}</td>
                <td className="text-right">{formatNumber(Math.abs(fuelDifference))}</td>
                <td className="pl-2">LBS TOTAL</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(diffVolume)}</td>
                <td className="pl-2">{volumeUnit} TOTAL</td>
              </tr>

              {/* Per Wing Section */}
              <tr><td colSpan={3} className="py-2">{'─'.repeat(38)}</td></tr>
              <tr><td colSpan={3} className="font-bold">PER WING:</td></tr>
              <tr>
                <td>{fuelDifference > 0 ? 'ADD' : 'REMOVE'}</td>
                <td className="text-right">{formatNumber(diffPoundsPerWing)}</td>
                <td className="pl-2">LBS/WING</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(diffVolumePerWing)}</td>
                <td className="pl-2">{volumeUnit}/WING</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}