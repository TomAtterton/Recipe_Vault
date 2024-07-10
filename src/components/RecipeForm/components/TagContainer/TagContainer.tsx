import * as React from 'react';
import useUpdateTags from '@/hooks/recipe/useUpdateTags';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import ChipInput from '@/components/inputs/ChipInput';

interface Props {
  control: controlType;
}

const TagContainer = ({ control }: Props) => {
  const { data: tags, onUpdateTags, onDeleteTags } = useUpdateTags();

  return (
    <ChipInput
      control={control}
      name={'recipeTags' as controlNameType}
      title={'Recipe Tags'}
      currentData={tags}
      onUpdate={onUpdateTags}
      onDelete={onDeleteTags}
    />
  );
};

export default TagContainer;
