import React, { createContext, useState, useCallback, ReactNode, FunctionComponent } from 'react';
import FloatingInput from '@/components/FloatingInput';
import { useFocusEffect } from '@react-navigation/native';
import KeyboardManager from 'react-native-keyboard-manager';

export interface FloatingInputOptions {
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  initialValue?: string;
  onSubmit?: (text: string) => void;
  onRemove?: () => void;
  onDismiss?: (containsValue?: boolean) => void;
}

interface FloatingInputContextProps {
  showInput: (options: FloatingInputOptions) => void;
}

const FloatingInputContext = createContext<FloatingInputContextProps | undefined>(undefined);

interface FloatingInputProviderProps {
  children: ReactNode;
}

const FloatingInputProvider: FunctionComponent<FloatingInputProviderProps> = ({ children }) => {
  const [placeholder, setPlaceholder] = useState('');
  const [description, setDescription] = useState('');
  const [multiline, setMultiline] = useState(false);
  const [initialValue, setInitialValue] = useState('');
  const [onSubmit, setOnSubmit] = useState<(text: string) => void>(() => () => {});
  const [onDismiss, setOnDismiss] = useState<() => void>(() => {});
  const [onRemove, setOnRemove] = useState<() => void>(() => () => {});
  const [shouldFocus, setShouldFocus] = useState(false);

  const showInput = useCallback((options: FloatingInputOptions) => {
    setPlaceholder(options.placeholder || '');
    setDescription(options.description || '');
    setMultiline(options.multiline || false);
    setInitialValue(options.initialValue || '');
    setOnSubmit(() => options.onSubmit || (() => {}));
    setOnRemove(() => options.onRemove || (() => {}));
    setOnDismiss(() => () => {
      options.onDismiss && options.onDismiss();
      setShouldFocus(false);
    });
    setShouldFocus(true);
  }, []);

  return (
    <FloatingInputContext.Provider
      value={{
        showInput,
      }}
    >
      {children}
      <FloatingInput
        placeholder={placeholder}
        description={description}
        multiline={multiline}
        initialValue={initialValue}
        shouldFocus={shouldFocus}
        onSubmit={onSubmit}
        onRemove={onRemove}
        onDismiss={onDismiss}
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
      // KeyboardManager.resignFirstResponder();
      KeyboardManager.setShouldResignOnTouchOutside(false);
    }, [])
  );

  return context;
};

export { FloatingInputProvider, FloatingInputContext };
