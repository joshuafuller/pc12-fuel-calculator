import { useState } from 'react';
import { FocusState } from '../types/fuel';

export function useFocusState() {
  const [focusState, setFocusState] = useState<FocusState>({
    current: false,
    desired: false,
    density: false
  });

  return {
    ...focusState,
    setCurrentFocus: (current: boolean) => setFocusState(prev => ({ ...prev, current })),
    setDesiredFocus: (desired: boolean) => setFocusState(prev => ({ ...prev, desired })),
    setDensityFocus: (density: boolean) => setFocusState(prev => ({ ...prev, density }))
  };
}