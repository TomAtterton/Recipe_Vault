import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';

import { SafeAreaView, View } from 'react-native';
import useHandleAuth from './useHandleAuth';
import { translate } from '@/core';
import LabelButton from '@/components/buttons/LabelButton';
import Icon from '@/components/Icon';
import { stylesheet } from './login.style';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import NavBarButton from '@/components/buttons/NavBarButton';
import type { RouteProp } from '@/navigation/types';

const Login = () => {
  const { onAppleLogin, onTestLogin } = useHandleAuth();
  const { styles, theme } = useStyles(stylesheet);
  const { navigate, goBack } = useNavigation();

  const { params } = useRoute<RouteProp<Routes.Login>>();
  const showSkip = params?.showSkip;

  const handleSkip = () => navigate(Routes.TabStack);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          Create a cloud vault
        </Typography>
        <Typography variant={'bodyMedium'} style={styles.subtitle}>
          Save your recipes in the cloud invite friends to join your vault and keep up to date with
          mealplans.
        </Typography>
      </View>
      <View style={styles.loginButtonContainer}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
          cornerRadius={5}
          style={styles.loginButton}
          onPress={onAppleLogin}
        />

        {showSkip && <LabelButton onPress={handleSkip} title={'Continue with local'} />}

        {__DEV__ && (
          <LabelButton onPress={onTestLogin} title={translate('login.test_login_title')} />
        )}
      </View>
      {!showSkip && (
        <NavBarButton iconSource={'arrow-left'} style={styles.backButton} onPress={goBack} />
      )}
    </SafeAreaView>
  );
};

export default Login;
