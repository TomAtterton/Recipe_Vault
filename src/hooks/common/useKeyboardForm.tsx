import { useCallback } from 'react';
import KeyboardManager from 'react-native-keyboard-manager';
import { useStyles } from 'react-native-unistyles';
import { useFocusEffect } from '@react-navigation/native';

export const useKeyboardForm = () => {
  const { theme } = useStyles();
  const setupKeyboard = useCallback(() => {
    KeyboardManager?.setEnable(true);
    KeyboardManager.setLayoutIfNeededOnUpdate(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarDoneBarButtonItemText('Done');
    KeyboardManager.setToolbarManageBehaviourBy('subviews'); // "subviews" | "tag" | "position"
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
    KeyboardManager.setToolbarBarTintColor(theme.colors.background); // Only #000000 format is supported
    KeyboardManager.setShouldShowToolbarPlaceholder(true);
    KeyboardManager.setOverrideKeyboardAppearance(false);
    KeyboardManager.setKeyboardAppearance('dark'); // "default" | "light" | "dark"
    KeyboardManager.setShouldResignOnTouchOutside(true);
    KeyboardManager.setShouldPlayInputClicks(true);
  }, [theme.colors.background]);

  useFocusEffect(
    useCallback(() => {
      setupKeyboard();
    }, [setupKeyboard]),
  );
};
