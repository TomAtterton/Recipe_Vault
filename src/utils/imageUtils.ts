import {
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { showErrorMessage } from '@/utils/promptUtils';
import RNImageCropPicker, { Options, Image, PickerErrorCode } from 'react-native-image-crop-picker';

const DEFAULT_IMAGE_SIZE = 300 * 3;

const defaultImageOptions: Options = {
  mediaType: 'photo',
  cropping: true,
  multiple: false,
  compressImageQuality: 0.8,
  width: DEFAULT_IMAGE_SIZE,
  height: DEFAULT_IMAGE_SIZE,
};

export const onPickImageFromLibrary = async () => {
  try {
    let result: Image = await RNImageCropPicker.openPicker(defaultImageOptions);
    return await handleResult(result);
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

export const onOpenImageCropper = async (imageUri: string) => {
  try {
    const result = await RNImageCropPicker.openCropper({
      ...defaultImageOptions,
      path: imageUri,
    });
    return await handleResult(result);
  } catch (e) {
    return imageUri;
  }
};

export const onPickImageFromCamera = async () => {
  try {
    let result: Image = await RNImageCropPicker.openCamera(defaultImageOptions);
    return await handleResult(result);
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

const handleResult = async (result: Image) => {
  try {
    const uri = result?.path;

    return handleManipulationResult(uri);
  } catch (e) {
    throw new Error('Setting image failed');
  }
};

const handleManipulationResult = async (imageUri: string) => {
  const imageManipulationResult = await ImageManipulator.manipulateAsync(imageUri, [], {
    format: ImageManipulator.SaveFormat.WEBP,
  });
  return imageManipulationResult?.uri;
};
