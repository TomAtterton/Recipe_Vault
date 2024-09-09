import { Env } from '@/core/env';
import { useBoundStore } from '@/store';
import { supabase } from '@/services';

const handleCloudinaryRequest = async (endpoint: string, formData: FormData) => {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${Env.CLOUDINARY_KEY}/${endpoint}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Cloudinary request failed: ${result.error?.message || 'Unknown error'}`);
  }

  return result;
};

export const uploadImage = async ({
  uri,
  recipeId,
}: {
  uri: string | null;
  recipeId: string;
}): Promise<string | null> => {
  try {
    const shouldSync = useBoundStore.getState().shouldSync;

    if (!shouldSync || !uri || uri.includes('https')) {
      return uri;
    }

    const groupId = useBoundStore.getState().profile.groupId;
    if (!groupId) {
      throw new Error('Group ID is missing.');
    }

    if (!recipeId) {
      throw new Error('Failed to generate or extract a public ID.');
    }

    const defaultOptions = {
      folder: `recipe-vault/${groupId}/`,
      eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
      invalidate: true,
      overwrite: true,
      use_asset_folder_as_public_id_prefix: false,
    };

    const { data, error } = await supabase.functions.invoke('generate-image-signature', {
      body: JSON.stringify({ public_id: recipeId, ...defaultOptions }),
    });

    if (error || !data?.signature) {
      throw new Error('Failed to generate image signature.');
    }

    const options = {
      ...defaultOptions,
      ...data,
      file: { uri, type: 'image/*', name: recipeId },
    };

    const formData = new FormData();

    Object.keys(options).forEach((key) => {
      formData.append(key, options[key as keyof typeof options]);
    });

    const result = await handleCloudinaryRequest('image/upload', formData);

    return result.secure_url;
  } catch (err) {
    console.error('Image upload failed:', err);
    throw new Error('Image upload failed. Please try again.');
  }
};

const extractPublicId = (url: string): string | null => {
  const regex = /recipe-vault\/[\w-]+\/[\w-]+/;
  const match = url.match(regex);

  return match ? match[0] : null;
};

export const deleteImage = async (recipeId: string, previousImage: string): Promise<void> => {
  try {
    const publicId = extractPublicId(previousImage);

    const { data, error } = await supabase.functions.invoke('generate-image-signature', {
      body: JSON.stringify({ public_id: publicId }),
    });

    if (error || !data?.signature) {
      throw new Error('Failed to generate image delete signature.');
    }

    const formData = new FormData();
    formData.append('public_id', recipeId);
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof typeof data]);
    });

    const result = await handleCloudinaryRequest('image/destroy', formData);

    console.log('Image deleted successfully:', result);
  } catch (err) {
    console.error('Image delete failed:', err);
    // Swallow error
  }
};
