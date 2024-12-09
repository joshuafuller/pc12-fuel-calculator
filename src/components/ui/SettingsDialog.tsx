import React from 'react';
import { Settings, DEFAULT_SETTINGS } from '../../types/settings';
import { X, RotateCcw } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  isDark: boolean;
}

export function SettingsDialog({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  isDark
}: SettingsDialogProps) {
  if (!isOpen) return null;

  const handleChange = (key: keyof Settings, value: number | boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const resetDensity = () => {
    handleChange('defaultDensity', DEFAULT_SETTINGS.defaultDensity);
  };

  const resetMaxFuel = () => {
    handleChange('maxFuelLoad', DEFAULT_SETTINGS.maxFuelLoad);
  };

  const resetTemperature = () => {
    handleChange('defaultTemperature', DEFAULT_SETTINGS.defaultTemperature);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-lg rounded-xl shadow-2xl border transition-colors duration-300 ${
        isDark 
          ? 'bg-black/90 border-white/10 ring-1 ring-blue-500/20' 
          : 'bg-white/95 border-black/5'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b transition-colors duration-300 ${
          isDark ? 'border-white/10' : 'border-black/5'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Settings
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                isDark 
                  ? 'text-white/60 hover:text-white hover:bg-white/10' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Numeric Settings */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Maximum Fuel Load (lbs)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.maxFuelLoad}
                  onChange={(e) => handleChange('maxFuelLoad', Math.max(0, Number(e.target.value)))}
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                           transition-colors ${
                             isDark 
                               ? 'bg-black/30 border-white/20 text-white' 
                               : 'bg-white border-gray-300 text-gray-900'
                           }`}
                />
                {settings.maxFuelLoad !== DEFAULT_SETTINGS.maxFuelLoad && (
                  <button
                    onClick={resetMaxFuel}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' 
                        : 'text-blue-600 hover:text-blue-500 hover:bg-black/5'
                    }`}
                    title="Reset to default max fuel load (2704)"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Default Fuel Density (lbs/gal)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.defaultDensity}
                  onChange={(e) => handleChange('defaultDensity', Math.max(5, Math.min(8, Number(e.target.value))))}
                  step="0.1"
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                           transition-colors ${
                             isDark 
                               ? 'bg-black/30 border-white/20 text-white' 
                               : 'bg-white border-gray-300 text-gray-900'
                           }`}
                />
                {settings.defaultDensity !== DEFAULT_SETTINGS.defaultDensity && (
                  <button
                    onClick={resetDensity}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' 
                        : 'text-blue-600 hover:text-blue-500 hover:bg-black/5'
                    }`}
                    title="Reset to standard density (6.7)"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Default Temperature (°F)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.defaultTemperature}
                  onChange={(e) => handleChange('defaultTemperature', Math.max(-22, Math.min(122, Number(e.target.value))))}
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                           transition-colors ${
                             isDark 
                               ? 'bg-black/30 border-white/20 text-white' 
                               : 'bg-white border-gray-300 text-gray-900'
                           }`}
                />
                {settings.defaultTemperature !== DEFAULT_SETTINGS.defaultTemperature && (
                  <button
                    onClick={resetTemperature}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' 
                        : 'text-blue-600 hover:text-blue-500 hover:bg-black/5'
                    }`}
                    title="Reset to standard temperature (59°F)"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Default Preset Load (lbs)
              </label>
              <input
                type="number"
                value={settings.defaultPresetLoad}
                onChange={(e) => handleChange('defaultPresetLoad', Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-2 border rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                         transition-colors ${
                           isDark 
                             ? 'bg-black/30 border-white/20 text-white' 
                             : 'bg-white border-gray-300 text-gray-900'
                         }`}
              />
            </div>
          </div>

          {/* Toggle Settings */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.persistSettings}
                onChange={(e) => handleChange('persistSettings', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 
                         focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className={`text-sm ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Remember settings between sessions
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t transition-colors duration-300 ${
          isDark ? 'border-white/10' : 'border-black/5'
        }`}>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}