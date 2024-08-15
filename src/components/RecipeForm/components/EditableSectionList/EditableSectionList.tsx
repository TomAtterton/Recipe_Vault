import React, { useCallback } from 'react';
import { View } from 'react-native';
import Item from './components/Item/Item';
import { stylesheet } from './editableSectionList.style';
import useEditSectionList from './hooks/useEditSectionList';
import { useFieldArray } from 'react-hook-form';
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
import DraggableFlatList, { RenderItemParams } from '@/components/DraggableFlatList';

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
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name,
  });

  const { isIngredient, onAddItem, onAddSectionItem } = useEditSectionList({
    type,
    onAppend: append,
    onEdit,
  });

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
    [onEdit, remove, update]
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

  const { styles } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Typography style={styles.title} variant="titleLarge">
            {title}
          </Typography>
          <ScanButton
            onScanLiveText={onScanLiveText}
            name={name}
            itemState={fields as DraggableListItem[]}
          />
        </View>

        {fields && fields.length > 0 && (
          <DraggableFlatList
            keyExtractor={keyExtractor}
            style={styles.listContainer}
            containerStyle={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            keyboardShouldPersistTaps={'always'}
            activationDistance={50}
            autoscrollThreshold={100}
            data={fields as DraggableListItem[]}
            onDragEnd={onDragEnd}
            renderItem={handleRenderItem}
          />
        )}
      </View>
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
