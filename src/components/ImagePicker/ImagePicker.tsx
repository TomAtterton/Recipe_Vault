import React from 'react';
import { TouchableOpacity, View } from 'react-native';

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
  imageUri?: string | null | number;
  onSelectImage: (imageUri?: string | null) => void;
  children?: React.ReactNode;
  skipCropping?: boolean;
  onFullScreen?: () => void;
}

const ImagePicker = ({ children, imageUri, onSelectImage, onFullScreen }: Props) => {
  const { styles, theme } = useStyles(stylesheet);

  const handleImageSelection = async () => {
    if (onFullScreen) {
      onFullScreen();
      return;
    }
    onOpenImageCropper(imageUri as string).then(onSelectImage);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.primary,
        },
      ]}
    >
      {imageUri ? (
        <>
          <TouchableOpacity style={styles.fullscreenImageContainer} onPress={handleImageSelection}>
            {/*// @ts-ignore*/}
            {children ? children : <Image source={{ uri: imageUri }} style={styles.image} />}
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

            let eventImageUri;
            if (event === 'camera') {
              eventImageUri = await onPickImageFromCamera();
            }
            if (event === 'library') {
              eventImageUri = await onPickImageFromLibrary();
            }
            onSelectImage(eventImageUri);
          }}
        >
          <Icon size={40} name={'plus'} color={theme.colors.primary} />
        </MenuView>
      )}
    </View>
  );
};

export default ImagePicker;
