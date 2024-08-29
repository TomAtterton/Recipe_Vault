import NavBarButton from '@/components/buttons/NavBarButton';
import * as React from 'react';
import { MenuView } from '@react-native-menu/menu';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { useCallback, useState } from 'react';
import { checkIfPro } from '@/services/pro';

interface Props {
  onPress: () => void;
}

const EditButton = ({ onPress }: Props) => {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();
  const [isPro, setIsPro] = useState<boolean>(false);

  const handleNavigateImageDetection = () => {
    navigation.navigate(Routes.RecipeDetectionStack, {
      screen: Routes.ImageDetection,
    });
  };

  useFocusEffect(
    useCallback(() => {
      checkIfPro().then((_) => {
        setIsPro(_);
      });
    }, [])
  );

  const menuActions = [
    isPro
      ? {
          title: 'Import from image',
          id: 'ImageDetection',
        }
      : null,
    {
      title: 'Clear Form',
      id: 'Clear',
      attributes: {
        destructive: true,
      },
    },
  ].filter(Boolean); // Filter out null values

  return (
    <MenuView
      style={styles.container}
      // @ts-ignore
      actions={menuActions} // Pass the filtered actions here
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
