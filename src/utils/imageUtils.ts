import {
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { showErrorMessage } from '@/utils/promptUtils';
import { cropImage } from '../../modules/expo-image-cropper';

const defaultImageOptions: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsMultipleSelection: false,
  quality: 0.8,
};

export const onOpenImageCropper = async (imageUri: string, isTemporary: boolean) => {
  try {
    const { filePath } = await cropImage({ uri: imageUri, options: { isTemporary } });
    return handleResult(filePath);
  } catch (e) {
    return imageUri;
  }
};

export const onPickImageFromLibrary = async (isTemporary: boolean) => {
  try {
    let result = await launchImageLibraryAsync(defaultImageOptions);
    const imagePath = await handleResult(result);

    if (imagePath) {
      const { filePath } = await cropImage({ uri: imagePath, options: { isTemporary } });
      return filePath;
    } else {
      throw new Error('No image selected');
    }
  } catch (e: unknown) {
    // @ts-ignore
    const errorCode = e?.code as PickerErrorCode;
    if (errorCode === 'E_NO_LIBRARY_PERMISSION') {
      try {
        await requestMediaLibraryPermissionsAsync();
      } catch (_) {
        showErrorMessage('Permission to access library was denied please enable in settings');
      }
    }
    if (errorCode === 'E_PICKER_CANCELLED') {
      return;
    }
    showErrorMessage('Error picking image');
  }
};

export const onPickImageFromCamera = async (isTemporary: boolean) => {
  try {
    const result = await launchCameraAsync();

    const imagePath = await handleResult(result);

    if (imagePath) {
      const { filePath } = await cropImage({ uri: imagePath, options: { isTemporary } });
      return filePath;
    } else {
      throw new Error('No image selected');
    }
  } catch (e: unknown) {
    // @ts-ignore
    const errorCode = e?.code as PickerErrorCode;
    console.log('error code', errorCode);
    if (errorCode === 'E_NO_CAMERA_PERMISSION') {
      try {
        await requestCameraPermissionsAsync();
      } catch (_) {
        showErrorMessage('Permission to access camera was denied please enable in settings');
      }
    }
    if (errorCode === 'E_PICKER_CANCELLED') {
      return;
    }
    showErrorMessage('Error picking image');
  }
};

const handleResult = async (result: ImagePickerResult | string) => {
  try {
    if (typeof result === 'string') {
      return await handleManipulationResult(result);
    }

    const uri = result?.assets?.[0].uri || '';
    return await handleManipulationResult(uri);
  } catch (e) {
    throw new Error('Setting image failed');
  }
};

const handleManipulationResult = async (imageUri: string) => {
  const imageManipulationResult = await ImageManipulator.manipulateAsync(imageUri, [], {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.WEBP,
  });
  return imageManipulationResult?.uri;
};
