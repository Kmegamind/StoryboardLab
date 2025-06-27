
import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback } from 'react';

interface UseKeyboardShortcutsProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  isEnabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  hasSelection,
  isEnabled = true,
}: UseKeyboardShortcutsProps) => {
  const handleSelectAll = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    onSelectAll();
  }, [onSelectAll]);

  const handleClearSelection = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    onClearSelection();
  }, [onClearSelection]);

  const handleDelete = useCallback((e: KeyboardEvent) => {
    if (hasSelection) {
      e.preventDefault();
      onDeleteSelected();
    }
  }, [onDeleteSelected, hasSelection]);

  useHotkeys('ctrl+a, meta+a', handleSelectAll, {
    enabled: isEnabled,
    preventDefault: true,
  });

  useHotkeys('escape', handleClearSelection, {
    enabled: isEnabled && hasSelection,
    preventDefault: true,
  });

  useHotkeys('delete', handleDelete, {
    enabled: isEnabled && hasSelection,
    preventDefault: true,
  });
};
