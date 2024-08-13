import Animated, {
  interpolate,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Input from '@/components/inputs';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Pressable, TextInput, useWindowDimensions, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import OutlineButton from '@/components/buttons/OutlineButton';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Typography from '@/components/Typography';
import { stylesheet } from './floatingInput.style';
import IconButton from '@/components/buttons/IconButton';
import { translate } from '@/core';
import { FloatingInputOptions } from '@/providers/FloatingInputProvider';

const BOTTOM_ACTION_BAR_HEIGHT = 50 + 20;
const MIN_HEIGHT = 120;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FloatingInput = ({
  placeholder,
  description,
  initialValue,
  multiline,
  onDismiss,
  onSubmit,
  onRemove,
  shouldFocus,
}: FloatingInputOptions & {
  shouldFocus: boolean;
}) => {
  const { height: screenHeight } = useWindowDimensions();

  const maxHeightTextInput = useMemo(() => screenHeight / 2.3, [screenHeight]);
  const maxHeight = useMemo(
    () => maxHeightTextInput + BOTTOM_ACTION_BAR_HEIGHT + 20,
    [maxHeightTextInput]
  );

  const { state, height } = useAnimatedKeyboard();
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = useState(initialValue);

  const { styles } = useStyles(stylesheet);
  const animatedMinHeight = useSharedValue(MIN_HEIGHT);
  const initialHeight = useSharedValue(0);
  const animatedMaxHeight = useSharedValue(maxHeight);

  const handleReset = () => {
    Keyboard.dismiss();
    setText('');
    setIsFocused(false);
    animatedMinHeight.value = MIN_HEIGHT;
    animatedMaxHeight.value = maxHeight;
    initialHeight.value = 0;
  };

  const handleDismiss = () => {
    onDismiss && onDismiss(!!text);
    handleReset();
  };

  const handleSubmit = () => {
    const trimmedText = text?.trim();
    onSubmit && onSubmit(trimmedText || '');
    Keyboard.dismiss();
  };

  useEffect(() => {
    setText(initialValue || '');

    if (shouldFocus) {
      setIsFocused(true);
      inputRef.current?.focus();
    }
  }, [initialValue, shouldFocus]);

  const animatedStyle = useAnimatedStyle(() => {
    const value = interpolate(
      state.value,
      [0, 1, 2, 3, 4],
      [MIN_HEIGHT, -height.value, -height.value, MIN_HEIGHT, MIN_HEIGHT]
    );
    const opacity = interpolate(state.value, [0, 1, 2, 3, 4], [0, 1, 1, 0, 0]);
    return {
      transform: [
        {
          translateY: value,
        },
      ],
      opacity,
      minHeight: animatedMinHeight.value,
      maxHeight: animatedMaxHeight.value,
    };
  });
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(state.value, [0, 1, 2, 3, 4], [0, 0.5, 0.5, 0, 0]),
  }));

  const flingGestureUp = Gesture.Fling()
    .enabled(!!multiline)
    .direction(Directions.UP)
    .onEnd(() => {
      animatedMinHeight.value = withTiming(maxHeight);
    });

  const flingGestureDown = Gesture.Fling()
    .enabled(!!multiline)
    .direction(Directions.DOWN)
    .onEnd(() => {
      const maxHeightValue =
        initialHeight.value > maxHeight / 1.5 ? initialHeight.value - 100 : maxHeight;

      animatedMinHeight.value = withTiming(MIN_HEIGHT);
      animatedMaxHeight.value = withTiming(maxHeightValue);
    });

  const contentBottom = useMemo(() => (isFocused ? 0 : -screenHeight), [isFocused, screenHeight]);

  const gestures = Gesture.Simultaneous(flingGestureUp, flingGestureDown);

  return (
    <>
      {isFocused && (
        <AnimatedPressable onPress={handleDismiss} style={[styles.backdrop, backdropStyle]} />
      )}
      <GestureDetector gesture={gestures}>
        <Animated.View
          style={[
            {
              bottom: contentBottom,
            },
            styles.contentContainer,
            animatedStyle,
          ]}
        >
          <View style={styles.indicatorContainer}>
            <View style={styles.indicator} />
          </View>
          <View style={styles.inputContainer}>
            <Input
              ref={inputRef}
              placeholder={placeholder}
              multiline={true}
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
              onLayout={(event) => {
                const { height: layoutHeight } = event.nativeEvent.layout;
                initialHeight.value = layoutHeight;
              }}
              style={[
                styles.textInput,
                {
                  maxHeight: maxHeightTextInput,
                },
              ]}
              onBlur={() => {
                handleDismiss();
              }}
            />
            {description && (
              <Typography variant={'bodySmallItalic'} style={styles.description}>
                {description}
              </Typography>
            )}
          </View>
          <View style={styles.actionBarContainer}>
            {onRemove && (
              <IconButton
                iconSource={'bin'}
                onPress={() => {
                  onRemove && onRemove();
                  handleReset();
                }}
                style={styles.deleteButton}
              />
            )}
            <OutlineButton
              title={translate('floating_input.button')}
              onPress={handleSubmit}
              disabled={text?.length === 0}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default FloatingInput;
