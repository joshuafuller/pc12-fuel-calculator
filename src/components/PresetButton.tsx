import React from 'react';
import { Sparkles } from 'lucide-react';

interface PresetButtonProps {
  onClick: () => void;
  isDark: boolean;
}

export function PresetButton({ onClick, isDark }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-1 px-2 py-1 text-xs font-medium 
                transition-colors rounded-md whitespace-nowrap ${
                  isDark 
                    ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' 
                    : 'text-blue-600 hover:text-blue-500 hover:bg-black/5'
                }`}
      title="Set to typical fuel load"
    >
      <Sparkles className="w-3 h-3" />
      <span>2000 lbs</span>
      <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity
                    rounded-md blur-sm ${
                      isDark 
                        ? 'bg-gradient-to-r from-blue-400/10 to-purple-400/10'
                        : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                    }`} />
    </button>
  );
}