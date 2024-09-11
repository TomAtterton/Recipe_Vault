import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import Icon from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import LabelButton from '@/components/buttons/LabelButton';
import { getProPrice, handleProPlanPurchase } from '@/services/purchase';
import { Routes } from '@/navigation/Routes';
import ConfettiCannon from 'react-native-confetti-cannon';
import { stylesheet } from './proPlan.style';
import { checkIfPro } from '@/services/pro';
import { useBoundStore } from '@/store';
import ChefOk from '../../../assets/svgs/chef_ok.svg';
import { translate } from '@/core';

const PurchaseScreen = () => {
  const { navigate, goBack } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const confettiRef = useRef<ConfettiCannon>(null);
  const [price, setPrice] = useState('');
  useEffect(() => {
    getProPrice().then((priceString) => {
      setPrice(priceString);
    });
  }, []);

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
  const { height, width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <ChefOk height={height / 4} width={width} style={styles.headerImage} />
      <Typography variant={'displaySmall'} style={styles.title}>
        {translate('purchase_screen.title')}
      </Typography>
      <View style={styles.contentContainer}>
        <View style={styles.itemContainer}>
          <Icon name={'cloud'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            {translate('purchase_screen.sync_feature')}
          </Typography>
        </View>
        <View style={styles.itemContainer}>
          <Icon name={'people'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            {translate('purchase_screen.share_feature')}
          </Typography>
        </View>
        <View style={styles.itemContainer}>
          <Icon name={'ufo-flying'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            {translate('purchase_screen.support_feature')}
          </Typography>
        </View>
      </View>
      <View style={styles.lifeTimePurchase}>
        <Typography variant={'bodyMediumItalic'}>
          {translate('purchase_screen.life_time_purchase')}
        </Typography>
        <View style={styles.divider} />
        <Typography variant={'bodyMediumItalic'} style={styles.price}>
          {price}
        </Typography>
      </View>
      {!isLoggedIn ? (
        <>
          <PrimaryButton
            title={translate('purchase_screen.upgrade_button')}
            onPress={handlePurchase}
            isLoading={isLoading}
            style={styles.proButton}
          />
          <LabelButton title={translate('purchase_screen.continue_free_button')} onPress={goBack} />
        </>
      ) : (
        <PrimaryButton title={translate('purchase_screen.login_button')} onPress={goBack} />
      )}
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
    </View>
  );
};

export default PurchaseScreen;
