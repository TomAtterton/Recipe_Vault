import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Typography from '@/components/Typography';
import React from 'react';
import { stylesheet } from '@/components/CheckBox/checkBox.style';
import { useStyles } from 'react-native-unistyles';
import SquircleContainer from 'src/components/SquircleContainer';
import { Squircle } from '@/components/SquircleContainer/SquircleContainer';

interface Props {
  style?: StyleProp<ViewStyle>;
  size?: number;
  label?: string;
  isSelected: boolean;
  onPress: () => void;
}

const SIZE = 40;

const CheckBox = ({ style, size = SIZE, label, isSelected, onPress }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const selectedSize = size * 0.5;
  const selectedXY = size / 2 - selectedSize / 2.1;

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <SquircleContainer width={size} height={size} showBorder={true}>
        <Squircle
          width={selectedSize}
          height={selectedSize}
          showBorder={false}
          cornerRadius={selectedSize / 4}
          x={selectedXY}
          y={selectedXY}
          color={isSelected ? theme.colors.primary : 'transparent'}
        />
      </SquircleContainer>
      {!!label && (
        <Typography style={styles.title} variant="titleMedium" numberOfLines={1}>
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;
