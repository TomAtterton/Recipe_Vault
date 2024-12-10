import React from 'react';
import Typography from '@/components/Typography';
import { ActivityIndicator, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './outlineButton.style';
import { IconName } from '@/components/Icon/types';
import SquircleDynamicContainer from '@/components/SquircleDynamicContainer';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  title: string;
  iconSource?: IconName;
  isLoading?: boolean;
  width?: number;
}

const OutlineButton = ({
  width,
  style,
  contentStyle,
  title,
  iconSource,
  isLoading,
  ...props
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const hasIcon = !!iconSource;
  const buttonOpacity = props?.disabled ? 0.5 : 1;

  return (
    <SquircleDynamicContainer
      height={40}
      width={width}
      style={[styles.container, style]}
      color={theme.colors.onBackground}
    >
      <Pressable
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
        style={({ pressed }) => [
          styles.contentContainer,
          contentStyle,
          {
            justifyContent: hasIcon ? 'flex-start' : 'center',
            opacity: pressed ? 0.5 : buttonOpacity,
          },
        ]}
        {...props}
        disabled={isLoading || props?.disabled}
      >
        {hasIcon && (
          <Icon style={styles.icon} name={iconSource} size={24} color={theme.colors.primary} />
        )}
        <Typography style={styles.text}>{title}</Typography>
      </Pressable>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.onBackground} />
      ) : null}
    </SquircleDynamicContainer>
  );
};

export default OutlineButton;
