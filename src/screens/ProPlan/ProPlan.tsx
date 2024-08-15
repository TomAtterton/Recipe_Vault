import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import Icon from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import LabelButton from '@/components/buttons/LabelButton';
import { handleProPlanPurchase } from '@/services/purchase';
import { Routes } from '@/navigation/Routes';
import ConfettiCannon from 'react-native-confetti-cannon';
import { stylesheet } from './proPlan.style';
import { checkIfPro } from '@/services/pro';
import { useBoundStore } from '@/store';

const PurchaseScreen = () => {
  const { navigate, goBack } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const confettiRef = useRef<ConfettiCannon>(null);

  const onContactCustomerSupport = () => {
    goBack();
    navigate(Routes.Help);
  };

  const isLoggedIn = useBoundStore((state) => state.session?.user);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      await handleProPlanPurchase(onContactCustomerSupport);
      confettiRef.current?.start();
    } finally {
      setIsLoading(false);
    }
  };

  const { styles, theme } = useStyles(stylesheet);

  useEffect(() => {
    checkIfPro().then((isPro) => {
      if (isPro) {
        goBack();
      }
    });
  }, [goBack]);

  return (
    <SafeAreaView style={styles.container}>
      <Icon style={styles.icon} name={'cloud'} size={80} color={theme.colors.onBackground} />
      <Typography variant={'displaySmall'} style={styles.title}>
        Cloud Vault Pro
      </Typography>
      <Typography variant={'bodyMedium'} style={styles.subTitle}>
        Upgrade your cloud vault to pro with a one time purchase to unlock the following features:
      </Typography>
      <View style={styles.contentContainer}>
        <View style={styles.itemContainer}>
          <Icon name={'cloud'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            Remove 5 Recipe limitation and add unlimited recipes and sync them to the cloud.
          </Typography>
        </View>
        <View style={styles.itemContainer}>
          <Icon name={'people'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            Share your pro vault with up to 2 friends and family.
          </Typography>
        </View>
        <View style={styles.itemContainer}>
          <Icon name={'ufo-flying'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            Help support the development of Recipe Vault.
          </Typography>
        </View>
      </View>
      <View style={styles.footerContainer}>
        {isLoggedIn ? (
          <>
            <PrimaryButton
              title={'Upgrade to Pro'}
              onPress={handlePurchase}
              isLoading={isLoading}
            />
            <LabelButton title={'Continue with free version'} onPress={goBack} />
          </>
        ) : (
          <PrimaryButton title={'Login to upgrade'} onPress={goBack} />
        )}
      </View>
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: -50, y: 10 }}
        fadeOut={true}
        autoStart={false}
        onAnimationEnd={() => {
          confettiRef.current?.stop();
          goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default PurchaseScreen;
