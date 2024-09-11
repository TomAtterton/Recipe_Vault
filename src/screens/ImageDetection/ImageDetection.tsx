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
import { generateRecipe } from '@/services/textRecognition';
import { navigateToAddRecipe } from '@/navigation/helper';
import { translate } from '@/core';

const ImageDetection = () => {
  const [image, setImage] = useState<string | undefined | null>(null);
  const [parsedRecipe, setParsedRecipe] = useState<any | null>(null);
  const { styles } = useStyles(stylesheet);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleDetect = async () => {
    try {
      setIsLoading(true);
      if (!parsedRecipe) {
        const removeFilePrefix = image?.replace('file:/', '');
        const result = await fetchTextFromImage(removeFilePrefix!);
        const data = await generateRecipe(result);

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
          onPress={handleDetect}
          isLoading={isLoading}
          disabled={!image}
        />
        {parsedRecipe && (
          <PrimaryButton
            title={translate('default.continue')}
            onPress={handleDetect}
            isLoading={isLoading}
            disabled={!image}
          />
        )}
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
