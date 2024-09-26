import React, { useCallback, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { RouteProp } from '@/navigation/types';

import useHandleForm from './hooks/useHandleForm';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import FormInput from '@/components/inputs/FormInput';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import Typography from '@/components/Typography';
import CloseButton from '@/components/CloseButton';

const RecipeTextInputContainer = () => {
  const {
    params: { id, value: currentValue, formId, isEditing, isNested },
  } = useRoute<RouteProp<Routes.RecipeTextInputContainer>>();
  const [value, setValue] = useState<string>(currentValue);

  const { styles } = useStyles(stylesheet);

  const { handleSave } = useHandleForm({ id, formId, isEditing, isNested, value });

  const handleChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const { goBack } = useNavigation();

  const handleInputLayout = useCallback(() => {
    // When the input size changes, update the keyboard position.
    KeyboardManager.reloadLayoutIfNeeded();
  }, []);
  useKeyboardForm();

  const isSaveEnabled = value?.trim()?.length > 0;

  const placeholder =
    formId === 'recipeIngredient' ? 'Paste your ingredients here' : 'Paste your instructions here';
  const instructions =
    formId === 'recipeIngredient'
      ? 'Enter each ingredient on a new line. You can add sections by typing a section name followed by a colon.'
      : 'Enter each instruction step on a new line. You can add sections by typing a section name followed by a colon.';

  const formRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Typography variant={'bodyMediumItalic'} style={styles.instructions}>
        {instructions}
      </Typography>
      <FormInput
        formRef={formRef}
        value={value}
        onLayout={handleInputLayout}
        onChange={handleChangeText}
        multiline
        onEdit={() => {
          formRef.current?.focus();
        }}
        scrollEnabled={true}
        containerStyle={styles.input}
        placeholder={placeholder}
      />
      <PrimaryButton
        style={styles.saveButton}
        onPress={handleSave}
        title={'Save'}
        disabled={!isSaveEnabled}
      />
      <CloseButton onPress={goBack} />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: miniRuntime.insets.top + 60,
    paddingBottom: miniRuntime.insets.bottom,
  },
  instructions: {
    paddingBottom: 20,
    color: theme.colors.onBackground80,
  },
  input: {
    flex: 1,
  },
  saveButton: {
    marginVertical: 20,
  },
}));

export default RecipeTextInputContainer;
