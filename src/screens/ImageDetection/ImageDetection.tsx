import React from 'react';
import { View } from 'react-native';
import ImagePicker from '@/components/ImagePicker';
import { useState } from 'react';
import { useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { fetchTextFromImage } from '../../../modules/expo-vision';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import NavBarButton from '@/components/buttons/NavBarButton';
import { stylesheet } from './imageDetection.style';
import { generateRecipe } from '@/services/textRecognition';

const ImageDetection = () => {
  const [image, setImage] = useState<string | undefined | null>(null);
  const [parsedRecipe, setParsedRecipe] = useState<any | null>(null);
  const { styles } = useStyles(stylesheet);

  const [isLoading, setIsLoading] = useState(false);

  const { navigate, goBack } = useNavigation();

  const handleDetect = async () => {
    try {
      setIsLoading(true);
      if (!parsedRecipe) {
        const removeFilePrefix = image?.replace('file:/', '');
        const result = await fetchTextFromImage(removeFilePrefix!);
        const data = await generateRecipe(result);

        setParsedRecipe(data);

        showSuccessMessage('Text detected from image');

        return navigate(Routes.RecipeDetectionStack, {
          screen: Routes.AddRecipe,
          params: {
            data,
            isNested: true,
          },
        });
      }

      navigate(Routes.RecipeDetectionStack, {
        screen: Routes.AddRecipe,
        params: {
          data: parsedRecipe,
          isNested: true,
        },
      });
    } catch (error) {
      showErrorMessage('Error detecting text from image');
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
          title={'Generate Recipe'}
          onPress={handleDetect}
          isLoading={isLoading}
          disabled={!image}
        />
        {parsedRecipe && (
          <PrimaryButton
            title={'Continue'}
            onPress={handleDetect}
            isLoading={isLoading}
            disabled={!image}
          />
        )}
      </View>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
    </View>
  );
};

export default ImageDetection;
