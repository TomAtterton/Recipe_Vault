import React, { forwardRef } from 'react';
import {
  TouchableOpacityProps,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  View,
  TouchableOpacity,
} from 'react-native';
import Typography from 'src/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './primaryButton.style';
import SquircleDynamicContainer from '@/components/SquircleDynamicContainer';

interface Props extends TouchableOpacityProps {
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  title: string;
  width?: number;
}

const PrimaryButton = forwardRef<View, Props>(
  ({ contentContainerStyle, width, isLoading, style, title, ...props }, ref) => {
    const { styles, theme } = useStyles(stylesheet);

    const buttonOpacity = props?.disabled || isLoading ? 0.5 : 1;

    return (
      <SquircleDynamicContainer
        ref={ref}
        height={40}
        width={width}
        style={[styles.container, style]}
        shouldFill
      >
        <TouchableOpacity
          {...props}
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
          style={[
            styles.contentContainer,
            {
              opacity: buttonOpacity,
            },
            contentContainerStyle,
          ]}
          disabled={isLoading || props?.disabled}
        >
          {isLoading ? (
            <ActivityIndicator style={styles.loading} color={theme.colors.background60} />
          ) : null}
          <Typography style={styles.text}>{title}</Typography>
        </TouchableOpacity>
      </SquircleDynamicContainer>
    );
  }
);

export default PrimaryButton;
