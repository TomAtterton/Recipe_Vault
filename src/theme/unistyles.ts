import { UnistylesRegistry } from 'react-native-unistyles';
import { lightTheme, darkTheme } from './themes';
import { breakpoints } from '@/theme/breakpoints';

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}

  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'dark',
  });
