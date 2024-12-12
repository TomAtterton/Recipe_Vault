import { useBoundStore } from '@/store';
import { supabase } from '@/services';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

// Helper to get the file path
const getFilePath = (groupId: string, recipeId: string) => `recipe-vault/${groupId}/${recipeId}`;

/**
 * Uploads an image to Supabase Storage.
 *
 * @param {Object} params
 * @param {string | null} params.uri - The URI of the local image file.
 * @param {string} params.recipeId - The unique identifier for the recipe.
 * @returns {Promise<string | null>} - Returns the public URL of the uploaded image or the original URI if conditions aren't met.
 */
export const uploadImage = async ({
  uri,
  recipeId,
}: {
  uri: string | null;
  recipeId: string;
}): Promise<string | null> => {
  try {
    const shouldSync = useBoundStore.getState().shouldSync;

    // If we don't need to sync, no uri provided, or uri is already a hosted URL, return it as is
    if (!shouldSync || !uri || uri.includes('https')) {
      return uri;
    }

    const groupId = useBoundStore.getState().profile.groupId;
    if (!groupId) {
      throw new Error('Group ID is missing.');
    }

    if (!recipeId) {
      throw new Error('Invalid recipe ID.');
    }

    const filePath = getFilePath(groupId, recipeId);

    // Read the file from the given URI and encode it as Base64
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // Use decode to convert Base64 string to ArrayBuffer
    const fileData = decode(base64Data);
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, fileData, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error('Image upload failed. Please try again.');
    }

    // Retrieve a public URL for the file
    const { data: publicData } = supabase.storage.from('photos').getPublicUrl(filePath);
    console.log('publicData', publicData);

    const publicUrl = publicData?.publicUrl + '?timestamp=' + new Date().getTime();

    return publicUrl || null;
  } catch (err) {
    console.error('Image upload failed:', err);
    throw new Error('Image upload failed. Please try again.');
  }
};

/**
 * Deletes an image from Supabase Storage.
 *
 * @param {string} recipeId - The unique identifier of the recipe associated with the image.
 * @param {string} previousImage - The public URL of the previously uploaded image to be deleted.
 */
export const deleteImage = async (recipeId: string): Promise<void> => {
  try {
    const groupId = useBoundStore.getState().profile.groupId;

    if (!groupId) {
      console.error('No group ID found. Cannot delete the image.');
      return;
    }

    // Since we know the folder structure, we can reconstruct the file path
    // If you prefer, you can parse `previousImage` to confirm the structure.
    const filePath = getFilePath(groupId, recipeId);

    // Remove the image from storage
    const { error: removeError } = await supabase.storage.from('photos').remove([filePath]);

    if (removeError) {
      console.error('Image delete failed:', removeError);
    } else {
      console.log('Image deleted successfully:', filePath);
    }
  } catch (err) {
    console.error('Image delete failed:', err);
    // Swallow error
  }
};
