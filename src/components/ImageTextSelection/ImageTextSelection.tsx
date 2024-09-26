import React, { useMemo, useState } from 'react';
import { View, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Canvas, Image as SkiaImage, RoundedRect, useImage } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useImageDetectionGestures } from '@/components/ImageTextSelection/hooks/useImageDetectionGestures';
import useImageScaleGestures from '@/components/ImageTextSelection/hooks/useImageScaleGestures';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import {
  Block,
  BoundingBoxColors,
  FieldSelection,
  ScaledBlock,
  SelectedBox,
} from '@/components/ImageTextSelection/types';
import { useStyles } from 'react-native-unistyles';
import { useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import BackButton from '@/components/BackButton';
import { stylesheet } from '@/components/ImageTextSelection/imageTextSelection.style';
import { RecipeDetectionRouteProp } from '@/navigation/recipeDetectionNavigator';
import useHandleSubmit from '@/components/ImageTextSelection/hooks/useHandleSubmit';
import useHandleSelection from '@/components/ImageTextSelection/hooks/useHandleSelection';
import ChooseFieldFooter from '@/components/ImageTextSelection/components/ChooseFieldFooter';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import OutlineButton from '@/components/buttons/OutlineButton';
import { translate } from '@/core';

interface Props {
  imageUri?: string;
  blocks?: Block[];
}

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

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

  const [currentSelection, setCurrentSelection] = useState<FieldSelection | undefined>('title');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const handleRemove = (title: FieldSelection) => {
    setSelectedBlocks((prev) => prev.filter((_) => _.title !== title));
  };

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

  const { handleAdd } = useHandleSelection({
    scaledBlock,
    boundingBoxX,
    boundingBoxY,
    boundingBoxWidth,
    boundingBoxHeight,
    selectedBoundingBoxColors,
    setSelectedBlocks,
    currentSelection,
    handleResetBoundingBox,
  });

  const gestures = Gesture.Simultaneous(panImageGesture, pinchImageGesture, tapGesture, panGesture);

  const { handleSubmit } = useHandleSubmit(selectedBlocks);

  const animatedButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(isSelecting.value, [0, 1], [0, 1]);

    return {
      transform: [
        { translateX: boundingBoxX.value + boundingBoxWidth.value - 30 }, // Move the button to the right of the bounding box
        { translateY: boundingBoxY.value + boundingBoxHeight.value + 5 }, // Align it vertically with the bounding box
      ],

      opacity,
    };
  });

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
        <AnimatedButton style={[animatedButtonStyle, styles.selectionButton]} onPress={handleAdd}>
          <Icon name={'pencil-add'} size={18} color={'white'} />
        </AnimatedButton>
      </Animated.View>
      <ChooseFieldFooter
        currentSelection={currentSelection}
        setCurrentSelection={setCurrentSelection}
        onRemoveSelected={handleRemove}
        selectedBoundingBoxColors={selectedBoundingBoxColors}
      />
      {showOnboarding && (
        <Animated.View style={styles.onboardingContainer}>
          <View style={styles.onboardingContent}>
            <Typography variant={'headlineMedium'} style={styles.onboardingText}>
              {translate('image_text_selection.onboarding_title')}
            </Typography>
            <Typography variant={'bodyMedium'} style={styles.onboardingText}>
              {translate('image_text_selection.onboarding_description')}
            </Typography>
            <OutlineButton
              title={translate('image_text_selection.onboarding_button')}
              onPress={() => setShowOnboarding(false)}
            />
          </View>
        </Animated.View>
      )}
      <OutlineButton
        style={styles.generateRecipeButton}
        title={translate('image_text_selection.generate_recipe')}
        onPress={handleSubmit}
      />
      <BackButton />
    </View>
  );
};

export default ImageTextSelection;
