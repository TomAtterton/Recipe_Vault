import * as React from 'react';
import SettingsButton from '@/components/buttons/SettingsButton';
import { useRef } from 'react';
import { BottomSheetRef } from '@/components/BottomSheet';
import ManageCategoriesContainer from '@/components/ManageCategoriesContainer/ManageCategoriesContainer';
import ManageTagsContainer from '@/components/ManageTagsContainer';
import { translate } from '@/core';
import SettingsContainer from '@/components/SettingsContainer';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const RecipeSettings = () => {
  const manageCategoriesRef = useRef<BottomSheetRef>(null);
  const manageTagsRef = useRef<BottomSheetRef>(null);

  const handleManageCategories = () => {
    manageCategoriesRef.current?.present();
  };

  const handleManageTags = () => {
    manageTagsRef.current?.present();
  };

  const { styles } = useStyles(stylesheet);

  return (
    <SettingsContainer title={translate('recipe_settings.title')}>
      <SettingsButton
        title={translate('recipe_settings.manage_categories')}
        onPress={handleManageCategories}
        iconSource={'pencil-add'}
        style={styles.button}
      />
      <SettingsButton
        title={translate('recipe_settings.manage_tags')}
        onPress={handleManageTags}
        iconSource={'pencil-add'}
      />
      <ManageCategoriesContainer manageCategoriesRef={manageCategoriesRef} />
      <ManageTagsContainer manageTagsRef={manageTagsRef} />
    </SettingsContainer>
  );
};

const stylesheet = createStyleSheet(() => ({
  button: {
    marginTop: 20,
  },
}));

export default RecipeSettings;
