import React, { memo, useCallback } from 'react';
import { MediaTypeOptions } from 'expo-image-picker';
import { setScannedImage, useBoundStore } from '@/store';
import ImagePicker from '@/components/ImagePicker';

interface Props {
  onFullScreen?: () => void;
}

const LiveImagePicker = ({ onFullScreen }: Props) => {
  const image = useBoundStore((state) => state.scannedImage);

  const handleSelectedImage = useCallback(
    (imageUri?: string | null) => {
      setScannedImage(imageUri || '');
      if (imageUri) {
        onFullScreen?.();
      }
    },
    [onFullScreen]
  );

  return (
    <ImagePicker
      imagePickerOptions={{
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
      }}
      skipCropping
      onSelectImage={handleSelectedImage}
      onFullScreen={onFullScreen}
      imageUri={image}
    />
  );
};

export default memo(LiveImagePicker);
