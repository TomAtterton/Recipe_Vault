import React from 'react';
import useUpdateCategories from '@/hooks/recipe/useUpdateCategories';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import ChipInput from '@/components/inputs/ChipInput';

interface Props {
  control: controlType;
}

const ControlledCategoryContainer = ({ control }: Props) => {
  const { data: categories, onUpdateCategory, onDeleteCategory } = useUpdateCategories();

  return (
    <ChipInput
      control={control}
      name={'recipeCategory' as controlNameType}
      title={'Recipe Categories'}
      currentData={categories}
      onUpdate={onUpdateCategory}
      onDelete={onDeleteCategory}
    />
  );
};

export default ControlledCategoryContainer;
