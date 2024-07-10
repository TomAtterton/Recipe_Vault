import Animated, {
  interpolate,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Input from '@/components/inputs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, Pressable, StyleProp, TextInput, View, ViewStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import OutlineButton from '@/components/buttons/OutlineButton';
import {
  Directions,
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import KeyboardManager from 'react-native-keyboard-manager';
import { useFocusEffect } from '@react-navigation/native';
import Typography from '@/components/Typography';
import { stylesheet } from './floatingInput.style';
import IconButton from '@/components/buttons/IconButton';

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onSubmit: (text: string) => void;
  onDismiss?: (containsValue?: boolean) => void;
  placeholder?: string;
  shouldFocus?: boolean;
  description?: string;
  initialValue?: string;
  multiline?: boolean;
  onRemove?: () => void;
}

const BOTTOM_ACTION_BAR_HEIGHT = 50 + 20;
const MIN_HEIGHT = 120;
const maxHeightTextInput = SCREEN_HEIGHT / 2.3;
const maxHeight = maxHeightTextInput + BOTTOM_ACTION_BAR_HEIGHT + 20;

const FloatingInput = ({
  style,
  placeholder,
  description,
  initialValue,
  onDismiss,
  shouldFocus,
  children,
  onSubmit,
  multiline,
  onRemove,
}: Props) => {
  const { state, height } = useAnimatedKeyboard();
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = useState('');

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

  const handleAdd = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    const trimmedText = text.trim();
    onSubmit(trimmedText);
    Keyboard.dismiss();
  };

  useFocusEffect(
    useCallback(() => {
      KeyboardManager?.setEnable(false);
      KeyboardManager.setEnableAutoToolbar(false);
      // KeyboardManager.resignFirstResponder();
      KeyboardManager.setShouldResignOnTouchOutside(false);
    }, [])
  );

  useEffect(() => {
    initialValue && setText(initialValue);
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

  const contentBottom = useMemo(() => (isFocused ? 0 : -SCREEN_HEIGHT), [isFocused]);

  const gestures = Gesture.Simultaneous(flingGestureUp, flingGestureDown);

  return (
    <>
      <Pressable onPress={handleAdd} style={style}>
        <View pointerEvents={'none'}>{children}</View>
      </Pressable>
      {isFocused && (
        <Animated.View pointerEvents="box-none" style={[styles.backdrop, backdropStyle]}>
          <TouchableWithoutFeedback onPress={handleDismiss} />
        </Animated.View>
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
              multiline={multiline}
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
            <OutlineButton title={'send'} onPress={handleSubmit} disabled={text?.length === 0} />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default FloatingInput;
