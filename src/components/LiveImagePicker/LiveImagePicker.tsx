import React, { memo, useCallback } from 'react';
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
    [onFullScreen],
  );

  return (
    <ImagePicker
      onSelectImage={handleSelectedImage}
      onFullScreen={onFullScreen}
      imageUri={image}
      isTemporary={true}
    />
  );
};

export default memo(LiveImagePicker);
