import React from 'react';
import Typography from '@/components/Typography';
import { Pressable, PressableProps, StyleProp, View, ViewStyle } from 'react-native';
import Icon from '@/components/Icon';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './infoLabelButton.style';
import { IconName } from '@/components/Icon/types';
import * as Clipboard from 'expo-clipboard';
import { showSuccessMessage } from '@/utils/promptUtils';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<ViewStyle>;
  title: string;
  buttonTitle?: string | null;
  iconSource?: IconName;
  leftIconSource?: IconName;
}

const InfoLabelButton = ({
  style,
  buttonTitleStyle,
  title,
  buttonTitle,
  leftIconSource,
  iconSource,
  ...props
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const hasIcon = !!iconSource;
  const buttonOpacity = props?.disabled ? 0.5 : 1;

  const handlePress = async (e: any) => {
    if (props.onPress) {
      return props.onPress(e);
    }
    try {
      // copy to clipboard if no onPress is provided
      !!buttonTitle && (await Clipboard.setStringAsync(buttonTitle || ''));
      showSuccessMessage('Copied to clipboard');
    } catch (error) {
      // swallow error
      console.log('Error copying to clipboard', error);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.5 : buttonOpacity,
        },
        style,
      ]}
      {...props}
      onPress={handlePress}
    >
      {leftIconSource && <Icon name={leftIconSource} size={16} color={theme.colors.primary} />}
      <Typography style={styles.title}>{title}</Typography>
      <View style={styles.rightContent}>
        <Typography numberOfLines={1} style={[styles.buttonTitle, buttonTitleStyle]}>
          {buttonTitle}
        </Typography>
        {hasIcon && <Icon name={iconSource} size={16} color={theme.colors.primary} />}
      </View>
    </Pressable>
  );
};

export default InfoLabelButton;
