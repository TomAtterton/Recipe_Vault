import {
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
  getMediaLibraryPermissionsAsync,
  getCameraPermissionsAsync,
} from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { showErrorMessage } from '@/utils/promptUtils';
import { cropImage } from '../../modules/expo-image-cropper';
import { UIImagePickerPreferredAssetRepresentationMode } from 'expo-image-picker/src/ImagePicker.types';
import { useBoundStore } from '@/store';
import { translate } from '@/core';

const defaultImageOptions: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsMultipleSelection: false,
  quality: 1,
  preferredAssetRepresentationMode: UIImagePickerPreferredAssetRepresentationMode.Current,
};

const handlePermissions = async (permissionRequest: () => Promise<any>, errorMessage: string) => {
  try {
    await permissionRequest();
  } catch (e) {
    console.log('Error requesting permissions', e);
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
      return await handleManipulationResult(filePath, height, width, isTemporary);
    }

    return base64Image;
  } else {
    throw new Error(translate('image_picker.no_image_selected'));
  }
};

export const onOpenImageCropper = async (imageUri: string, isTemporary: boolean) => {
  try {
    const { filePath } = await cropImage({ uri: imageUri, options: { isTemporary } });
    return handleResult(filePath);
  } catch (e) {
    console.log(translate('image_picker.error_cropping_image'), e);
    return imageUri;
  }
};

const checkAndRequestPermissions = async (
  requestPermission: () => Promise<any>,
  getPermission: () => Promise<any>,
  permissionMessage: string,
) => {
  const { status: existingStatus } = await getPermission();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await requestPermission();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    await handlePermissions(requestPermission, permissionMessage);
    return false;
  }

  return true;
};

export const onPickImageFromLibrary = async (isTemporary: boolean) => {
  try {
    const hasPermission = await checkAndRequestPermissions(
      requestMediaLibraryPermissionsAsync,
      getMediaLibraryPermissionsAsync,
      translate('image_picker.library_permission_denied'),
    );

    if (!hasPermission) return;

    const result = await launchImageLibraryAsync(defaultImageOptions);
    return await handleImageSelection(result, isTemporary);
  } catch (e: unknown) {
    const errorCode = (e as any)?.code;
    if (errorCode === 'E_PICKER_CANCELLED' || !errorCode) {
      return;
    }
    showErrorMessage(translate('image_picker.error_picking_image'));
  }
};

export const onPickImageFromCamera = async (isTemporary: boolean) => {
  try {
    const hasPermission = await checkAndRequestPermissions(
      requestCameraPermissionsAsync,
      getCameraPermissionsAsync,
      translate('image_picker.camera_permission_denied'),
    );

    if (!hasPermission) return;

    const result = await launchCameraAsync(defaultImageOptions);
    return await handleImageSelection(result, isTemporary);
  } catch (e: unknown) {
    const errorCode = (e as any)?.code;
    if (errorCode === 'E_PICKER_CANCELLED' || !errorCode) {
      return;
    }
    showErrorMessage(translate('image_picker.error_picking_image'));
  }
};
const handleResult = async (result: ImagePickerResult | string) => {
  try {
    if (typeof result === 'string') {
      return result;
    }
    return result?.assets?.[0].uri || '';
  } catch (e) {
    console.log(translate('image_picker.error_setting_image'), e);
    throw new Error(translate('image_picker.error_setting_image'));
  }
};

const handleManipulationResult = async (
  imageUri: string,
  height: number,
  width: number,
  isTemporary: boolean,
) => {
  if (isTemporary) {
    return imageUri;
  }

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
    },
  );

  return imageManipulationResult?.uri;
};
