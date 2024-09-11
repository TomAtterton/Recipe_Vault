import { useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { translate } from '@/core';

interface Props {
  onCallback: () => void;
  setValue: (value: string) => void;
  value: string;
  formId: keyof RecipeFormType;
}

const useHandleCopyPaste = ({ onCallback, setValue, value, formId }: Props) => {
  useEffect(() => {
    let listener = Clipboard.addClipboardListener(async () => {
      const content = await Clipboard.getStringAsync();
      onCallback();
      Alert.alert(translate('prompt.copy.title'), translate('prompt.copy.message'), [
        {
          text: translate('prompt.copy.button'),
          onPress: () => handleContent(content, formId, setValue),
          style: 'default',
        },
        {
          text: translate('prompt.copy.add_existing'),
          onPress: () => handleAddContent(content, value, setValue),
          style: 'default',
        },
        {
          text: translate('default.dismiss'),
          onPress: () => {},
          style: 'cancel',
        },
      ]);
    });

    return () => {
      listener.remove();
    };
  }, [formId, onCallback, setValue, value]);
};

const handleContent = (
  content: string,
  formId: keyof RecipeFormType,
  setValue: (value: string) => void,
) => {
  switch (formId) {
    case 'title':
      setValue(content);
      break;
    case 'recipeInstructions':
    case 'recipeIngredient':
      const newContent = formatContent(content);
      setValue(newContent);
      break;
  }
};

const handleAddContent = (content: string, value: string, setValue: (value: string) => void) => {
  const newContent = formatContent(content);
  setValue(`${value}\n${newContent}`);
};

const formatContent = (content: string) => {
  return content
    .split('\n')
    .filter((line) => line)
    .map((line) =>
      line
        .replace(/•/g, '')
        .replace(/^\d+\./g, '')
        .trim(),
    )
    .join('\n');
};

export default useHandleCopyPaste;
