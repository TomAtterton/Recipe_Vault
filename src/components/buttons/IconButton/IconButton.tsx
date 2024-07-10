import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './iconButton.style';
import { IconName } from '@/components/Icon/types';
import { TouchableOpacityProps } from 'react-native-gesture-handler';

export interface IconButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  iconSource: IconName;
  iconColor?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  iconSize?: number;
}

const BUTTON_SIZE = {
  small: 32,
  medium: 48,
  large: 64,
};

const ICON_SIZE = {
  small: 18,
  medium: 24,
  large: 32,
};

const IconButton = ({ style, iconSource, iconSize, iconColor, ...props }: IconButtonProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const buttonOpacity = props?.disabled ? 0.5 : 1;
  const buttonSize = BUTTON_SIZE[props.buttonSize || 'medium'];
  return (
    <TouchableOpacity
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      style={[
        styles.container,
        {
          opacity: buttonOpacity,
          height: buttonSize,
          width: buttonSize,
          borderRadius: buttonSize / 2,
        },
        style,
      ]}
      {...props}
    >
      <Icon
        style={styles.icon}
        name={iconSource}
        size={iconSize || ICON_SIZE[props.buttonSize || 'medium']}
        color={iconColor || theme.colors.primary}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
