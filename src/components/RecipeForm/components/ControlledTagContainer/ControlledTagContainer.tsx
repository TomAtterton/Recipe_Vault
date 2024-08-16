import * as React from 'react';
import useUpdateTags from '@/hooks/recipe/useUpdateTags';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import ChipInput from '@/components/inputs/ChipInput';
import { memo } from 'react';

interface Props {
  control: controlType;
}

const ControlledTagContainer = ({ control }: Props) => {
  const { data: tags, onUpdateTags } = useUpdateTags();

  return (
    <ChipInput
      control={control}
      name={'recipeTags' as controlNameType}
      title={'Recipe Tags'}
      currentData={tags}
      onUpdate={onUpdateTags}
    />
  );
};

export default memo(ControlledTagContainer);
