import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import Item from './components/Item/Item';
import { stylesheet } from './editableSectionList.style';
import useEditSectionList from './hooks/useEditSectionList';
import { useController, useFieldArray } from 'react-hook-form';
import {
  controlNameType,
  controlType,
  DraggableListItem,
  RecipeFormType,
} from '@/utils/recipeFormUtil';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import ListButton from '@/components/buttons/ListButton';
import ScanButton from './components/ScanButton';

interface Props {
  control: controlType;
  name: controlNameType;
  type: 'ingredient' | 'instruction';
  title: string;
  onScanLiveText?: (id: keyof RecipeFormType, value: string) => void;
  onEdit?: (
    value: string,
    onChange: (value: string) => void,
    onRemove?: () => void,
    onDismiss?: () => void
  ) => void;
}

const keyExtractor = (item: DraggableListItem, index: number) => item?.id + index;

const EditableSectionList = ({ onEdit, control, name, title, type, onScanLiveText }: Props) => {
  const { fieldState } = useController({ control, name });

  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: name,
  });

  // console.log('TEST fields', fields);

  const fieldValue = useMemo(() => {
    return fields as DraggableListItem[];
  }, [fields]);

  const { isIngredient, onAddItem, onAddSectionItem } = useEditSectionList({
    type,
    onAppend: append,
    onEdit,
  });

  const errorMessage = useMemo(() => {
    if (fieldState?.error) {
      // @ts-ignore
      return fieldState.error?.message || fieldState.error?.find((_) => _?.text).text?.message;
    }
    return '';
  }, [fieldState.error]);

  const handleEdit = useCallback(
    (item: DraggableListItem, index: number | undefined) => {
      const isSection = item.type === 'section';
      onEdit &&
        onEdit(
          (isSection ? item.title : item.text) || '',
          (value) => {
            update(index || 0, {
              ...item,
              text: isSection ? '' : value,
              title: isSection ? value : '',
            });
          },
          () => remove(index),
          () => {}
        );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldValue, onEdit]
  );

  const handleRenderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<DraggableListItem>) => (
      <Item item={item} drag={drag} isActive={isActive} onEdit={handleEdit} getIndex={getIndex} />
    ),
    [handleEdit]
  );

  const onDragEnd = useCallback(
    ({ from, to }: { from: number; to: number }) => {
      move(from, to);
    },
    [move]
  );

  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Typography style={styles.title} variant="titleLarge">
            {title}
          </Typography>
          <ScanButton onScanLiveText={onScanLiveText} name={name} itemState={fieldValue} />
        </View>

        <NestableDraggableFlatList
          keyExtractor={keyExtractor}
          style={styles.listContainer}
          containerStyle={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
          keyboardShouldPersistTaps={'always'}
          activationDistance={50}
          autoscrollThreshold={100}
          data={fieldValue}
          onDragEnd={onDragEnd}
          renderItem={handleRenderItem}
        />
      </View>
      {!!errorMessage && (
        <Typography
          variant={'titleSmall'}
          style={{
            color: colors.error,
          }}
        >
          {errorMessage}
        </Typography>
      )}
      <View style={styles.listButtonContainer}>
        <ListButton
          iconSource={'add-outline'}
          title={isIngredient ? 'ingredient' : 'instruction'}
          onPress={onAddItem}
        />
        <ListButton iconSource={'add-outline'} title={'section'} onPress={onAddSectionItem} />
      </View>
    </>
  );
};

export default EditableSectionList;
