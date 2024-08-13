import React, { useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { useController } from 'react-hook-form';
import { controlNameType, controlType, RecipeFormType } from '@/utils/recipeFormUtil';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './chipInput.style';
import Typography from '@/components/Typography';
import { BottomSheetRef } from '@/components/BottomSheet';
import ChipList from '@/components/ChipList';

export type ChipItemType = {
  id: string;
  name?: string | null;
};

interface Props {
  style?: ViewStyle;
  currentData?: ChipItemType[] | null;
  title: string;
  onUpdate: (item: ChipItemType) => Promise<void>;
  onDelete: (item: ChipItemType) => Promise<void>;
  control: controlType;
  name: controlNameType;
}

const ChipInput = ({ style, control, name, title, currentData, onUpdate, onDelete }: Props) => {
  const { field } = useController({ control, name });
  const chipListRef = useRef<BottomSheetRef>(null);

  const openCategories = useCallback(() => chipListRef.current?.present(), []);

  const { styles } = useStyles(stylesheet);

  const fieldValues = useMemo(() => {
    return field.value as RecipeFormType['recipeIngredient'];
  }, [field.value]);

  const handleSelect = useCallback(
    (option: ChipItemType) => {
      const isSelected = fieldValues.some((_: ChipItemType) => _.id === option.id);
      if (isSelected) {
        const filtered = fieldValues.filter((_: ChipItemType) => _.id !== option.id);
        field.onChange(filtered);
      } else {
        field.onChange([...fieldValues, option]);
      }
    },
    [field, fieldValues]
  );

  const values = useMemo(() => {
    return fieldValues?.map((_: ChipItemType) => _.name) || [];
  }, [fieldValues]);

  return (
    <View style={style}>
      <TouchableOpacity style={styles.container} onPress={openCategories}>
        <View style={styles.contentContainer}>
          {values.length > 0 ? (
            values.map((value) => (
              <View style={styles.chipContainer} key={value}>
                <Typography style={styles.chipText} variant={'titleSmall'}>
                  {value}
                </Typography>
              </View>
            ))
          ) : (
            <Typography style={styles.inputTitle} variant={'titleSmall'}>
              {title}
            </Typography>
          )}
        </View>
      </TouchableOpacity>
      <ChipList
        chipListRef={chipListRef}
        selectedItems={fieldValues}
        data={currentData}
        onSelect={handleSelect}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </View>
  );
};
export default ChipInput;
