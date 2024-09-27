import ExpoVisionModule from './src/ExpoVisionModule';

export async function fetchTextFromImage(imagePath: string) {
  try {
    const imagePathWithoutFilePrefix = imagePath?.replace('file:/', '');
    const data = await ExpoVisionModule.fetchTextFromImage(imagePathWithoutFilePrefix);
    const blocks = data?.blocks || [];
    const text = data?.text || '';
    return { blocks, text };
  } catch (error) {
    console.log('Error fetching text from image', error);
    return { blocks: [], text: '' };
  }
}
