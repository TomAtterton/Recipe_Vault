import React from 'react';
import { View } from 'react-native';
import ImagePicker from '@/components/ImagePicker';
import { useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { fetchTextFromImage } from '../../../modules/expo-vision';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import NavBarButton from '@/components/buttons/NavBarButton';
import { stylesheet } from './imageDetection.style';
import { translate } from '@/core';
import { navigateToAddRecipe } from '@/navigation/helper';
import { generateRecipe } from '@/services/textRecognition';
import { Routes } from '@/navigation/Routes';
import { checkIfPro } from '@/services/pro';

const ImageDetection = () => {
  const [image, setImage] = useState<string | undefined | null>(null);

  const [parsedRecipe, setParsedRecipe] = useState<any | null>(null);
  const { styles } = useStyles(stylesheet);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleGenerateAI = async () => {
    try {
      setIsLoading(true);

      const isPro = await checkIfPro();

      if (!isPro) {
        navigation.navigate(Routes.ProPlan);
        return;
      }

      if (!parsedRecipe) {
        const removeFilePrefix = image?.replace('file:/', '');
        const { text } = await fetchTextFromImage(removeFilePrefix!);
        const data = await generateRecipe(text);
        setParsedRecipe(data);
        showSuccessMessage(translate('image_detection.success'));
        return navigateToAddRecipe({
          navigation,
          params: { data, isNested: true },
          shouldReplace: true,
        });
      }

      navigateToAddRecipe({
        navigation,
        params: { data: parsedRecipe, isNested: true },
        shouldReplace: true,
      });
    } catch (error) {
      showErrorMessage(translate('image_detection.error'));
      console.log('Error detecting text from image', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRecipeTextInputContainer = async () => {
    try {
      setIsLoading(true);
      const removeFilePrefix = image?.replace('file:/', '');

      const { blocks } = await fetchTextFromImage(removeFilePrefix!);

      if (!blocks || blocks.length === 0 || !image) {
        throw new Error('No text detected from image');
      }
      return navigation.navigate(Routes.RecipeDetectionStack, {
        screen: Routes.ImageTextSelection,
        params: { imageUri: image, blocks },
      });
    } catch (error) {
      showErrorMessage(translate('image_detection.error'));
      console.log('Error detecting text from image', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImagePicker
        style={styles.imageContainer}
        imageUri={image}
        onSelectImage={setImage}
        isTemporary={true}
      />
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title={translate('image_detection.generate')}
          onPress={handleRecipeTextInputContainer}
          isLoading={isLoading}
          disabled={!image}
        />
        <PrimaryButton
          title={translate('image_detection.generate_ai')}
          onPress={handleGenerateAI}
          isLoading={isLoading}
          disabled={!image}
        />
      </View>
      <NavBarButton
        style={styles.backButton}
        iconSource={'arrow-left'}
        onPress={navigation.goBack}
      />
    </View>
  );
};

export default ImageDetection;
