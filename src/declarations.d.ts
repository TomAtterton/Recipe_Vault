declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Patch the problematic type
declare module 'cloudinary-react-native' {
  interface UploadApiOptions {
    folder?: string;
    invalidate?: boolean;
    overwrite?: boolean;
    use_asset_folder_as_public_id_prefix?: boolean;
    signature?: string;
    api_key?: string;
    timestamp?: number;
    // Add other fields as needed
  }

  // Add a type definition for the upload function if needed
  export function upload(
    cloudinary: any,
    params: { file: string; options: UploadApiOptions; callback: (error: any, result: any) => void }
  ): void;
}
