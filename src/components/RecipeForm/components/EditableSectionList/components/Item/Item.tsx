import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { RenderItemParams } from 'react-native-draggable-flatlist';

import DraggableItem, { stylesheet } from './DraggableItem';
import { DraggableListItem } from '@/utils/recipeFormUtil';
import { useStyles } from 'react-native-unistyles';

const Item = ({
  item: { id, type, title: sectionTitle, text: value },
  drag,
  isActive,
  onUpdateValue,
  onRemoveValue,
  isDraggable,
  onEdit,
}: RenderItemParams<DraggableListItem> & {
  isDraggable: boolean;
  isIngredient: boolean;
  onUpdateValue: (item: DraggableListItem) => void;
  onRemoveValue: (item: DraggableListItem) => void;
  onEdit?: (
    value: string,
    onChange: (value: string) => void,
    onRemove?: () => void,
    onDismiss?: () => void
  ) => void;
}) => {
  const isSection = useMemo(() => type === 'section', [type]);
  const { styles } = useStyles(stylesheet);

  const handleRemove = useCallback(() => {
    onRemoveValue && onRemoveValue({ id, type, title: sectionTitle, text: value });
  }, [id, onRemoveValue, sectionTitle, type, value]);
  return (
    <View style={styles.container}>
      <DraggableItem
        title={sectionTitle}
        note={value}
        startEditing={() => {
          onEdit &&
            onEdit(
              value,
              (text: string) => {
                if (value === '' || value === undefined) {
                  if (text === '' || text === undefined) {
                    handleRemove();
                  }
                }
                if (text === '') return;
                if (text === value) return;
                onUpdateValue({
                  id,
                  type,
                  title: isSection ? text : sectionTitle,
                  text: isSection ? '' : text,
                });
              },
              handleRemove,
              handleRemove
            );
        }}
        isActive={isActive}
        isSection={isSection}
        isDraggable={isDraggable}
        drag={drag}
        onRemove={handleRemove}
      />
    </View>
  );
};

export default Item;
