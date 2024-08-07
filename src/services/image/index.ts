import { Cloudinary } from '@cloudinary/url-gen';
import { Env } from '@/core/env';
import { upload, UploadApiOptions } from 'cloudinary-react-native';
import { useBoundStore } from '@/store';
import { supabase } from '@/services';

export const uploadImage = async (
  filePath: string,
  previousUri?: string | null
): Promise<string | null> => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: Env.CLOUDINARY_KEY,
    },
    url: {
      secure: true,
    },
  });

  const profile = useBoundStore.getState().profile;

  const publicId = previousUri
    ? previousUri.split('/').pop()?.split('.')[0]
    : Math.random().toString();

  const defaultOptions: UploadApiOptions = {
    folder: `recipe-vault/${profile.groupId}/`,
    invalidate: true,
    overwrite: true,
    use_asset_folder_as_public_id_prefix: false,
  };

  const { data, error } = await supabase.functions.invoke('generate-image-signature', {
    body: JSON.stringify({ public_id: publicId, ...defaultOptions }),
  });

  if (error) {
    throw new Error('Error generating image signature');
  }

  if (!data?.signature) {
    throw new Error('Error generating image signature');
  }

  const options: UploadApiOptions = {
    ...defaultOptions,
    ...data,
  };

  return new Promise<string | null>((resolve, reject) => {
    // @ts-ignore
    upload(cld, {
      file: filePath,
      options: options,
      callback: (callBackError, response) => {
        if (callBackError || !response) {
          reject('Error uploading file');
        } else {
          resolve(response.secure_url);
        }
      },
    });
  });
};
