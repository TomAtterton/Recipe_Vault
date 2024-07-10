import { Theme } from '@react-navigation/native';
import { fonts } from '@/theme/fonts';
import { darkColors, lightColors } from '@/theme/colors';

export const lightTheme = {
  fonts,
  colors: lightColors,
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  borderRadius: 10,
} as const;

export const darkTheme = {
  fonts,
  colors: darkColors,
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  borderRadius: 10,
} as const;

export const darkNavigationTheme: Theme | undefined = {
  colors: {
    text: darkTheme.colors.typography,
    card: darkTheme.colors.background,
    notification: darkTheme.colors.primary,
    ...darkTheme.colors,
    border: 'transparent',
  },
  dark: true,
};

export const lightNavigationTheme: Theme | undefined = {
  colors: {
    text: lightTheme.colors.typography,
    card: lightTheme.colors.background,
    notification: lightTheme.colors.primary,
    ...lightTheme.colors,
    border: 'transparent',
  },
  dark: false,
};
