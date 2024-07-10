import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import Item from './components/Item/Item';
import { stylesheet } from './editableSectionList.style';
import useEditSectionList from './hooks/useEditSectionList';
import { useController } from 'react-hook-form';
import {
  controlNameType,
  controlType,
  DraggableListItem,
  RecipeFormType,
} from '@/utils/recipeFormUtil';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import ListButton from '@/components/buttons/ListButton';
import ScanButton from '@/components/RecipeForm/components/EditableSectionList/components/ScanButton';

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
  const { field, fieldState } = useController({ control, name });

  const fieldValue = useMemo(() => {
    return field.value as DraggableListItem[];
  }, [field.value]);

  const { isIngredient, addItem, addSection } = useEditSectionList({
    type,
    items: fieldValue,
    onUpdate: field.onChange,
  });

  const errorMessage = useMemo(() => {
    if (fieldState?.error) {
      // @ts-ignore
      return fieldState.error?.message || fieldState.error?.find((_) => _?.text).text?.message;
    }
    return '';
  }, [fieldState.error]);

  const onUpdateValue = useCallback(
    (item: DraggableListItem) => {
      field.onChange(
        fieldValue.map((_: any) => {
          return _.id === item.id ? item : _;
        }) || []
      );
    },
    [field, fieldValue]
  );

  const onRemoveValue = useCallback(
    (item: DraggableListItem) => {
      field.onChange(
        fieldValue.filter((_: any) => {
          return _.id !== item.id;
        })
      );
    },
    [field, fieldValue]
  );
  const handleRenderItem = useCallback(
    ({ item, drag, isActive, ...props }: RenderItemParams<DraggableListItem>) => (
      <Item
        isDraggable={true}
        item={item}
        onUpdateValue={onUpdateValue}
        onRemoveValue={onRemoveValue}
        drag={drag}
        onEdit={onEdit}
        isActive={isActive}
        isIngredient={isIngredient}
        {...props}
      />
    ),
    [onEdit, isIngredient, onRemoveValue, onUpdateValue]
  );

  const onDragEnd = useCallback(
    ({ data: movedData }: { data: DraggableListItem[] }) => field?.onChange(movedData),
    [field]
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
          onPress={addItem}
        />
        <ListButton iconSource={'add-outline'} title={'section'} onPress={addSection} />
      </View>
    </>
  );
};

export default EditableSectionList;
