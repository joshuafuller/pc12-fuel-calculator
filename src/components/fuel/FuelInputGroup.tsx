import { FuelInput } from './FuelInput';
import { PresetButton } from '../ui/PresetButton';
import { UnitSystem } from '../../types/fuel';

interface FuelInputGroupProps {
  currentFuel: number;
  desiredFuel: number;
  density: number;
  unitSystem: UnitSystem;
  onCurrentFuelChange: (value: number) => void;
  onDesiredFuelChange: (value: number) => void;
  maxFuelLoad: number;
  defaultPresetLoad: number;
}

export function FuelInputGroup({
  currentFuel,
  desiredFuel,
  density,
  unitSystem,
  onCurrentFuelChange,
  onDesiredFuelChange,
  maxFuelLoad,
  defaultPresetLoad
}: FuelInputGroupProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <FuelInput
        label="Current Fuel Load"
        value={currentFuel}
        onChange={onCurrentFuelChange}
        density={density}
        unitSystem={unitSystem}
        maxFuelLoad={maxFuelLoad}
      />

      <div className="flex flex-wrap xs:flex-nowrap items-start gap-2 min-w-0">
        <FuelInput
          label="Desired Fuel Load"
          value={desiredFuel}
          onChange={onDesiredFuelChange}
          density={density}
          unitSystem={unitSystem}
          maxFuelLoad={maxFuelLoad}
        />
        <div className="xs:mt-5 flex-shrink-0">
          <PresetButton
            onClick={() => onDesiredFuelChange(defaultPresetLoad)}
            presetValue={defaultPresetLoad}
          />
        </div>
      </div>
    </div>
  );
}
