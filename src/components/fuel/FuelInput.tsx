import { Fuel } from 'lucide-react';
import { poundsToVolume } from '../../utils/constants';
import { UnitSystem } from '../../types/fuel';
import { StandardInput } from '../ui/StandardInput';

interface FuelInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  density: number;
  unitSystem: UnitSystem;
  maxFuelLoad: number;
}

export function FuelInput({ label, value, onChange, density, unitSystem, maxFuelLoad }: FuelInputProps) {
  const volume = poundsToVolume(value, density, unitSystem);
  const unit = unitSystem === 'metric' ? 'L' : 'gal';

  return (
    <div className="w-full">
      <StandardInput
        label={label}
        value={value}
        onChange={onChange}
        min={0}
        max={maxFuelLoad}
        step="10"
        icon={<Fuel className="w-3 h-3" />}
        unit={`lbs (${volume.toFixed(1)} ${unit})`}
        width="w-full"
        warningThreshold={maxFuelLoad * 0.9}
        allowEmpty={false}
      />
    </div>
  );
}
