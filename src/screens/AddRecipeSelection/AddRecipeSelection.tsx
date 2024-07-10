import { View } from 'react-native';
import React, { RefObject } from 'react';
import { HEIGHT } from '@/theme/constants';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Routes } from '@/navigation/Routes';
import { useStyles } from 'react-native-unistyles';
import OutlineButton from '@/components/buttons/OutlineButton';
import { stylesheet } from './addRecipeSelection.style';
import BottomSheet from '@/components/BottomSheet';

const AddRecipeSelection = ({ optionsRef }: { optionsRef: RefObject<BottomSheetModal> }) => {
  const snapPoints = React.useMemo(() => [HEIGHT / 3], []);
  const navigation = useNavigation();

  const handleOpen = () => {
    optionsRef?.current?.close();

    // navigation.navigate(Routes.AddStack, {
    //   screen: Routes.AddRecipe,
    //   params: {
    //     type,
    //   },
    // });
  };

  const { styles } = useStyles(stylesheet);

  return (
    <BottomSheet
      bottomSheetRef={optionsRef}
      snapPoints={snapPoints}
      title={'How would you like to create your recipe?'}
    >
      <View style={styles.container}>
        <OutlineButton
          title={'Create your own recipe'}
          onPress={handleOpen}
          iconSource={'pencil-add'}
        />
        <OutlineButton
          title={'Add recipe from the web'}
          onPress={() => {
            navigation.navigate(Routes.RecipeWebview);
            optionsRef?.current?.close();
          }}
          iconSource={'browser-plus'}
        />
      </View>
    </BottomSheet>
  );
};

export default AddRecipeSelection;
