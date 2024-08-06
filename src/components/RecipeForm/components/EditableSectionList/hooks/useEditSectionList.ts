import { useMemo } from 'react';
import { randomUUID } from 'expo-crypto';
import { DraggableListItem } from '@/utils/recipeFormUtil';

const useEditSectionList = ({
  type,
  onAppend,
  onEdit,
}: {
  type: string;

  onAppend: (items: DraggableListItem[]) => void;
  onEdit?: (
    value: string,
    onChange: (value: string) => void,
    onRemove?: () => void,
    onDismiss?: () => void
  ) => void;
}) => {
  const isIngredient = useMemo(() => type === 'ingredient', [type]);

  const handleAddItem = () => {
    const newItem: DraggableListItem = {
      title: null,
      id: randomUUID(),
      text: '',
      type: 'ingredient',
    };
    onEdit &&
      onEdit('', (value) => {
        onAppend && onAppend([{ ...newItem, text: value }]);
      });
  };

  const handleAddSection = () => {
    const newSection: DraggableListItem = {
      id: randomUUID(),
      title: '',
      text: '',
      type: 'section',
    };

    onEdit &&
      onEdit(newSection.text, (value) => onAppend && onAppend([{ ...newSection, title: value }]));
  };

  return {
    isIngredient,
    onAddItem: handleAddItem,
    onAddSectionItem: handleAddSection,
  };
};

export default useEditSectionList;
