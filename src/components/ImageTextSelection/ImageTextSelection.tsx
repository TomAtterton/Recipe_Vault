import React, { useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Canvas, Image as SkiaImage, RoundedRect, useImage } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useImageDetectionGestures } from '@/components/ImageTextSelection/hooks/useImageDetectionGestures';
import useImageScaleGestures from '@/components/ImageTextSelection/hooks/useImageScaleGestures';
import Animated, { useSharedValue } from 'react-native-reanimated';
import {
  Block,
  BoundingBoxColors,
  FieldSelection,
  ScaledBlock,
  SelectedBox,
} from '@/components/ImageTextSelection/types';
import { useStyles } from 'react-native-unistyles';
import ChooseFieldFooter from '@/components/ImageTextSelection/components/ChooseFieldFooter';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import BackButton from '@/components/BackButton';
import { stylesheet } from '@/components/ImageTextSelection/imageTextSelection.style';
import { RecipeDetectionRouteProp } from '@/navigation/recipeDetectionNavigator';
import useHandleSubmit from '@/components/ImageTextSelection/hooks/useHandleSubmit';
import useHandleSelection from '@/components/ImageTextSelection/hooks/useHandleSelection';

interface Props {
  imageUri?: string;
  blocks?: Block[];
}

const selectedBoundingBoxColors: BoundingBoxColors = {
  title: 'red',
  prepTime: 'green',
  cookTime: 'blue',
  servings: 'yellow',
  instructions: 'purple',
  ingredients: 'orange',
};

const ImageTextSelection = ({}: Props) => {
  const { params } = useRoute<RecipeDetectionRouteProp<Routes.ImageTextSelection>>();
  const { imageUri, blocks } = params || {};
  const isSelecting = useSharedValue(0);

  const { width } = useWindowDimensions();

  const skImage = useImage(imageUri);
  const imageWidth = useMemo(() => skImage?.width() || width, [skImage, width]);
  const imageHeight = useMemo(() => skImage?.height() || width, [skImage, width]);
  const scaledImageHeight = (imageHeight * width) / imageWidth;
  const scaleRatio = width / imageWidth;

  const [selectedBlocks, setSelectedBlocks] = useState<SelectedBox[]>([]);

  const { styles } = useStyles(stylesheet);

  const [currentSelection, setCurrentSelection] = useState<FieldSelection | undefined>(undefined);

  const {
    panGesture: panImageGesture,
    pinchGesture: pinchImageGesture,
    animatedStyle,
  } = useImageScaleGestures({ imageUri, isSelecting, scaledImageHeight });

  const scaledBlock = useMemo(
    () =>
      blocks.map(
        (block) =>
          ({
            x: block.boundingBox.x * scaleRatio,
            y: block.boundingBox.y * scaleRatio,
            width: block.boundingBox.width * scaleRatio,
            height: block.boundingBox.height * scaleRatio,
            text: block.text,
          }) as ScaledBlock,
      ),
    [blocks, scaleRatio],
  );

  const {
    tapGesture,
    panGesture,
    handleResetBoundingBox,
    boundingBoxX,
    boundingBoxY,
    boundingBoxWidth,
    boundingBoxHeight,
  } = useImageDetectionGestures({
    isSelecting,
    scaledBlock,
  });

  const { handleCancel, handleAdd } = useHandleSelection({
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
  });

  const gestures = Gesture.Simultaneous(panImageGesture, pinchImageGesture, tapGesture, panGesture);

  const { handleSubmit } = useHandleSubmit(selectedBlocks);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, animatedStyle]}>
        <GestureDetector gesture={gestures}>
          <Canvas
            style={{
              width: width,
              height: scaledImageHeight,
            }}
          >
            <SkiaImage
              fit="contain"
              image={skImage}
              x={0}
              y={0}
              width={width}
              height={scaledImageHeight}
            />
            <RoundedRect
              x={boundingBoxX}
              y={boundingBoxY}
              width={boundingBoxWidth}
              height={boundingBoxHeight}
              color="rgba(0, 0, 255, 0.1)"
              style="fill"
              r={5}
            />

            <RoundedRect
              x={boundingBoxX}
              y={boundingBoxY}
              width={boundingBoxWidth}
              height={boundingBoxHeight}
              color="rgba(0, 0, 255, 0.5)"
              style="stroke"
              strokeWidth={3}
              r={5}
            />
            {selectedBlocks.map((_) => {
              return _?.boundingBoxes.map((boundingBox, index) => {
                return (
                  <RoundedRect
                    key={index}
                    x={boundingBox.x}
                    y={boundingBox.y}
                    width={boundingBox.width}
                    height={boundingBox.height}
                    color={_.color}
                    opacity={0.5}
                    style="fill"
                    r={5}
                  />
                );
              });
            })}
          </Canvas>
        </GestureDetector>
      </Animated.View>
      <ChooseFieldFooter
        currentSelection={currentSelection}
        setCurrentSelection={setCurrentSelection}
        onCancel={handleCancel}
        onAdd={handleAdd}
        selectedBoundingBoxColors={selectedBoundingBoxColors}
        onGenerateRecipe={handleSubmit}
      />
      <BackButton />
    </View>
  );
};

export default ImageTextSelection;
