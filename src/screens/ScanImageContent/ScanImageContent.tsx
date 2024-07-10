import LiveImagePicker from 'src/components/LiveImagePicker';

import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';

import styles from './scanImageContent.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoom } from 'src/components/ImageZoom';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { useBoundStore } from '@/store';
import useHandleCopyPaste from './hooks/useHandleCopyPaste';
import useHandleForm from './hooks/useHandleForm';
import { useStyles } from 'react-native-unistyles';
import FormInput from '@/components/inputs/FormInput';
import LabelButton from '@/components/buttons/LabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import IconButton from '@/components/buttons/IconButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';

const ScanImageContainer = () => {
  const {
    params: { id, value: currentValue, formId, isEditing },
  } = useRoute<RouteProp<Routes.ScanImageContent>>();
  const [value, setValue] = useState<string>(currentValue);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT * 2);
  const { top, bottom } = useSafeAreaInsets();

  const {
    theme: { colors },
  } = useStyles();

  const { handleSave } = useHandleForm({ id, formId, isEditing, value });

  useHandleCopyPaste({
    onCallback: () => {
      setShowFullScreen(false);
    },
    setValue,
    value,
    formId,
  });

  const handleChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const image = useBoundStore((state) => state.scannedImage);

  const navigation = useNavigation();

  const handleInputLayout = useCallback(() => {
    // When the input size (textarea) changes, it updates the keyboard position.
    KeyboardManager.reloadLayoutIfNeeded();
  }, []);
  useKeyboardForm();

  useEffect(() => {
    if (showFullScreen) {
      translateY.value = 0;
    } else {
      translateY.value = SCREEN_HEIGHT * 2;
    }
  }, [showFullScreen, top, translateY]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 400,
          }),
        },
      ],
    };
  });

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingBottom: bottom,
          },
        ]}
      >
        <LiveImagePicker onFullScreen={() => setShowFullScreen(true)} />
        <FormInput
          value={value}
          onLayout={handleInputLayout}
          onChange={handleChangeText}
          multiline
          scrollEnabled={true}
          containerStyle={{
            flex: 1,
          }}
        />
        <PrimaryButton
          style={{
            marginTop: 20,
          }}
          onPress={handleSave}
          title={'Save'}
        />
        <LabelButton onPress={navigation.goBack} title={'cancel'} />
      </View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: colors.background,
          },
          animatedStyles,
        ]}
      >
        {!!image && <ImageZoom uri={image} minScale={1} maxScale={2} />}
        <IconButton
          style={{
            position: 'absolute',
            right: 0,
            top: top + 20,
          }}
          iconSource={'close'}
          onPress={() => setShowFullScreen(false)}
        />
      </Animated.View>
    </>
  );
};

export default ScanImageContainer;
