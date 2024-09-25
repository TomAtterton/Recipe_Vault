import {
  BoundingBox,
  BoundingBoxColors,
  FieldSelection,
  ScaledBlock,
  SelectedBox,
} from '@/components/ImageTextSelection/types';
import { SharedValue } from 'react-native-reanimated';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  scaledBlock: ScaledBlock[];
  boundingBoxX: SharedValue<number>;
  boundingBoxY: SharedValue<number>;
  boundingBoxWidth: SharedValue<number>;
  boundingBoxHeight: SharedValue<number>;
  selectedBoundingBoxColors: BoundingBoxColors;
  setSelectedBlocks: Dispatch<SetStateAction<SelectedBox[]>>;
  currentSelection: FieldSelection | undefined;
  setCurrentSelection: (value: FieldSelection | undefined) => void;
  handleResetBoundingBox: () => void;
}

const useHandleSelection = ({
  scaledBlock,
  boundingBoxX,
  boundingBoxY,
  boundingBoxWidth,
  boundingBoxHeight,
  selectedBoundingBoxColors,
  setSelectedBlocks,
  currentSelection,
  setCurrentSelection,
  handleResetBoundingBox,
}: Props) => {
  const handleCancel = () => {
    handleResetBoundingBox();
    setCurrentSelection(undefined);
  };

  const handleAdd = () => {
    const selected = scaledBlock.filter((block) =>
      isBlockInsideBoundingBox(block, {
        x: boundingBoxX.value,
        y: boundingBoxY.value,
        width: boundingBoxWidth.value,
        height: boundingBoxHeight.value,
      }),
    );

    if (currentSelection && selected.length !== 0) {
      // @ts-ignore
      setSelectedBlocks((prev) => {
        const existingIndex = prev.findIndex((block) => block.title === currentSelection);

        if (existingIndex !== -1) {
          // If the title exists, append the new bounding boxes to the existing entry
          const updatedBlocks = [...prev];
          updatedBlocks[existingIndex] = {
            ...updatedBlocks[existingIndex],
            boundingBoxes: [
              ...updatedBlocks[existingIndex].boundingBoxes,
              ...selected.map((block) => ({
                color: selectedBoundingBoxColors[currentSelection],
                text: block.text,
                x: block.x,
                y: block.y,
                width: block.width,
                height: block.height,
              })),
            ],
          };
          return updatedBlocks;
        } else {
          return [
            ...prev,
            {
              title: currentSelection as string,
              color: selectedBoundingBoxColors[currentSelection],
              boundingBoxes: selected.map((block) => ({
                text: block.text,
                x: block.x,
                y: block.y,
                width: block.width,
                height: block.height,
              })),
            },
          ];
        }
      });
    }

    setCurrentSelection(undefined);
    handleResetBoundingBox();
  };

  const isBlockInsideBoundingBox = (blockBox: ScaledBlock, selectionBox: BoundingBox) => {
    return !(
      blockBox.x > selectionBox.x + selectionBox.width ||
      blockBox.x + blockBox.width < selectionBox.x ||
      blockBox.y > selectionBox.y + selectionBox.height ||
      blockBox.y + blockBox.height < selectionBox.y
    );
  };

  return {
    handleCancel,
    handleAdd,
  };
};

export default useHandleSelection;
