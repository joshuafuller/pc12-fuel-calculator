import React, { useRef, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Particles } from '../effects/Particles';

interface StandardInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isDark: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  min?: number;
  max?: number;
  step?: string;
  icon?: React.ReactNode;
  unit?: string;
  standardValue?: number;
  onReset?: () => void;
  width?: string;
  showResetButton?: boolean;
  warningThreshold?: number;
  allowEmpty?: boolean;
}

export function StandardInput({
  label,
  value,
  onChange,
  isDark,
  isFocused,
  onFocus,
  onBlur,
  min,
  max,
  step = "1",
  icon,
  unit,
  standardValue,
  onReset,
  width = "w-32",
  showResetButton = true,
  warningThreshold,
  allowEmpty = true
}: StandardInputProps) {
  const [ripplePoint, setRipplePoint] = useState<{ x: number; y: number } | undefined>();
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  
  // Update internal input value when external value changes
  useEffect(() => {
    if (value !== parseFloat(inputValue)) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setRipplePoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const validateAndUpdate = (newValue: string) => {
    setInputValue(newValue);
    
    // Allow empty input if configured
    if (newValue === '' && allowEmpty) {
      onChange(0);
      setError(null);
      setWarning(null);
      return;
    }

    // Handle special case for "0" input
    if (newValue === '0' || newValue === '-0') {
      onChange(0);
      setError(null);
      setWarning(null);
      return;
    }

    const numValue = parseFloat(newValue);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      setError('Invalid number');
      return;
    }

    // Clear previous messages
    setError(null);
    setWarning(null);

    // Check bounds
    if (min !== undefined && numValue < min) {
      setError(`Minimum value is ${min}`);
      return;
    }
    if (max !== undefined && numValue > max) {
      setError(`Maximum value is ${max}`);
      return;
    }

    // Check warning threshold
    if (warningThreshold !== undefined && numValue > warningThreshold) {
      setWarning('Approaching maximum');
    }

    // Update the value
    onChange(numValue);
  };

  const isNonStandard = standardValue !== undefined && value !== standardValue;

  return (
    <div className="relative">
      <label className={`block text-xs font-medium mb-1.5 ${
        isDark ? 'text-white' : 'text-gray-700'
      }`}>
        <div className="flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
          {standardValue !== undefined && (
            <span className={`text-xs ${
              isDark ? 'text-blue-300/60' : 'text-blue-600/60'
            }`}>
              (Std: {standardValue})
            </span>
          )}
        </div>
      </label>
      <div className="relative inline-flex items-center gap-3" ref={inputRef} onClick={handleClick}>
        <div className="relative">
          {isFocused && (
            <>
              <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 to-purple-500 
                           opacity-50 blur-sm rounded-lg animate-glow -z-10" />
              <Particles 
                active={true}
                color={isDark ? '#60A5FA' : '#3B82F6'} 
                intensity={1.5}
                speed={0.5}
                size={1.2}
                ripplePoint={ripplePoint}
              />
            </>
          )}
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => validateAndUpdate(e.target.value)}
            onFocus={onFocus}
            onBlur={(e) => {
              // On blur, if empty and not allowing empty, reset to 0
              if (e.target.value === '' && !allowEmpty) {
                validateAndUpdate('0');
              }
              onBlur();
            }}
            step={step}
            className={`${width} px-3 py-1.5 border rounded text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                     transition-all duration-300 ${unit ? 'pr-16' : ''} ${
                       isDark 
                         ? 'bg-black/30 border-white/20 text-white placeholder-white/50'
                         : 'bg-white/30 border-black/20 text-gray-900 placeholder-gray-500'
                     } ${
                       error ? 'border-red-500' : warning ? 'border-yellow-500' : ''
                     }`}
          />
          {unit && (
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${
              isDark ? 'text-white/60' : 'text-gray-500'
            }`}>
              {unit}
            </div>
          )}
        </div>
        {isNonStandard && onReset && showResetButton && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-xs whitespace-nowrap">
              Non-std
            </span>
            <button
              onClick={onReset}
              className={`flex items-center transition-colors ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
              title="Reset to standard value"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {(error || warning) && (
        <div className={`absolute -bottom-4 left-0 flex items-center text-xs ${
          error ? 'text-red-400' : 'text-yellow-400'
        }`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          {error || warning}
        </div>
      )}
    </div>
  );
}