import * as React from 'react';

import { StyleProp, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { controlNameType, RecipeFormType } from '@/utils/recipeFormUtil';
import { stylesheet } from './formInput.style';
import { useStyles } from 'react-native-unistyles';
import Input from '@/components/inputs';
import Typography from '@/components/Typography';
import IconButton from '@/components/buttons/IconButton';

// @ts-ignore
interface FormInputs extends TextInputProps {
  onChange?: (text: string) => void;
  name?: controlNameType;
  errorMessage?: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onScanLiveText?: (name: keyof RecipeFormType, value: string) => void;
  onEdit?: (value: string, onChange?: (value: string) => void, onRemove?: () => void) => void;
}

const FormInput = ({
  label,
  name,
  value,
  containerStyle,
  onChange,
  errorMessage,
  onScanLiveText,
  onBlur,
  onEdit,
  onFocus,
  ...inputProps
}: FormInputs) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlerScanLiveText = useCallback(
    // @ts-ignore
    () => onScanLiveText && onScanLiveText(name, value),
    [name, value, onScanLiveText]
  );

  const { styles, theme } = useStyles(stylesheet);
  const inputRef = React.useRef(null);
  const borderColor = useMemo(() => {
    if (isFocused) {
      return theme.colors.primary;
    }
    if (errorMessage) {
      return theme.colors.error;
    }
    return theme.colors.onBackground;
  }, [
    errorMessage,
    isFocused,
    theme.colors.error,
    theme.colors.onBackground,
    theme.colors.primary,
  ]);

  const handleEdit = useCallback(() => {
    onEdit && onEdit(value || '', onChange, () => onChange && onChange(''));
  }, [onChange, onEdit, value]);

  const ContainerView = useMemo(() => (onEdit ? TouchableOpacity : View), [onEdit]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/*// @ts-ignore*/}
      <ContainerView
        onPress={handleEdit}
        style={[
          styles.inputContainer,
          {
            borderColor,
            width: onScanLiveText ? '90%' : '100%',
          },
          containerStyle,
        ]}
      >
        <Input
          ref={inputRef}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.primary}
          autoCapitalize="sentences"
          onChangeText={onChange}
          value={value}
          placeholder={label}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          {...inputProps}
        />
      </ContainerView>
      {!!errorMessage && (
        <Typography variant={'titleSmall'} style={styles.error}>
          {errorMessage}
        </Typography>
      )}
      {!!onScanLiveText && (
        <IconButton style={styles.icon} iconSource={'camera'} onPress={handlerScanLiveText} />
      )}
    </View>
  );
};

export default FormInput;
