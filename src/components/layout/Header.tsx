import React from 'react';
import { Fuel, Moon, Sun, Mail, Settings } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onSettingsClick: () => void;
}

export function Header({ isDark, onThemeToggle, onSettingsClick }: HeaderProps) {
  return (
    <div className={`-mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-5 border-b rounded-t-xl transition-colors duration-300 ${
      isDark 
        ? 'bg-black/60 border-white/5' 
        : 'bg-white/80 border-black/5'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
            <div className={`absolute inset-0 blur-sm rounded-full ${
              isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
            }`} />
            <Fuel className={`w-4 h-4 sm:w-5 sm:h-5 relative animate-pulse-subtle ${
              isDark 
                ? 'text-blue-400' 
                : 'text-blue-600'
            }`} />
          </div>
          <h1 className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
            isDark 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          }`}>
            PC-12 Fuel Calculator
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSettingsClick}
            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 relative ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-500'
            }`}
            title="Settings"
          >
            <div className="absolute inset-0 rounded-lg blur-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                         opacity-0 hover:opacity-100 transition-opacity" />
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          </button>
          <a
            href="mailto:joshuafuller@gmail.com"
            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 relative ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-500'
            }`}
            title="Send feedback"
          >
            <div className="absolute inset-0 rounded-lg blur-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                         opacity-0 hover:opacity-100 transition-opacity" />
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          </a>
          <button
            onClick={onThemeToggle}
            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 relative ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            <div className="absolute inset-0 rounded-lg blur-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                         opacity-0 hover:opacity-100 transition-opacity" />
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}