import React from 'react';
import { Pressable } from 'react-native';
import type { BaseToastProps } from 'react-native-toast-message';
import Typography from '@/components/Typography';
import Icon from '@/components/Icon';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export interface ToastProps extends BaseToastProps {
  type: 'success' | 'error' | 'update';
}

const Toast = ({ text2, type, ...props }: ToastProps) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const icon = type === 'success' ? 'celebrate' : type === 'error' ? 'alert' : 'ufo';
  const backgroundColor =
    type === 'success' ? colors.success : type === 'error' ? colors.error : colors.update;

  return (
    <Pressable {...props} style={[styles.container, { backgroundColor }]}>
      <Icon name={icon} size={32} color={colors.typography} />
      <Typography numberOfLines={4} style={styles.title} variant={'bodyMediumItalic'}>
        {text2}
      </Typography>
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    top: miniRuntime.insets.top / 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: theme.colors.onBackground,
    borderWidth: 1,
    width: '90%',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
}));

export default Toast;
