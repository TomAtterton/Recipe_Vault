import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import expoConstants from 'expo-constants';
import { Routes } from '@/navigation/Routes';
import SettingsButton from '@/components/buttons/SettingsButton';
import { translate } from '@/core';
import SettingsContainer from '@/components/SettingsContainer';
import ManageCategoriesContainer from '@/components/ManageCategoriesContainer';
import ManageTagsContainer from '@/components/ManageTagsContainer';
import { useRef } from 'react';
import { BottomSheetRef } from '@/components/BottomSheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const AppSettings = () => {
  const navigation = useNavigation();
  const handleShowOnboarding = () => navigation.navigate(Routes.Onboarding);
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
    <SettingsContainer title={translate('app_settings.title')}>
      <InfoLabelButton
        title={translate('app_settings.app_version')}
        buttonTitle={`${expoConstants.expoConfig?.version}`}
      />
      <SettingsButton
        title={translate('app_settings.show_onboarding')}
        onPress={handleShowOnboarding}
        iconSource={'hand'}
      />
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

export default AppSettings;
