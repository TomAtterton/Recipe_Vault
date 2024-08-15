// src/utils/imageUtils.ts

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
import { UIImagePickerPreferredAssetRepresentationMode } from 'expo-image-picker/src/ImagePicker.types';
import { useBoundStore } from '@/store';

const defaultImageOptions: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsMultipleSelection: false,
  quality: 0.8,
  preferredAssetRepresentationMode: UIImagePickerPreferredAssetRepresentationMode.Current,
};

const handlePermissions = async (permissionRequest: () => Promise<any>, errorMessage: string) => {
  try {
    await permissionRequest();
  } catch (_) {
    showErrorMessage(errorMessage);
  }
};

const handleImageSelection = async (result: ImagePickerResult | string, isTemporary: boolean) => {
  const imagePath = await handleResult(result);
  if (imagePath) {
    const { filePath, base64Image, height, width } = await cropImage({
      uri: imagePath,
      options: { isTemporary },
    });
    const shouldSync = useBoundStore.getState().shouldSync;

    if (shouldSync) {
      return await handleManipulationResult(filePath, height, width);
    }

    return base64Image;
  } else {
    throw new Error('No image selected');
  }
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
    const result = await launchImageLibraryAsync(defaultImageOptions);
    return await handleImageSelection(result, isTemporary);
  } catch (e: unknown) {
    const errorCode = (e as any)?.code;
    if (errorCode === 'E_NO_LIBRARY_PERMISSION') {
      await handlePermissions(
        requestMediaLibraryPermissionsAsync,
        'Permission to access library was denied please enable in settings'
      );
    }
    if (errorCode === 'E_PICKER_CANCELLED' || !errorCode) {
      return;
    }
    showErrorMessage('Error picking image');
  }
};

export const onPickImageFromCamera = async (isTemporary: boolean) => {
  try {
    const result = await launchCameraAsync(defaultImageOptions);
    return await handleImageSelection(result, isTemporary);
  } catch (e: unknown) {
    const errorCode = (e as any)?.code;
    if (errorCode === 'E_NO_CAMERA_PERMISSION' || errorCode === 'ERR_MISSING_CAMERA_PERMISSION') {
      await handlePermissions(
        requestCameraPermissionsAsync,
        'Permission to access camera was denied please enable in settings'
      );
    }
    if (errorCode === 'E_PICKER_CANCELLED' || !errorCode) {
      return;
    }
    showErrorMessage('Error picking image');
  }
};

const handleResult = async (result: ImagePickerResult | string) => {
  try {
    if (typeof result === 'string') {
      return result;
    }
    return result?.assets?.[0].uri || '';
  } catch (e) {
    throw new Error('Setting image failed');
  }
};

const handleManipulationResult = async (imageUri: string, height: number, width: number) => {
  // Calculate aspect ratio
  const aspectRatio = width / height;
  let newWidth = width;
  let newHeight = height;

  // Determine new dimensions while maintaining aspect ratio
  if (width > 900 || height > 900) {
    if (width > height) {
      newWidth = 900;
      newHeight = 900 / aspectRatio;
    } else {
      newHeight = 900;
      newWidth = 900 * aspectRatio;
    }
  }

  // Resize the image
  const imageManipulationResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [
      {
        resize: {
          width: newWidth,
          height: newHeight,
        },
      },
    ],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.WEBP,
    }
  );

  return imageManipulationResult?.uri;
};
