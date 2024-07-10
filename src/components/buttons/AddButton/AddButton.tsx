import React from 'react';
import Typography from '@/components/Typography';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './addButton.style';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  title: string;
}

const AddButton = ({ style, title, ...props }: Props) => {
  const buttonOpacity = props?.disabled ? 0.5 : 1;
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Pressable
      style={[
        styles.container,
        {
          opacity: buttonOpacity,
        },
        style,
      ]}
      {...props}
    >
      <Icon style={styles.icon} name={'add-outline'} size={24} color={theme.colors.primary} />
      <Typography style={styles.text}>{title}</Typography>
    </Pressable>
  );
};

export default AddButton;
