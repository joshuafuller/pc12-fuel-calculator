import { FuelMeter } from './components/fuel/FuelMeter';
import { Header } from './components/layout/Header';
import { FuelInputGroup } from './components/fuel/FuelInputGroup';
import { DensityInput } from './components/fuel/DensityInput';
import { UnitToggle } from './components/ui/UnitToggle';
import { FuelReceipt } from './components/fuel/FuelReceipt';
import { SettingsDialog } from './components/ui/SettingsDialog';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useFuelState } from './hooks/useFuelState';
import { useSettings } from './hooks/useSettings';

function FuelCalculator() {
  const { isDark } = useTheme();
  const { settings, isDialogOpen, openDialog, closeDialog, updateSettings } = useSettings();
  const fuel = useFuelState(settings);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="max-w-3xl land:max-w-5xl mx-auto px-3 py-4 land:py-2 sm:px-4">
        <div className="flex gap-3 sm:gap-4">
          {/* Fuel meter - left side */}
          <div className="w-12 xs:w-16 sm:w-20 flex-shrink-0 sticky top-4 land:top-2 self-start h-[calc(100vh-2rem)] h-[calc(100dvh-2rem)] land:h-[calc(100dvh-1rem)] min-h-[320px]">
            <FuelMeter
              currentFuel={fuel.currentFuel}
              desiredFuel={fuel.desiredFuel}
              density={fuel.density}
              unitSystem={fuel.unitSystem}
              maxFuelLoad={settings.maxFuelLoad}
            />
          </div>

          {/* Main content - right side */}
          <div className="flex-1 min-w-0 space-y-4 land:space-y-0 land:grid land:grid-cols-2 land:gap-3 land:items-start">
            <div className={`rounded-xl overflow-hidden shadow-xl border transition-colors duration-300 ${
              isDark
                ? 'bg-black/40 backdrop-blur-md border-white/10 ring-1 ring-blue-500/20'
                : 'bg-white/90 backdrop-blur-md border-black/5'
            }`}>
              <Header onSettingsClick={openDialog} />

              <div className="px-4 sm:px-6 pb-6 pt-4">
                <UnitToggle unitSystem={fuel.unitSystem} onChange={fuel.setUnitSystem} />

                <div className="space-y-4">
                  <FuelInputGroup
                    currentFuel={fuel.currentFuel}
                    desiredFuel={fuel.desiredFuel}
                    density={fuel.density}
                    unitSystem={fuel.unitSystem}
                    onCurrentFuelChange={fuel.setCurrentFuel}
                    onDesiredFuelChange={fuel.setDesiredFuel}
                    maxFuelLoad={settings.maxFuelLoad}
                    defaultPresetLoad={settings.defaultPresetLoad}
                  />

                  <DensityInput
                    value={fuel.density}
                    temperature={fuel.temperature}
                    onChange={fuel.setDensity}
                    onTemperatureChange={fuel.setTemperature}
                    defaultDensity={settings.defaultDensity}
                    defaultTemperature={settings.defaultTemperature}
                    unitSystem={fuel.unitSystem}
                  />
                </div>
              </div>
            </div>

            <FuelReceipt
              currentFuel={fuel.currentFuel}
              desiredFuel={fuel.desiredFuel}
              density={fuel.density}
              temperature={fuel.temperature}
              defaultTemperature={settings.defaultTemperature}
              densityChanged={fuel.density !== settings.defaultDensity}
              unitSystem={fuel.unitSystem}
            />
          </div>
        </div>
      </div>

      <SettingsDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FuelCalculator />
    </ThemeProvider>
  );
}
