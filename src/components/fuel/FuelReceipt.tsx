import { DEFAULT_FUEL_DENSITY, poundsToVolume } from '../../utils/constants';
import { UnitSystem } from '../../types/fuel';
import { useTheme } from '../../context/ThemeContext';
import { fahrenheitToCelsius, isNonStandardTemperature, STANDARD_TEMPERATURE_F } from '../../utils/temperature';

interface FuelReceiptProps {
  currentFuel: number;
  desiredFuel: number;
  density: number;
  temperature: number;
  defaultTemperature: number;
  densityChanged: boolean;
  unitSystem: UnitSystem;
}

const formatNumber = (num: number): string => num.toFixed(1);

export function FuelReceipt({
  currentFuel = 0,
  desiredFuel = 0,
  density = DEFAULT_FUEL_DENSITY,
  densityChanged,
  unitSystem,
  temperature = STANDARD_TEMPERATURE_F,
  defaultTemperature = STANDARD_TEMPERATURE_F
}: FuelReceiptProps) {
  const { isDark } = useTheme();
  const fuelDifference = desiredFuel - currentFuel;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const isMetric = unitSystem === 'metric';
  const currentVolume = poundsToVolume(currentFuel, density, unitSystem);
  const desiredVolume = poundsToVolume(desiredFuel, density, unitSystem);
  const diffVolume = Math.abs(poundsToVolume(fuelDifference, density, unitSystem));
  const volumeUnit = isMetric ? 'L' : 'GAL';

  // Per-wing values
  const diffPoundsPerWing = Math.abs(fuelDifference) / 2;
  const diffVolumePerWing = diffVolume / 2;

  // `temperature` is in the active unit system; the default is always °F.
  const tempUnit = isMetric ? '°C' : '°F';
  const displayTemp = `${formatNumber(temperature)}${tempUnit}`;
  const standardTemp = `${formatNumber(isMetric ? fahrenheitToCelsius(defaultTemperature) : defaultTemperature)}${tempUnit}`;
  const tempChanged = isNonStandardTemperature(temperature, defaultTemperature, isMetric);
  const action = fuelDifference > 0 ? 'ADD' : fuelDifference < 0 ? 'REMOVE' : 'NO CHANGE';

  return (
    <div className={`rounded-xl overflow-hidden border shadow-xl transition-colors duration-300 ${
      isDark 
        ? 'bg-black/40 backdrop-blur-md border-white/10 ring-1 ring-blue-500/20' 
        : 'bg-white/90 backdrop-blur-md border-black/5'
    }`}>
      <div className={`p-3 sm:p-4 font-mono text-[11px] xs:text-xs sm:text-sm leading-tight ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="max-w-[400px] mx-auto">
          <table className="w-full border-separate border-spacing-0 whitespace-nowrap">
            <tbody>
              <tr><td colSpan={3} className="py-1"><div className="border-t-4 border-double border-current" /></td></tr>
              <tr><td colSpan={3} className="text-center font-bold">PC-12 FUEL CALCULATION RECEIPT</td></tr>
              <tr><td colSpan={3} className="text-center pb-1">{timestamp}</td></tr>
              <tr><td colSpan={3} className="py-1"><div className="border-t-4 border-double border-current" /></td></tr>
              
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
              
              <tr><td colSpan={3} className="py-1"><div className="border-t border-current" /></td></tr>
              
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
              
              <tr><td colSpan={3} className="py-1"><div className="border-t border-current" /></td></tr>
              
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
              
              <tr><td colSpan={3} className="py-1"><div className="border-t-4 border-double border-current" /></td></tr>
              
              {/* Required Action Section */}
              <tr><td colSpan={3} className="font-bold">REQUIRED ACTION:</td></tr>
              <tr>
                <td>{action}</td>
                <td className="text-right">{formatNumber(Math.abs(fuelDifference))}</td>
                <td className="pl-2">LBS TOTAL</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-right">{formatNumber(diffVolume)}</td>
                <td className="pl-2">{volumeUnit} TOTAL</td>
              </tr>

              {/* Per Wing Section */}
              <tr><td colSpan={3} className="py-1"><div className="border-t border-current" /></td></tr>
              <tr><td colSpan={3} className="font-bold">PER WING:</td></tr>
              <tr>
                <td>{action}</td>
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