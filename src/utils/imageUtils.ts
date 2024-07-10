import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
  ImagePickerOptions,
} from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { showErrorMessage } from '@/utils/promptUtils';

const DEFAULT_IMAGE_SIZE = 300 * 3;

const defaultImageOptions: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1,
  allowsMultipleSelection: false,
};

export const onPickImageFromLibrary = async ({
  imagePickerOptions,
  skipCropping,
}: {
  imagePickerOptions?: ImagePickerOptions;
  skipCropping?: boolean;
}) => {
  let result = await launchImageLibraryAsync(imagePickerOptions || defaultImageOptions);

  return await handleResult(result, skipCropping);
};

export const onPickImageFromCamera = async ({
  imagePickerOptions,
  skipCropping,
}: {
  imagePickerOptions?: ImagePickerOptions;
  skipCropping?: boolean;
}) => {
  const { status } = await getCameraPermissionsAsync();
  if (status !== 'granted') {
    const { status: requestStatus } = await requestCameraPermissionsAsync();
    if (requestStatus !== 'granted') {
      showErrorMessage('Permission to access camera was denied');
      return;
    }
  }
  let result = await launchCameraAsync(imagePickerOptions || defaultImageOptions);

  return await handleResult(result, skipCropping);
};

const handleResult = async (result: any, skipCropping?: boolean) => {
  if (result.canceled) {
    return undefined;
  }
  const uri = result?.assets[0].uri;

  return skipCropping ? uri : await handleCropping(uri);
};

const handleCropping = async (uri: string) => {
  try {
    const imageManipulationUri = await handleManipulationResult(uri);
    if (imageManipulationUri) {
      return imageManipulationUri as string;
    }
    throw new Error('Setting image failed');
  } catch (e) {
    console.log('image err', e);
    showErrorMessage('Error setting image');
    return undefined;
  }
};

const handleManipulationResult = async (imageUri: string) => {
  const imageManipulationResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { height: DEFAULT_IMAGE_SIZE, width: DEFAULT_IMAGE_SIZE } }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
  );
  return imageManipulationResult?.uri;
};
