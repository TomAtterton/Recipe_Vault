import React from 'react';
import Typography from '@/components/Typography';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './settingsButton.style';
import { IconName } from '@/components/Icon/types';
import SquircleDynamicContainer from '@/components/SquircleDynamicContainer';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  iconSource?: IconName;
  iconSize?: number;
}

const SettingsButton = ({ style, title, iconSource, iconSize = 24, ...props }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const hasIcon = !!iconSource;
  const buttonOpacity = props?.disabled ? 0.5 : 1;

  return (
    <SquircleDynamicContainer
      height={40}
      style={[styles.container, style]}
      color={theme.colors.onBackground}
    >
      <Pressable
        style={({ pressed }) => [
          styles.contentContainer,
          {
            opacity: pressed ? 0.5 : buttonOpacity,
          },
        ]}
        {...props}
      >
        {hasIcon && (
          <Icon
            style={styles.icon}
            name={iconSource}
            size={iconSize}
            color={theme.colors.onBackground}
          />
        )}
        <Typography style={styles.text}>{title}</Typography>
        <Icon
          style={styles.icon}
          name={'arrow-right'}
          size={iconSize}
          color={theme.colors.primary}
        />
      </Pressable>
    </SquircleDynamicContainer>
  );
};

export default SettingsButton;
