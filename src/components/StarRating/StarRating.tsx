import { Canvas, Group, Path } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';
import { SIZE_MARGIN, stylesheet } from '@/components/StarRating/starRating.style';
import { StyleProp, ViewStyle } from 'react-native';

const array = new Array(5).fill(0).map((_, i) => i);

export type Props = {
  style?: StyleProp<ViewStyle>;
  initialValue?: number;
  onChange: (rating: number) => void;
  padding?: number;
  disabled?: boolean;
};

const StarRating = ({ style, initialValue = 0, onChange, padding = 0, disabled }: Props) => {
  const selectedStarIndex = useSharedValue(initialValue);

  useEffect(() => {
    selectedStarIndex.value = initialValue;
  }, [initialValue, selectedStarIndex]);

  const { styles } = useStyles(stylesheet);
  const tap = Gesture.Tap().onEnd(({ x }) => {
    let index = Math.floor(x / SIZE_MARGIN);
    // Clamp the index between 0 and 4 because we add 1 before calling onChange
    index = Math.max(0, Math.min(index, 4));
    selectedStarIndex.value = index + 1;
    runOnJS(onChange)(selectedStarIndex.value);
  });

  const pan = Gesture.Pan()
    .onChange(({ x }) => {
      let index = Math.floor(x / SIZE_MARGIN);
      // Clamp the index between 0 and 4 to keep within 0 to 5 range when adding 1
      index = Math.max(0, Math.min(index, 4));
      selectedStarIndex.value = index === 0 ? index : index + 1;
    })
    .onEnd(() => {
      runOnJS(onChange)(selectedStarIndex.value);
    });

  const gestures = Gesture.Race(tap, pan);
  const containerWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(containerWidth.value > 0 ? 1 : 0, { duration: 200 }),
      transform: [
        {
          translateX: containerWidth.value / 2 - 20 - (SIZE_MARGIN * 5) / 2,
        },
      ],
    };
  }, [selectedStarIndex, containerWidth]);
  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={animatedStyle} pointerEvents={disabled ? 'none' : 'box-none'}>
        <Canvas
          style={[
            styles.container,
            style,
            {
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onLayout={(e) => {
            containerWidth.value = e.nativeEvent.layout.width + padding;
          }}
        >
          {array.map((i) => {
            return (
              <Group key={i} transform={[{ translateX: SIZE_MARGIN * i }]}>
                <Star index={i} selectedStarIndex={selectedStarIndex} />
              </Group>
            );
          })}
        </Canvas>
      </Animated.View>
    </GestureDetector>
  );
};

const Star = ({ index, selectedStarIndex }: { index: number; selectedStarIndex: any }) => {
  const {
    theme: { colors },
  } = useStyles();

  const color = useDerivedValue(() =>
    selectedStarIndex.value <= index ? colors.onBackground : colors.primary
  );

  return (
    <Path
      path="M12.2037 7.21067C13.893 4.18133 14.737 2.66667 15.9997 2.66667C17.2623 2.66667 18.1063 4.18133 19.7957 7.21067L20.233 7.99467C20.713 8.856 20.953 9.28667 21.3263 9.57067C21.6997 9.85467 22.1663 9.96 23.0997 10.1707L23.9477 10.3627C27.2277 11.1053 28.8663 11.476 29.257 12.7307C29.6463 13.984 28.529 15.292 26.293 17.9067L25.7143 18.5827C25.0797 19.3253 24.761 19.6973 24.6183 20.156C24.4757 20.616 24.5237 21.112 24.6197 22.1027L24.7077 23.0053C25.045 26.4947 25.2143 28.2387 24.193 29.0133C23.1717 29.7893 21.6357 29.0813 18.5663 27.668L17.7703 27.3027C16.8983 26.9 16.4623 26.7 15.9997 26.7C15.537 26.7 15.101 26.9 14.229 27.3027L13.4343 27.668C10.3637 29.0813 8.82766 29.788 7.80766 29.0147C6.785 28.2387 6.95433 26.4947 7.29166 23.0053L7.37966 22.104C7.47566 21.112 7.52366 20.616 7.37966 20.1573C7.23833 19.6973 6.91966 19.3253 6.285 18.584L5.70633 17.9067C3.47033 15.2933 2.353 13.9853 2.74233 12.7307C3.133 11.476 4.773 11.104 8.053 10.3627L8.901 10.1707C9.833 9.96 10.2983 9.85467 10.673 9.57067C11.0463 9.28667 11.2863 8.856 11.7663 7.99467L12.2037 7.21067Z"
      color={color}
    />
  );
};

export default StarRating;
