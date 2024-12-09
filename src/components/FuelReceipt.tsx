import React from 'react';
import { poundsToGallons, gallonsToLiters, UnitSystem } from '../utils/constants';

interface FuelReceiptProps {
  currentFuel: number;
  desiredFuel: number;
  density: number;
  densityChanged: boolean;
  unitSystem: UnitSystem;
}

export function FuelReceipt({ 
  currentFuel, 
  desiredFuel, 
  density, 
  densityChanged,
  unitSystem 
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

  const formatNumber = (num: number) => num.toFixed(1);
  
  const currentGallons = poundsToGallons(currentFuel, density);
  const desiredGallons = poundsToGallons(desiredFuel, density);
  const diffGallons = Math.abs(poundsToGallons(fuelDifference, density));

  const currentVolume = unitSystem === 'metric' ? gallonsToLiters(currentGallons) : currentGallons;
  const desiredVolume = unitSystem === 'metric' ? gallonsToLiters(desiredGallons) : desiredGallons;
  const diffVolume = unitSystem === 'metric' ? gallonsToLiters(diffGallons) : diffGallons;
  const volumeUnit = unitSystem === 'metric' ? 'L' : 'GAL';

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 
                  ring-1 ring-blue-500/20 shadow-xl">
      <div className="p-4 font-mono text-white text-sm leading-tight">
        <table className="w-full border-separate border-spacing-0 whitespace-pre">
          <tbody>
            <tr><td colSpan={3} className="text-center pb-2">{'═'.repeat(38)}</td></tr>
            <tr><td colSpan={3} className="text-center font-bold">PC-12 FUEL CALCULATION RECEIPT</td></tr>
            <tr><td colSpan={3} className="text-center pb-1">{timestamp}</td></tr>
            <tr><td colSpan={3} className="text-center pb-2">{'═'.repeat(38)}</td></tr>
            
            <tr>
              <td>DENSITY:</td>
              <td className="text-right">{formatNumber(density)}</td>
              <td className="pl-2">LBS/GAL {densityChanged ? '(!NON-STD!)' : ''}</td>
            </tr>
            
            <tr><td colSpan={3}>&nbsp;</td></tr>
            
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
            
            <tr><td colSpan={3}>&nbsp;</td></tr>
            
            <tr>
              <td>VOLUME:</td>
              <td className="text-right">{formatNumber(diffVolume)}</td>
              <td className="pl-2">{volumeUnit}</td>
            </tr>
            
            <tr><td colSpan={3} className="py-2">{'═'.repeat(38)}</td></tr>
            
            <tr><td colSpan={3} className="font-bold">REQUIRED ACTION:</td></tr>
            <tr>
              <td>{fuelDifference > 0 ? 'ADD' : 'REMOVE'}</td>
              <td className="text-right">{formatNumber(Math.abs(fuelDifference))}</td>
              <td className="pl-2">LBS</td>
            </tr>
            <tr>
              <td></td>
              <td className="text-right">{formatNumber(diffVolume)}</td>
              <td className="pl-2">{volumeUnit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}