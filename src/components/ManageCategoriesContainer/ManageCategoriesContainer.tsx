import React from 'react';
import ChipList from '@/components/ChipList';
import useUpdateCategories from '@/hooks/recipe/useUpdateCategories';
import { BottomSheetRef } from '@/components/BottomSheet';

interface Props {
  manageCategoriesRef: React.RefObject<BottomSheetRef>;
}

const ManageCategoriesContainer = ({ manageCategoriesRef }: Props) => {
  const { data: categories, onUpdateCategory, onDeleteCategory } = useUpdateCategories();

  const alphabeticallySortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ChipList
      hideSelection={true}
      chipListRef={manageCategoriesRef}
      data={alphabeticallySortedCategories}
      onDelete={onDeleteCategory}
      onUpdate={onUpdateCategory}
    />
  );
};

export default ManageCategoriesContainer;
