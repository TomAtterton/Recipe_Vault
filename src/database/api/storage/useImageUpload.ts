import { useBoundStore } from '@/store';
import { uploadImage } from '@/services/image';

const onImageUpload = async (uri?: string | null, previousUri?: string | null) => {
  try {
    const shouldSync = useBoundStore.getState().shouldSync;

    if (!shouldSync) {
      return uri;
    }

    if (!uri || uri.includes('https')) {
      return uri;
    }

    return await uploadImage(uri, previousUri);
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

export default onImageUpload;
