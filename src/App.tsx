import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { FuelMeter } from './components/fuel/FuelMeter';
import { FuelInputGroup } from './components/fuel/FuelInputGroup';
import { DensityInput } from './components/fuel/DensityInput';
import { UnitToggle } from './components/ui/UnitToggle';
import { FuelReceipt } from './components/fuel/FuelReceipt';
import { SettingsDialog } from './components/ui/SettingsDialog';
import { useFuelState } from './hooks/useFuelState';
import { useFocusState } from './hooks/useFocusState';
import { useSettings } from './hooks/useSettings';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const settings = useSettings();
  const fuel = useFuelState(settings.settings);
  const focus = useFocusState();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-3xl mx-auto px-3 py-4 sm:px-4">
        <div className="flex gap-3 sm:gap-4">
          {/* Fuel Meter - Left Side */}
          <div className="w-16 sm:w-20 flex-shrink-0">
            <FuelMeter 
              currentFuel={fuel.currentFuel}
              desiredFuel={fuel.desiredFuel}
              unitSystem={fuel.unitSystem}
              isDark={isDark}
              maxFuelLoad={settings.settings.maxFuelLoad}
            />
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className={`rounded-xl overflow-hidden shadow-xl border transition-colors duration-300 ${
              isDark 
                ? 'bg-black/40 backdrop-blur-md border-white/10 ring-1 ring-blue-500/20' 
                : 'bg-white/90 backdrop-blur-md border-black/5'
            }`}>
              <Header 
                isDark={isDark} 
                onThemeToggle={() => setIsDark(!isDark)}
                onSettingsClick={settings.openDialog}
              />
              
              <div className="px-4 sm:px-6 pb-6 pt-4">
                <UnitToggle 
                  unitSystem={fuel.unitSystem} 
                  onChange={fuel.setUnitSystem} 
                  isDark={isDark} 
                />
                
                <div className="space-y-4">
                  <FuelInputGroup
                    currentFuel={fuel.currentFuel}
                    desiredFuel={fuel.desiredFuel}
                    density={fuel.density}
                    unitSystem={fuel.unitSystem}
                    isDark={isDark}
                    currentFocused={focus.current}
                    desiredFocused={focus.desired}
                    onCurrentFuelChange={fuel.setCurrentFuel}
                    onDesiredFuelChange={fuel.setDesiredFuel}
                    onCurrentFocus={() => focus.setCurrentFocus(true)}
                    onCurrentBlur={() => focus.setCurrentFocus(false)}
                    onDesiredFocus={() => focus.setDesiredFocus(true)}
                    onDesiredBlur={() => focus.setDesiredFocus(false)}
                    maxFuelLoad={settings.settings.maxFuelLoad}
                    defaultPresetLoad={settings.settings.defaultPresetLoad}
                  />

                  <DensityInput
                    value={fuel.density}
                    temperature={fuel.temperature}
                    onChange={fuel.setDensity}
                    onTemperatureChange={fuel.setTemperature}
                    isDark={isDark}
                    isFocused={focus.density}
                    onFocus={() => focus.setDensityFocus(true)}
                    onBlur={() => focus.setDensityFocus(false)}
                    defaultDensity={settings.settings.defaultDensity}
                    defaultTemperature={settings.settings.defaultTemperature}
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
              defaultTemperature={settings.settings.defaultTemperature}
              densityChanged={fuel.density !== settings.settings.defaultDensity}
              unitSystem={fuel.unitSystem}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      <SettingsDialog 
        isOpen={settings.isDialogOpen}
        onClose={settings.closeDialog}
        settings={settings.settings}
        onSettingsChange={settings.updateSettings}
        isDark={isDark}
      />
    </div>
  );
}