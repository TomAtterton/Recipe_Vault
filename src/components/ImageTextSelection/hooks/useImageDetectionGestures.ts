import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { BoundingBox } from '@/components/ImageTextSelection/types';

interface Props {
  isSelecting: SharedValue<number>;
  scaledBlock: BoundingBox[];
}

const useImageDetectionGestures = ({ isSelecting, scaledBlock }: Props) => {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const boundingBoxX = useSharedValue(0);
  const boundingBoxY = useSharedValue(0);
  const boundingBoxWidth = useSharedValue(0);
  const boundingBoxHeight = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      if (isSelecting.value !== 1) {
        return;
      }
      if (startX.value !== 0 || startY.value !== 0) {
        return;
      }
      startX.value = e.x;
      startY.value = e.y;
      boundingBoxX.value = e.x;
      boundingBoxY.value = e.y;
      boundingBoxWidth.value = 0;
      boundingBoxHeight.value = 0;
    })
    .onUpdate((e) => {
      if (isSelecting.value !== 1) {
        return;
      }
      boundingBoxX.value = Math.min(startX.value, e.x);
      boundingBoxY.value = Math.min(startY.value, e.y);
      boundingBoxWidth.value = Math.abs(e.x - startX.value);
      boundingBoxHeight.value = Math.abs(e.y - startY.value);
    });

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const x = e.x;
    const y = e.y;

    const selected = scaledBlock.filter((block) => {
      const blockX = block.x;
      const blockY = block.y;
      const blockWidth = block.width;
      const blockHeight = block.height;
      if (x >= blockX && x <= blockX + blockWidth && y >= blockY && y <= blockY + blockHeight) {
        return true;
      }
    });

    if (selected.length === 1) {
      isSelecting.value = 1;
      startX.value = selected[0].x - 5;
      startY.value = selected[0].y - 5;
      boundingBoxX.value = selected[0].x - 5;
      boundingBoxY.value = selected[0].y - 5;
      boundingBoxWidth.value = selected[0].width + 10;
      boundingBoxHeight.value = selected[0].height + 10;
    }

    if (selected.length === 0) {
      isSelecting.value = 0;
      startX.value = 0;
      startY.value = 0;
      boundingBoxX.value = 0;
      boundingBoxY.value = 0;
      boundingBoxWidth.value = 0;
      boundingBoxHeight.value = 0;
    }
  });

  const handleResetBoundingBox = () => {
    isSelecting.value = 0;
    startX.value = 0;
    startY.value = 0;
    boundingBoxX.value = 0;
    boundingBoxY.value = 0;
    boundingBoxWidth.value = 0;
    boundingBoxHeight.value = 0;
  };

  return {
    panGesture,
    tapGesture,
    handleResetBoundingBox,
    startX,
    startY,
    boundingBoxX,
    boundingBoxY,
    boundingBoxWidth,
    boundingBoxHeight,
  };
};

export { useImageDetectionGestures };
