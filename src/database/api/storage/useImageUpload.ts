import { supabase } from '@/database/supabase';
import { useBoundStore } from '@/store';
import { Env } from '@/core/env';

const onImageUpload = async (uri?: string | null) => {
  try {
    const shouldSync = useBoundStore.getState().shouldSync;

    if (!shouldSync) {
      // TODO potentially we just return base64 here
      return uri;
    }

    if (!uri || uri.includes('https')) {
      return uri;
    }
    const formData = new FormData();

    const imageType = uri.split('.')[1];

    // @ts-ignore
    formData.append('file', {
      uri: uri,
      name: `image.${imageType}`,
      type: `image/${imageType}`,
    });
    const filePath = `${Math.random()}.${imageType}`;

    const { error, data } = await supabase.storage
      .from('photos/recipes')
      .upload(filePath, formData);
    if (error) {
      throw error;
    }
    //
    return Env.SUPABASE_STORAGE_URL + data?.path;
  } catch (error) {
    console.log('image error', error);
  }
};

export default onImageUpload;
