import LiveImagePicker from 'src/components/LiveImagePicker';

import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoom } from 'src/components/ImageZoom';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useBoundStore } from '@/store';
import useHandleCopyPaste from './hooks/useHandleCopyPaste';
import useHandleForm from './hooks/useHandleForm';
import { useStyles } from 'react-native-unistyles';
import FormInput from '@/components/inputs/FormInput';
import LabelButton from '@/components/buttons/LabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import IconButton from '@/components/buttons/IconButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import { translate } from '@/core';
import { stylesheet } from './scanImageContent.style';

const ScanImageContainer = () => {
  const {
    params: { id, value: currentValue, formId, isEditing },
  } = useRoute<RouteProp<Routes.ScanImageContent>>();
  const [value, setValue] = useState<string>(currentValue);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const { styles } = useStyles(stylesheet);

  const { height } = useWindowDimensions();

  const translateY = useSharedValue(height * 2);
  const { top } = useSafeAreaInsets();

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

  const { goBack } = useNavigation();

  const handleInputLayout = useCallback(() => {
    // When the input size (textarea) changes, it updates the keyboard position.
    KeyboardManager.reloadLayoutIfNeeded();
  }, []);
  useKeyboardForm();

  useEffect(() => {
    if (showFullScreen) {
      translateY.value = 0;
    } else {
      translateY.value = height * 2;
    }
  }, [height, showFullScreen, top, translateY]);

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

  const isSaveEnabled = value?.trim()?.length > 0;

  return (
    <>
      <View style={styles.container}>
        <LiveImagePicker onFullScreen={() => setShowFullScreen(true)} />
        <FormInput
          value={value}
          onLayout={handleInputLayout}
          onChange={handleChangeText}
          multiline
          scrollEnabled={true}
          containerStyle={styles.input}
        />
        <PrimaryButton
          style={styles.saveButton}
          onPress={handleSave}
          title={'Save'}
          disabled={!isSaveEnabled}
        />
        <LabelButton onPress={goBack} title={translate('default.cancel')} />
      </View>
      <Animated.View style={[styles.imageZoomContainer, animatedStyles]}>
        {!!image && <ImageZoom uri={image} minScale={1} maxScale={2} />}
        <IconButton
          style={styles.close}
          iconSource={'close'}
          onPress={() => setShowFullScreen(false)}
        />
      </Animated.View>
    </>
  );
};

export default ScanImageContainer;
