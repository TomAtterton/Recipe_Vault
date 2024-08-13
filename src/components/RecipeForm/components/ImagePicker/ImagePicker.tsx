import React, { memo, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import ImagePicker from '@/components/ImagePicker';

interface Props {
  control: controlType;
  name: controlNameType;
}

const ControlledImagePicker = ({ control, name }: Props) => {
  const { field } = useController({ control, name });
  const handleSelectedImage = useCallback(
    (imageUri?: string | null) => {
      field.onChange(imageUri); // Update the field value
    },
    [field]
  );

  // @ts-ignore
  return <ImagePicker imageUri={field?.value} onSelectImage={handleSelectedImage} />;
};

export default memo(ControlledImagePicker);
