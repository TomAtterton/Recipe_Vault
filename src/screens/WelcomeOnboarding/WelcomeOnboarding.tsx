import { View } from 'react-native';
import { Routes } from '@/navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import React from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './welcomeOnboarding.style';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useKeyboardForm } from '@/hooks/common/useKeyboardForm';
import LabelButton from '@/components/buttons/LabelButton';
import { onSignOut } from '@/services/auth';
import NavBarButton from '@/components/buttons/NavBarButton';
import { translate } from '@/core';

const WelcomeOnboarding = () => {
  const { reset, goBack, navigate } = useNavigation();

  const { styles, theme } = useStyles(stylesheet);

  const handleSharedVault = () => {
    navigate(Routes.CreateVault, {});
  };

  const handleJoinVault = () => {
    navigate(Routes.JoinVault, {});
  };

  const handleLogout = () => {
    onSignOut();
    reset({
      index: 0,
      routes: [{ name: Routes.TabStack }],
    });
  };

  useKeyboardForm();
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          {translate('welcome_onboarding.title')}
        </Typography>
        <Typography style={styles.subtitle} variant={'bodyMediumItalic'}>
          {translate('welcome_onboarding.subtitle')}
        </Typography>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          style={styles.button}
          title={translate('welcome_onboarding.create_button')}
          onPress={handleSharedVault}
        />
        <PrimaryButton
          style={styles.button}
          title={translate('welcome_onboarding.join_button')}
          onPress={handleJoinVault}
        />

        <LabelButton title={translate('welcome_onboarding.logout')} onPress={handleLogout} />
      </View>
      <NavBarButton
        iconSource={'arrow-left'}
        onPress={goBack}
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
        }}
      />
    </View>
  );
};
export default WelcomeOnboarding;
