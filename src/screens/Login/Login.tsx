import React, { useRef } from 'react';

import { ActivityIndicator, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import useHandleAuth from './useHandleAuth';
import Icon from '@/components/Icon';
import { stylesheet } from './login.style';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import type { RouteProp } from '@/navigation/types';
import NavBarButton from '@/components/buttons/NavBarButton';
import ChefCut from '../../../assets/svgs/chef_cut.svg';
import Apple from '../../../assets/svgs/apple.svg';
import LabelButton from '@/components/buttons/LabelButton';
import IconButton from '@/components/buttons/IconButton';
import { BottomSheetRef } from '@/components/BottomSheet';
import LimitationBottomSheet from '@/screens/Login/components/LimitationBottomSheet';
import { translate } from '@/core';

const Login = () => {
  const { onAppleLogin, onTestLogin, isLoading } = useHandleAuth();
  const { styles, theme } = useStyles(stylesheet);
  const { navigate, goBack } = useNavigation();

  const { params } = useRoute<RouteProp<Routes.Login>>();
  const showSkip = params?.showSkip;

  const handleSkip = () => navigate(Routes.TabStack);

  const { height, width } = useWindowDimensions();

  const bottomsheetRef = useRef<BottomSheetRef>(null);

  return (
    <View style={styles.container}>
      <ChefCut height={height / 4} width={width} style={styles.headerImage} />
      <View style={styles.titleContainer}>
        <Typography variant={'titleItalicLarge'} style={styles.title}>
          {translate('login.title')}
        </Typography>
        <View style={styles.featureContainer}>
          <View style={styles.rowContainer}>
            <Icon name={'cloud'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {translate('login.feature1')}
            </Typography>
            <IconButton
              iconSource={'info-border'}
              iconSize={20}
              iconColor={theme.colors.onBackground}
              onPress={() => {
                console.log('info');
                bottomsheetRef.current?.present();
              }}
              style={styles.infoButton}
            />
          </View>
          <View style={styles.rowContainer}>
            <Icon name={'paper-plane'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {translate('login.feature2')}
            </Typography>
          </View>
          <View style={styles.rowContainer}>
            <Icon name={'people'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {translate('login.feature3')}
            </Typography>
          </View>
          <View style={styles.rowContainer}>
            <Icon name={'calendar'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {translate('login.feature4')}
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.loginButtonContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Typography variant={'bodyMedium'} style={styles.dividerText}>
            {translate('login.loginWith')}
          </Typography>
          <View style={styles.divider} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onAppleLogin} style={styles.loginButton}>
            <Apple />
          </TouchableOpacity>
          {__DEV__ && (
            <TouchableOpacity onPress={onTestLogin} style={styles.loginButton}>
              <Icon name={'ghost'} size={30} />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Typography variant={'bodyMedium'} style={styles.dividerText}>
              {translate('login.or')}
            </Typography>
            <View style={styles.divider} />
          </View>
          <LabelButton onPress={handleSkip} title={translate('login.button')} />
        </View>
      </View>
      {!showSkip && (
        <NavBarButton iconSource={'arrow-left'} style={styles.backButton} onPress={goBack} />
      )}
      {isLoading && (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      <LimitationBottomSheet bottomsheetRef={bottomsheetRef} />
    </View>
  );
};

export default Login;
