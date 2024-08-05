import NavBarButton from '@/components/buttons/NavBarButton';
import * as React from 'react';
import { MenuView } from '@react-native-menu/menu';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';

interface Props {
  onPress: () => void;
}

const EditButton = ({ onPress }: Props) => {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();
  const handleNavigateImageDetection = () => {
    navigation.navigate(Routes.RecipeDetectionStack, {
      screen: Routes.ImageDetection,
    });
  };
  return (
    <MenuView
      style={styles.container}
      actions={[
        {
          title: 'Import from image',
          id: 'ImageDetection',
        },
        {
          title: 'Clear Form',
          id: 'Clear',
          attributes: {
            destructive: true,
          },
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        const event = nativeEvent?.event;
        if (!event) return;
        if (event === 'Clear') {
          onPress();
        }
        if (event === 'ImageDetection') {
          handleNavigateImageDetection();
        }
      }}
    >
      <NavBarButton iconSource={'settings'} />
    </MenuView>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export default EditButton;
