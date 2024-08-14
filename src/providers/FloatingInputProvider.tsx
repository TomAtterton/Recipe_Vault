import React, { createContext, useState, useCallback, ReactNode, FunctionComponent } from 'react';
import FloatingInput from '@/components/FloatingInput';
import { useFocusEffect } from '@react-navigation/native';
import KeyboardManager from 'react-native-keyboard-manager';
import { TextInputProps } from 'react-native';

export interface FloatingInputOptions {
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  initialValue?: string;
  onSubmit?: (text: string) => void;
  onRemove?: () => void;
  onDismiss?: (containsValue?: boolean) => void;
  additionalInputProps?: TextInputProps;
}

interface FloatingInputContextProps {
  showInput: (options: FloatingInputOptions) => void;
}

const FloatingInputContext = createContext<FloatingInputContextProps | undefined>(undefined);

interface FloatingInputProviderProps {
  children: ReactNode;
}

const FloatingInputProvider: FunctionComponent<FloatingInputProviderProps> = ({ children }) => {
  const [inputState, setInputState] = useState<
    FloatingInputOptions & {
      shouldFocus: boolean;
    }
  >();

  const showInput = useCallback((options: FloatingInputOptions) => {
    setInputState({
      placeholder: options.placeholder,
      description: options.description,
      multiline: options.multiline,
      initialValue: options.initialValue || '',
      onSubmit: options.onSubmit,
      onRemove: options.onRemove,
      onDismiss: () => {
        options.onDismiss && options.onDismiss();
        setInputState((prevState) => ({ ...prevState, shouldFocus: false }));
      },
      additionalInputProps: options.additionalInputProps || {},
      shouldFocus: true,
    });
  }, []);

  return (
    <FloatingInputContext.Provider value={{ showInput }}>
      {children}
      <FloatingInput
        placeholder={inputState?.placeholder || ''}
        description={inputState?.description || ''}
        multiline={inputState?.multiline || true}
        initialValue={inputState?.initialValue || ''}
        shouldFocus={inputState?.shouldFocus || false}
        onSubmit={inputState?.onSubmit}
        onRemove={inputState?.onRemove}
        onDismiss={inputState?.onDismiss}
        additionalInputProps={inputState?.additionalInputProps}
      />
    </FloatingInputContext.Provider>
  );
};

export const useFloatingInput = () => {
  const context = React.useContext(FloatingInputContext);

  if (context === undefined) {
    throw new Error('useFloatingInput must be used within a FloatingInputProvider');
  }

  useFocusEffect(
    useCallback(() => {
      KeyboardManager?.setEnable(false);
      KeyboardManager.setEnableAutoToolbar(false);
      KeyboardManager.setShouldResignOnTouchOutside(false);
    }, [])
  );

  return context;
};

export { FloatingInputProvider, FloatingInputContext };
