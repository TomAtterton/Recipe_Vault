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
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';

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
      <ChefCut
        height={height / 4}
        width={width}
        style={{
          alignSelf: 'center',
        }}
      />
      <View style={styles.titleContainer}>
        <Typography variant={'titleItalicLarge'} style={styles.title}>
          Login to create a Cloud Vault!
        </Typography>
        <View style={styles.featureContainer}>
          <View style={styles.rowContainer}>
            <Icon name={'cloud'} size={20} color={theme.colors.onBackground} />
            <Typography variant={'bodyMedium'} style={styles.rowTitle}>
              {'Sync recipes to the cloud'}
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
              {'Share your vault with up to 2 friends and family'}
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
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Typography variant={'bodyMedium'} style={styles.dividerText}>
            login with
          </Typography>
          <View style={styles.divider} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
          }}
        >
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
              or
            </Typography>
            <View style={styles.divider} />
          </View>
          <LabelButton onPress={handleSkip} title={'Continue with local vault'} />
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
      <BottomSheet bottomSheetRef={bottomsheetRef} snapPoints={['40%']}>
        <Typography variant={'titleItalicLarge'} style={styles.proPlanTitle}>
          Why the limitation ?
        </Typography>
        <View style={styles.proContentContainer}>
          <Typography variant={'bodyMedium'} style={styles.proPlanDescription}>
            Our goal is to give everyone a taste by offering 5 recipe slots for free, you can
            explore the benefits of cloud syncing and see how it fits into your cooking routine.
          </Typography>
          <Typography variant={'bodyMedium'} style={styles.proPlanDescription}>
            If you find that 5 slots aren’t enough, you can always upgrade to our Pro Vault at a
            later point.
          </Typography>
          <LabelButton
            title={'Learn more about pro vaults'}
            onPress={() => {
              navigate(Routes.ProPlan);
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default Login;
