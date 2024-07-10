import { BottomSheetFlatList, BottomSheetModal, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Alert, ScrollView, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useController } from 'react-hook-form';
import { controlNameType, controlType, RecipeFormType } from '@/utils/recipeFormUtil';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './chipInput.style';
import ChipListHeader from './ChipListHeader';
import ChipItem from '@/components/inputs/ChipInput/ChipItem';
import Typography from '@/components/Typography';
import BottomSheet from '@/components/BottomSheet';

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

function keyExtractor(item: ChipItemType) {
  return `select-item-${item?.id}`;
}

const height = Math.min(SCREEN_HEIGHT * 0.8);

const ChipInput = ({ style, control, name, title, currentData, onUpdate, onDelete }: Props) => {
  const { field } = useController({ control, name });
  const chipListRef = useRef<BottomSheetModal>(null);

  const openCategories = useCallback(() => chipListRef.current?.present(), []);

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
  const snapPoints = useMemo(() => [height], []);

  const { styles } = useStyles(stylesheet);

  const handleDelete = useCallback(
    (item: ChipItemType) => {
      Alert.alert(
        `Delete ${item.name}`,
        `\nAre you sure ?\n\n This will remove it from all recipes.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'OK', style: 'destructive', onPress: () => onDelete(item) },
        ]
      );
    },
    [onDelete]
  );

  const renderSelectItem = useCallback(
    ({ item }: { item: ChipItemType }) => {
      return (
        <ChipItem
          item={item}
          selectedItems={fieldValues}
          onSelectItem={handleSelect}
          onDeleteItem={handleDelete}
        />
      );
    },
    [fieldValues, handleSelect, handleDelete]
  );

  const onRenderCategoryHeader = useCallback(
    () => <ChipListHeader itemsRef={chipListRef} items={currentData} onUpdateItem={onUpdate} />,
    [currentData, onUpdate]
  );

  const values = useMemo(() => {
    return fieldValues?.map((_: ChipItemType) => _.name) || [];
  }, [fieldValues]);

  return (
    <View style={style}>
      <TouchableOpacity style={styles.contentContainer} onPress={openCategories}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
        </ScrollView>
      </TouchableOpacity>
      <BottomSheet bottomSheetRef={chipListRef} snapPoints={snapPoints}>
        <BottomSheetFlatList
          ListHeaderComponent={onRenderCategoryHeader}
          data={currentData}
          keyExtractor={keyExtractor}
          renderItem={renderSelectItem}
          style={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
        />
      </BottomSheet>
    </View>
  );
};
export default ChipInput;
