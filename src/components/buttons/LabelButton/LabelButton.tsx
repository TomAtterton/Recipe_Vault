import React, { forwardRef } from 'react';
import Typography from '@/components/Typography';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './labelButton.style';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  title: string;
}

const LabelButton = forwardRef(({ style, title, ...props }: Props, ref) => {
  const { styles } = useStyles(stylesheet);
  const buttonOpacity = props?.disabled ? 0.5 : 1;
  return (
    <Pressable
      // @ts-ignore
      ref={ref}
      style={[
        styles.container,
        {
          opacity: buttonOpacity,
        },
        style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...props}
    >
      <Typography style={styles.text}>{title}</Typography>
    </Pressable>
  );
});

export default LabelButton;
