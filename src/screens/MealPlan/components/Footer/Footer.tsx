import React from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './footer.style';
import IconButton from '@/components/buttons/IconButton';

interface Props {
  currentWeek: string;
  weekOffset: number;
  onWeekChange: (offset: number) => void;
}

const Footer = ({ currentWeek, weekOffset, onWeekChange }: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <BlurView
      tint="dark"
      style={[
        styles.container,
        {
          bottom: tabBarHeight,
        },
      ]}
    >
      <IconButton
        iconSource={'arrow-left'}
        iconSize={32}
        onPress={() => onWeekChange(weekOffset - 1)}
      />
      <Typography
        variant={'titleMedium'}
        style={{
          color: weekOffset === 0 ? colors.primary : colors.onBackground,
        }}
      >
        {currentWeek}
      </Typography>
      <IconButton
        iconSize={32}
        iconSource={'arrow-right'}
        onPress={() => onWeekChange(weekOffset + 1)}
      />
    </BlurView>
  );
};

export default Footer;
