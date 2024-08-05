import ExpoVisionModule from './src/ExpoVisionModule';

export async function fetchTextFromImage(imagePath: string) {
  const imagePathWithoutFilePrefix = imagePath?.replace('file:/', '');
  return await ExpoVisionModule.fetchTextFromImage(imagePathWithoutFilePrefix);
}
