import { TextInputProps, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { stylesheet } from './checkBoxInput.style';
import { useStyles } from 'react-native-unistyles';
import FormInput from '@/components/inputs/FormInput';
import CheckBox from '@/components/CheckBox';

interface Props extends Omit<TextInputProps, 'onChange'> {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  onPressInput?: () => void;
  multiline?: boolean;
}

const CheckBoxInput = ({ label, isSelected, onPress, onPressInput, ...props }: Props) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <CheckBox style={styles.checkbox} isSelected={isSelected} onPress={onPress} />
      <TouchableOpacity style={styles.contentContainer} onPress={onPressInput}>
        <FormInput
          pointerEvents={'none'}
          containerStyle={styles.inputContainer}
          value={label}
          multiline={true}
          maxLength={150}
          {...props}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CheckBoxInput;
