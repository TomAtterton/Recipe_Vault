import { useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { RecipeFormType } from '@/utils/recipeFormUtil';
import { translate } from '@/core';

let listener: any;

interface Props {
  onCallback: () => void;
  setValue: (value: string) => void;
  value: string;
  formId: keyof RecipeFormType;
}

const useHandleCopyPaste = ({ onCallback, setValue, value, formId }: Props) => {
  useEffect(() => {
    if (listener) {
      listener.remove();
    }
    listener = Clipboard.addClipboardListener(async () => {
      const content = await Clipboard.getStringAsync();
      onCallback();
      Alert.alert(translate('prompt.copy.title'), translate('prompt.copy.message'), [
        {
          text: translate('prompt.copy.button'),
          onPress: () => {
            switch (formId) {
              case 'title':
                setValue(content);
                break;
              case 'recipeInstructions':
              case 'recipeIngredient':
                const newContent = content
                  .split('\n')
                  .filter((_) => _)
                  .map((_) =>
                    _.replace(/•/g, '')
                      .replace(/^\d+\./g, '')
                      .trim()
                  )
                  .join('\n');
                setValue(`${newContent}`);
                break;
            }
          },
          style: 'default',
        },
        {
          text: 'Add to Existing Content',
          onPress: () => {
            const newContent = content
              .split('\n')
              .filter((_) => _)
              .map((_) =>
                _.replace(/•/g, '')
                  .replace(/^\d+\./g, '')
                  .trim()
              )
              .join('\n');

            setValue(`${value}\n${newContent}`);
          },
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

export default useHandleCopyPaste;
