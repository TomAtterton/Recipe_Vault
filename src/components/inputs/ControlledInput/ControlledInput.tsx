import * as React from 'react';
import { useController } from 'react-hook-form';

import { memo, useCallback } from 'react';
import { controlNameType, controlType, RecipeFormType } from '@/utils/recipeFormUtil';
import FormInput from '@/components/inputs/FormInput';
import { TextInputProps } from 'react-native';

interface ControlledInputProps extends TextInputProps {
  control: controlType;
  name: controlNameType;
  label?: string;
  onScanLiveText?: (name: keyof RecipeFormType, value: string) => void;
  onEdit?: (value: string, onChange?: (value: string) => void, onRemove?: () => void) => void;
}

const ControlledInput = ({ name, onEdit, control, ...inputProps }: ControlledInputProps) => {
  const { field, fieldState } = useController({ control, name });
  const handleChange = useCallback(
    (e: string) => {
      field?.onChange && field.onChange(e);
    },
    [field]
  );
  return (
    <FormInput
      pointerEvents={'none'}
      errorMessage={fieldState.error?.message}
      onEdit={onEdit}
      name={field.name}
      // @ts-ignore
      value={field?.value || ''}
      // @ts-ignore
      onChange={handleChange}
      {...inputProps}
    />
  );
};

export default memo(ControlledInput);
