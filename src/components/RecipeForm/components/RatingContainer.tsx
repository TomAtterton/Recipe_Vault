import React from 'react';
import { useController } from 'react-hook-form';
import { controlNameType, controlType, RecipeFormType } from '@/utils/recipeFormUtil';
import StarRating from '@/components/StarRating';

interface Props {
  control: controlType;
  name: controlNameType;
}

const RatingContainer = ({ control, name }: Props) => {
  const { field } = useController({ control, name });

  return (
    <StarRating
      padding={40}
      onChange={(e) => field.onChange(e)}
      initialValue={(field?.value as RecipeFormType['rating']) || 0}
    />
  );
};

export default RatingContainer;
