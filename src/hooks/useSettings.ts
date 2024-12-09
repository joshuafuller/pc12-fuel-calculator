import { useState, useEffect } from 'react';
import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import { loadSettings, saveSettings, clearFuelState } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedSettings = loadSettings();
    setSettings(savedSettings);
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    
    if (!newSettings.persistSettings) {
      clearFuelState();
    }
  };

  return {
    settings,
    isDialogOpen,
    openDialog: () => setIsDialogOpen(true),
    closeDialog: () => setIsDialogOpen(false),
    updateSettings
  };
}