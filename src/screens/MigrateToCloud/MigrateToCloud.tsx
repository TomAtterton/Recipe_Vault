import React, { useEffect, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import FormInput from '@/components/inputs/FormInput';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import NavBarButton from '@/components/buttons/NavBarButton';
import { showErrorMessage } from '@/utils/promptUtils';
import useHasPremium from '@/services/pro/useHasPremium';
import { Routes } from '@/navigation/Routes';
import ChefMeals from '../../../assets/svgs/chef_meals.svg';
import LabelButton from '@/components/buttons/LabelButton';
import ConfettiCannon from 'react-native-confetti-cannon';
import { handleProPlanPurchase } from '@/services/purchase';
import { migrateLocalDataToSupabase } from '@/database/migration';
import { updateProfile } from '@/store';
import { setupDatabase } from '@/utils/databaseUtils';
import { getRecipeCount } from '@/database/api/recipes';

import { translate } from '@/core';
import type { RouteProp } from '@/navigation/types';

const getNumberOfRecipes = async () => {
  try {
    return await getRecipeCount();
  } catch (e) {
    console.error(e);
    return 0;
  }
};

const MigrateToCloud = () => {
  const { params } = useRoute<RouteProp<Routes.MigrateToCloudModal>>();

  const isModal = params?.isModal ?? false;

  const hasPremium = useHasPremium();
  const { reset, goBack, navigate } = useNavigation();
  const { styles } = useStyles(stylesheet);
  const { height, width } = useWindowDimensions();

  const [vaultName, setVaultName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const [numberOfRecipes, setNumberOfRecipes] = useState(0);

  useEffect(() => {
    getNumberOfRecipes().then(setNumberOfRecipes);
  }, []);

  const handleMigrateVault = async () => {
    try {
      setIsLoading(true);

      const trimmedText = vaultName.trim();

      if (!trimmedText.match(/^[a-zA-Z]+$/)) {
        setErrorMessages(translate('migrate_to_cloud.error_invalid_vault_name'));
        setIsLoading(false);
        return;
      }

      await migrateVaultToCloud({ name: trimmedText });
      reset({ index: 0, routes: [{ name: Routes.TabStack }] });
    } catch (e) {
      console.error(e);
      // @ts-ignore
      showErrorMessage(e?.message || translate('migrate_to_cloud.error_migration_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const migrateVaultToCloud = async ({ name }: { name: string }) => {
    try {
      setIsLoading(true);
      const groupId = await migrateLocalDataToSupabase(name);

      updateProfile({
        groupId,
        groupName: name,
      });

      await setupDatabase({ databaseName: name });
    } catch (e) {
      console.error(e);
      throw new Error(translate('migrate_to_cloud.error_migration_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    if (errorMessages) setErrorMessages('');
    setVaultName(text);
  };

  useKeyboardForm();

  const confettiRef = useRef<ConfettiCannon>(null);
  const onContactCustomerSupport = () => {
    goBack();
    navigate(Routes.Help);
  };
  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      await handleProPlanPurchase(onContactCustomerSupport);
      confettiRef.current?.start();
    } finally {
      setIsLoading(false);
    }
  };

  const title = isModal
    ? translate('migrate_to_cloud.modal_title')
    : translate('migrate_to_cloud.title');

  const message = isModal
    ? translate('migrate_to_cloud.modal_message')
    : translate('migrate_to_cloud.save_message');

  return (
    <View style={styles.container}>
      <ChefMeals height={height / 4} width={width} style={styles.chefMealImage} />
      <Typography variant="titleLarge" style={styles.title}>
        {title}
      </Typography>

      {numberOfRecipes > 5 && !hasPremium ? (
        <>
          <View style={styles.contentContainer}>
            <Typography style={styles.subtitle} variant="bodyMediumItalic">
              {translate('migrate_to_cloud.premium_message', { numberOfRecipes })}
            </Typography>
          </View>
          <PrimaryButton
            title={translate('migrate_to_cloud.upgrade_button')}
            onPress={handlePurchase}
            style={styles.button}
            isLoading={isLoading}
          />
          <LabelButton
            title={translate('migrate_to_cloud.learn_more_button')}
            onPress={() => navigate(Routes.ProPlan)}
            style={styles.learnMoreButton}
          />
        </>
      ) : (
        <>
          <Typography style={styles.subtitle} variant="bodyMediumItalic">
            {message}
          </Typography>

          <FormInput
            value={vaultName}
            onChange={handleTextChange}
            placeholder={translate('migrate_to_cloud.vault_name_placeholder')}
            containerStyle={styles.input}
            maxLength={20}
            errorMessage={errorMessages}
          />
          <PrimaryButton
            isLoading={isLoading}
            style={styles.button}
            title={translate('migrate_to_cloud.save_button')}
            disabled={!vaultName || isLoading}
            onPress={handleMigrateVault}
          />
          {!hasPremium && !isModal && (
            <LabelButton
              title={translate('migrate_to_cloud.learn_more_button')}
              onPress={() => navigate(Routes.ProPlan)}
              style={styles.learnMoreButton}
            />
          )}
          {isModal && (
            <LabelButton
              title={translate('migrate_to_cloud.continue_button')}
              onPress={goBack}
              style={styles.learnMoreButton}
            />
          )}
        </>
      )}
      {!isModal && (
        <NavBarButton
          iconSource="arrow-left"
          onPress={goBack}
          disabled={isLoading}
          style={styles.backButton}
        />
      )}
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: -50, y: 10 }}
        fadeOut={true}
        autoStart={false}
        onAnimationEnd={() => {
          confettiRef.current?.stop();
        }}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((_, miniRuntime) => ({
  container: {
    paddingTop: miniRuntime.insets.top + 40,
    flex: 1,
    marginHorizontal: 20,
    marginBottom: miniRuntime.insets.bottom + 20,
  },
  contentContainer: { flex: 1 },
  chefMealImage: {
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: miniRuntime.screen.width / 1.5,
    height: 50,
  },
  input: {
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: miniRuntime.insets.top,
    left: 0,
  },
  learnMoreButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
}));

export default MigrateToCloud;
