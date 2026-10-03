import { useState, useCallback } from 'react';
import { Settings } from '../types/settings';
import { loadSettings, saveSettings, clearFuelState } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    if (!newSettings.persistSettings) {
      clearFuelState();
    }
  }, []);

  const openDialog = useCallback(() => setIsDialogOpen(true), []);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  return { settings, isDialogOpen, openDialog, closeDialog, updateSettings };
}
