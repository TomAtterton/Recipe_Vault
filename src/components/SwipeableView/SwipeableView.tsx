import { Animated, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { useStyles } from 'react-native-unistyles';
import Icon from '@/components/Icon';
import { IconName } from '@/components/Icon/types';

const BUTTON_WIDTH = 180;

type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

interface Props {
  style?: StyleProp<ViewStyle>;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  children: React.ReactNode;
}

const SwipeableView = ({ style, onSwipeRight, onSwipeLeft, children }: Props) => {
  const {
    theme: { colors },
  } = useStyles();

  const renderRightActions = useCallback(
    (progress: AnimatedInterpolation) => {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.errorContainer,
          }}
        >
          <SwipeButton
            progress={progress}
            rowWidth={BUTTON_WIDTH}
            backgroundColor={colors.errorContainer}
            icon={'bin'}
          />
        </View>
      );
    },
    [colors.errorContainer]
  );

  const renderLeftActions = useCallback(
    (progress: AnimatedInterpolation) => {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.errorContainer,
          }}
        >
          <SwipeButton
            progress={progress}
            rowWidth={BUTTON_WIDTH}
            backgroundColor={colors.primary}
            icon={'pencil-add'}
            isLeft={true}
          />
        </View>
      );
    },
    [colors.errorContainer, colors.primary]
  );
  const swipeRef = React.useRef<Swipeable>(null);
  return (
    <Swipeable
      ref={swipeRef}
      overshootLeft={false}
      overshootRight={false}
      containerStyle={style}
      friction={1}
      enableTrackpadTwoFingerGesture={true}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          onSwipeLeft && onSwipeLeft();
          swipeRef.current?.close();
        }
        if (direction === 'right') {
          onSwipeRight && onSwipeRight();
        }
      }}
      renderRightActions={onSwipeRight && renderRightActions}
      renderLeftActions={onSwipeLeft && renderLeftActions}
    >
      {children}
    </Swipeable>
  );
};

interface SwipeButtonProps {
  progress: AnimatedInterpolation;
  rowWidth: number;
  backgroundColor: string;
  icon: IconName;
  isLeft?: boolean;
}

const SwipeButton = ({ progress, rowWidth, backgroundColor, icon, isLeft }: SwipeButtonProps) => {
  const screenWidth = SCREEN_WIDTH;
  const outputRange = isLeft ? [-screenWidth, 0] : [screenWidth, 0];

  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: outputRange,
  });

  return (
    <Animated.View
      style={[
        styles.swipeButtonContainer,
        {
          backgroundColor: backgroundColor,
          alignItems: isLeft ? 'flex-end' : 'flex-start',
          transform: [{ translateX: trans }],
        },
      ]}
    >
      <RectButton
        style={[
          styles.swipeButton,
          {
            backgroundColor,
            width: rowWidth,
            alignItems: isLeft ? 'flex-end' : 'flex-start',
            paddingLeft: isLeft ? 0 : 16,
            paddingRight: isLeft ? 16 : 0,
          },
        ]}
        onPress={() => {}}
      >
        <Icon size={24} name={icon} color={'white'} />
      </RectButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeButtonContainer: {
    flex: 1,
  },
  swipeButton: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SwipeableView;
