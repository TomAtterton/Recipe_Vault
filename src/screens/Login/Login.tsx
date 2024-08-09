import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';

import { ActivityIndicator, View } from 'react-native';
import useHandleAuth from './useHandleAuth';
import LabelButton from '@/components/buttons/LabelButton';
import Icon from '@/components/Icon';
import { stylesheet } from './login.style';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import type { RouteProp } from '@/navigation/types';
import NavBarButton from '@/components/buttons/NavBarButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { translate } from '@/core';

const Login = () => {
  const { onAppleLogin, onTestLogin, isLoading } = useHandleAuth();
  const { styles, theme } = useStyles(stylesheet);
  const { navigate, goBack } = useNavigation();

  const { params } = useRoute<RouteProp<Routes.Login>>();
  const showSkip = params?.showSkip;

  const handleSkip = () => navigate(Routes.TabStack);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name={'cloud'} size={100} color={theme.colors.onBackground} />
        <Typography variant={'titleLarge'} style={styles.title}>
          Cloud Vault
        </Typography>
        <Typography variant={'bodyMedium'} style={styles.subtitle}>
          Login to create or join your first Cloud Recipe Vault! Enjoy the following features:
        </Typography>
        <View style={styles.featureContainer}>
          <View style={styles.rowContainer}>
            <Icon name={'cloud'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {'Sync recipes to the cloud *'}
            </Typography>
          </View>
          <View style={styles.rowContainer}>
            <Icon name={'share'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {'Share your vault with friends and family'}
            </Typography>
          </View>
          <View style={styles.rowContainer}>
            <Icon name={'people'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {'Join shared vaults of other users'}
            </Typography>
          </View>
          <View style={styles.rowContainer}>
            <Icon name={'calendar'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {'Plan your meals with friends'}
            </Typography>
          </View>
        </View>
      </View>
      <View style={styles.loginButtonContainer}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
          cornerRadius={5}
          style={styles.loginButton}
          onPress={onAppleLogin}
        />

        {showSkip && <LabelButton onPress={handleSkip} title={'Continue with local vault'} />}

        {__DEV__ && (
          <LabelButton onPress={onTestLogin} title={translate('login.test_login_title')} />
        )}
      </View>
      {!showSkip && (
        <NavBarButton iconSource={'arrow-left'} style={styles.backButton} onPress={goBack} />
      )}
      {isLoading && (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      <Typography variant={'bodyMedium'} style={styles.proPlanTitle}>
        {'* Current limitations apply'}
      </Typography>
      <PrimaryButton
        style={{
          zIndex: 999,
        }}
        onPress={() => {
          navigate(Routes.ProPlan);
        }}
        title={'Check out Pro Features'}
      />
    </View>
  );
};

export default Login;
