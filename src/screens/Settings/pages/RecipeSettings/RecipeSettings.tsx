import { SafeAreaView, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './recipeSettings.style';
import SettingsButton from '@/components/buttons/SettingsButton';
import { useRef } from 'react';
import { BottomSheetRef } from '@/components/BottomSheet';
import ManageCategoriesContainer from '@/components/ManageCategoriesContainer/ManageCategoriesContainer';
import ManageTagsContainer from '@/components/ManageTagsContainer';

const RecipeSettings = () => {
  const manageCategoriesRef = useRef<BottomSheetRef>(null);
  const manageTagsRef = useRef<BottomSheetRef>(null);

  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  const handleManageCategories = () => {
    manageCategoriesRef.current?.present();
  };

  const handleManageTags = () => {
    manageTagsRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.container}>
        <Typography variant={'titleItalicLarge'} style={styles.title}>
          Recipe Settings.
        </Typography>

        <SettingsButton
          title={'Manage Categories'}
          onPress={handleManageCategories}
          iconSource={'bookmark-outline'}
        />
        <SettingsButton
          title={'Manage Tags'}
          onPress={handleManageTags}
          iconSource={'bookmark-outline'}
        />
        <ManageCategoriesContainer manageCategoriesRef={manageCategoriesRef} />
        <ManageTagsContainer manageTagsRef={manageTagsRef} />
      </View>
    </SafeAreaView>
  );
};

export default RecipeSettings;