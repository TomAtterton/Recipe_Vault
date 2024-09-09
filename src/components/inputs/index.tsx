import React, { forwardRef, useCallback, useState } from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { stylesheet } from './style';
import { useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '@/components/Icon';

interface Props extends TextInputProps {
  hideClear?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input = forwardRef<TextInput, Props>(
  ({ containerStyle, value, onChangeText, hideClear, onFocus, onBlur, ...inputProps }, ref) => {
    const {
      styles,
      theme: { colors },
    } = useStyles(stylesheet);

    const [isFocused, setIsFocused] = useState(false);
    const [shouldNotBlur, setShouldNotBlur] = useState(false);

    const handleClear = useCallback(() => {
      setShouldNotBlur(true);
      onChangeText && onChangeText('');
      setTimeout(() => {
        setShouldNotBlur(false);
      }, 500);
    }, [onChangeText]);
    const showClear = !hideClear && isFocused && value && value?.length > 0;

    const handleInputBlur = (e: any) => {
      if (shouldNotBlur) {
        setShouldNotBlur(false);
        // @ts-ignore
        ref?.current?.focus();
        return;
      }
      setIsFocused(false);
      onBlur && onBlur(e);
    };

    return (
      <View style={[styles.inputContainer, containerStyle]}>
        <TextInput
          ref={ref}
          selectionColor={colors.primary}
          placeholderTextColor={colors.placeholder}
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          onBlur={handleInputBlur}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          style={[styles.input, inputProps.style]}
        />
        {showClear && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Icon name={'close'} color={colors.primary} size={18} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

export default Input;
