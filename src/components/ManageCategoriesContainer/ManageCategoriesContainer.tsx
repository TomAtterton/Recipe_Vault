import React from 'react';
import ChipList from '@/components/ChipList';
import useUpdateCategories from '@/hooks/recipe/useUpdateCategories';
import { BottomSheetRef } from '@/components/BottomSheet';

interface Props {
  manageCategoriesRef: React.RefObject<BottomSheetRef>;
}

const ManageCategoriesContainer = ({ manageCategoriesRef }: Props) => {
  const { data: categories, onUpdateCategory, onDeleteCategory } = useUpdateCategories();

  return (
    <ChipList
      hideSelection={true}
      chipListRef={manageCategoriesRef}
      data={categories}
      onDelete={onDeleteCategory}
      onUpdate={onUpdateCategory}
    />
  );
};

export default ManageCategoriesContainer;
