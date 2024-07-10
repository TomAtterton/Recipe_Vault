import React from 'react';
import Typography from '@/components/Typography';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './listButton.style';
import { IconName } from '@/components/Icon/types';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  iconSource?: IconName;
}

const ListButton = ({ style, title, iconSource, ...props }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const hasIcon = !!iconSource;
  const buttonOpacity = props?.disabled ? 0.5 : 1;

  return (
    <Pressable
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          justifyContent: hasIcon ? 'flex-start' : 'center',
          opacity: buttonOpacity,
        },
        style,
      ]}
      {...props}
    >
      {hasIcon && (
        <Icon style={styles.icon} name={iconSource} size={18} color={theme.colors.primary} />
      )}
      <Typography style={styles.text}>{title}</Typography>
    </Pressable>
  );
};

export default ListButton;
