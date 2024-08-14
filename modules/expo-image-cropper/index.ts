import ExpoImageCropperModule from './src/ExpoImageCropperModule';
import { CropOptions } from './src/ExpoImageCropper.types';

export interface CropImageOptions {
  uri: string;
  options?: CropOptions;
}

export interface CropImageResult {
  filePath: string;
  fileType: string;
  base64Image: string;
  width: number;
  height: number;
  angle: number;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const defaultOptions: CropOptions = {
  isTemporary: false,
};

export async function cropImage({ uri, options }: CropImageOptions): Promise<CropImageResult> {
  try {
    const response = await ExpoImageCropperModule.cropImage(uri, { ...defaultOptions, ...options });
    const { filePath } = response;

    if (filePath.includes('file:/')) {
      return response;
    } else {
      return {
        ...response,
        filePath: 'file:' + filePath,
      };
    }
  } catch (e) {
    console.log('Error cropping image', e);
    throw e;
  }
}
