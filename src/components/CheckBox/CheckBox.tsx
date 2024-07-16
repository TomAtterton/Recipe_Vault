import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import Typography from '@/components/Typography';
import React from 'react';
import { stylesheet } from '@/components/CheckBox/checkBox.style';
import { useStyles } from 'react-native-unistyles';
import SquircleDynamicContainer from '@/components/SquircleDynamicContainer';

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

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <SquircleDynamicContainer height={size} showBorder={true} color={theme.colors.onBackground}>
        <View
          style={{
            height: size,
            width: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: selectedSize,
              width: selectedSize,
              borderRadius: selectedSize / 2,
              backgroundColor: isSelected ? theme.colors.primary : 'transparent',
            }}
          />
        </View>
      </SquircleDynamicContainer>
      {!!label && (
        <Typography style={styles.title} variant="titleMedium" numberOfLines={1}>
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;
