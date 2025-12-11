import { useCallback, useState } from "react"

/**
 * Simple boolean toggle hook for UI state.
 *
 * Purpose: shared/ui hook to toggle visibility or boolean flags (dialogs, menus, etc.).
 * Inputs: `initial` - initial boolean value (default: false).
 * Returns: [value, setValue, toggle]
 * - value: current boolean state
 * - setValue: set state to a specific boolean
 * - toggle: convenience callback to invert the state
 */
export function useToggle(initial = false): [boolean, (v: boolean) => void, () => void] {
  const [value, setValue] = useState<boolean>(initial)
  const toggle = useCallback(() => setValue((v) => !v), [])
  return [value, (v: boolean) => setValue(v), toggle]
}

export default useToggle
