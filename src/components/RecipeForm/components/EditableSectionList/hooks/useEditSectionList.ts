import { useMemo } from 'react';
import { randomUUID } from 'expo-crypto';
import { DraggableListItem } from '@/utils/recipeFormUtil';

const useEditSectionList = ({
  type,
  items,
  onUpdate,
}: {
  type: string;
  items: DraggableListItem[];
  onUpdate: (items: DraggableListItem[]) => void;
}) => {
  const isIngredient = useMemo(() => type === 'ingredient', [type]);

  const addItem = () => {
    const newItem: DraggableListItem = {
      title: null,
      id: randomUUID(),
      text: '',
      type: 'ingredient',
    };
    onUpdate([...items, newItem]);
  };

  const addSection = () => {
    const newSection: DraggableListItem = {
      id: randomUUID(),
      title: '',
      text: '',
      type: 'section',
    };

    onUpdate([...items, newSection]);
  };

  return {
    isIngredient,
    addItem,
    addSection,
  };
};

export default useEditSectionList;
