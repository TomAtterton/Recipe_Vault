import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { stylesheet } from './imagePicker.style';
import {
  onOpenImageCropper,
  onPickImageFromCamera,
  onPickImageFromLibrary,
} from '@/utils/imageUtils';
import { MenuView } from '@react-native-menu/menu';
import { useStyles } from 'react-native-unistyles';
import NavBarButton from '@/components/buttons/NavBarButton';
import Icon from '@/components/Icon';
import Image from '@/components/Image';

interface Props {
  style?: StyleProp<ViewStyle>;
  imageUri?: string | null;
  onSelectImage: (imageUri?: string | null) => void;
  children?: React.ReactNode;
  skipCropping?: boolean;
  onFullScreen?: () => void;
  isTemporary?: boolean;
}

const ImagePicker = ({
  style,
  children,
  imageUri,
  onSelectImage,
  onFullScreen,
  isTemporary,
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);

  const handleImageSelection = async () => {
    if (!imageUri) return;
    if (onFullScreen) {
      onFullScreen();
      return;
    }
    const imageUriPath = await onOpenImageCropper(imageUri, !!isTemporary);
    onSelectImage(imageUriPath);
  };

  const handlePhotoLibrary = async () => {
    const uri = await onPickImageFromLibrary(!!isTemporary);
    onSelectImage(uri);
  };

  const handleCamera = async () => {
    const uri = await onPickImageFromCamera(!!isTemporary);
    onSelectImage(uri);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.primary,
        },
        style,
      ]}
    >
      {imageUri ? (
        <>
          <TouchableOpacity style={styles.fullscreenImageContainer} onPress={handleImageSelection}>
            {children ? (
              children
            ) : (
              <Image source={{ uri: imageUri, resizeMode: 'contain' }} style={styles.image} />
            )}
            {onFullScreen && (
              <View style={styles.opacityBackground}>
                <Icon size={60} name={'expand'} color={theme.colors.onBackground} />
              </View>
            )}
          </TouchableOpacity>
          <NavBarButton
            style={styles.deleteButton}
            buttonSize={'medium'}
            iconSource={'bin'}
            onPress={() => onSelectImage(null)}
          />
        </>
      ) : (
        <MenuView
          style={styles.emptyContainer}
          title={'Select Image'}
          actions={[
            {
              id: 'camera',
              title: 'Camera',
            },
            {
              id: 'library',
              title: 'Photo Library',
            },
          ]}
          onPressAction={async ({ nativeEvent }) => {
            const event = nativeEvent?.event as 'camera' | 'library';
            if (!event) return;

            if (event === 'camera') {
              handleCamera();
            }
            if (event === 'library') {
              handlePhotoLibrary();
            }
          }}
        >
          <Icon size={40} name={'plus'} color={theme.colors.primary} />
        </MenuView>
      )}
    </View>
  );
};

export default ImagePicker;
