import { useEffect, useId, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Settings, DEFAULT_SETTINGS } from '../../types/settings';
import { useTheme } from '../../context/ThemeContext';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

type NumericSettingKey = Exclude<keyof Settings, 'persistSettings'>;

interface NumberFieldProps {
  label: string;
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  step?: string;
  onCommit: (value: number) => void;
}

/**
 * Number input that keeps its own text while typing and only commits values inside
 * [min, max], so intermediate input such as "6" on the way to "6.7" isn't clamped away.
 */
function NumberField({ label, value, defaultValue, min, max, step, onCommit }: NumberFieldProps) {
  const { isDark } = useTheme();
  const id = useId();
  const [text, setText] = useState(String(value));

  // Re-sync the text when the value changes from outside (e.g. the reset button).
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (parseFloat(text) !== value) setText(String(value));
  }

  const parsed = text.trim() === '' ? NaN : Number(text);
  const isValid = Number.isFinite(parsed) && parsed >= min && parsed <= max;

  const handleChange = (next: string) => {
    setText(next);
    const n = next.trim() === '' ? NaN : Number(next);
    if (Number.isFinite(n) && n >= min && n <= max) onCommit(n);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={text}
          min={min}
          max={max}
          step={step}
          aria-invalid={!isValid}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setText(String(value))}
          className={`flex-1 px-3 py-2 border rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50
                   transition-colors ${
                     isValid ? '' : 'border-red-500'
                   } ${
                     isDark
                       ? 'bg-black/30 border-white/20 text-white'
                       : 'bg-white border-gray-300 text-gray-900'
                   }`}
        />
        {value !== defaultValue && (
          <button
            type="button"
            onClick={() => onCommit(defaultValue)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5'
                : 'text-blue-600 hover:text-blue-500 hover:bg-black/5'
            }`}
            title={`Reset to default (${defaultValue})`}
            aria-label={`Reset ${label} to default (${defaultValue})`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
      {!isValid && (
        <p className="mt-1 text-xs text-red-400">
          Enter a value between {min} and {max}
        </p>
      )}
    </div>
  );
}

export function SettingsDialog({ isOpen, onClose, settings, onSettingsChange }: SettingsDialogProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const numberField = (
    key: NumericSettingKey,
    label: string,
    min: number,
    max: number,
    step?: string
  ) => (
    <NumberField
      label={label}
      value={settings[key]}
      defaultValue={DEFAULT_SETTINGS[key]}
      min={min}
      max={max}
      step={step}
      onCommit={(value) => onSettingsChange({ ...settings, [key]: value })}
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-lg max-h-full overflow-y-auto rounded-xl shadow-2xl border transition-colors duration-300 ${
        isDark
          ? 'bg-black/90 border-white/10 ring-1 ring-blue-500/20'
          : 'bg-white/95 border-black/5'
      }`}>
        <div className={`px-6 py-4 border-b transition-colors duration-300 ${
          isDark ? 'border-white/10' : 'border-black/5'
        }`}>
          <div className="flex items-center justify-between">
            <h2
              id="settings-title"
              className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Settings
            </h2>
            <button
              onClick={onClose}
              aria-label="Close settings"
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

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {numberField('maxFuelLoad', 'Maximum Fuel Load (lbs)', 100, 10000)}
            {numberField('defaultDensity', 'Default Fuel Density (lbs/gal)', 5, 8, '0.1')}
            {numberField('defaultTemperature', 'Default Temperature (°F)', -22, 122)}
            {numberField('defaultPresetLoad', 'Default Preset Load (lbs)', 0, settings.maxFuelLoad)}
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.persistSettings}
              onChange={(e) => onSettingsChange({ ...settings, persistSettings: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-500
                       focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Remember settings between sessions
            </span>
          </label>
        </div>

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
