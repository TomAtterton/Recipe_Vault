import React, { memo } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './typography.style';

interface Props extends TextProps {
  style?: StyleProp<TextStyle>;
  variant?:
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleItalicLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodyMediumItalic'
    | 'bodySmall'
    | 'bodySmallItalic';
}

// TODO handle localization
const Typography = ({ children, style, variant, ...props }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const fontStyle = theme.fonts[variant || 'bodyMedium'];
  return (
    <Text {...props} style={[styles.text, fontStyle, style]}>
      {children}
    </Text>
  );
};

export default memo(Typography);
