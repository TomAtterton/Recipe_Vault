import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import {
  fetchProducts,
  PurchaseCancelError,
  purchaseProduct,
  PurchaseProduct,
} from '@/services/purchase';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { stylesheet } from './supportApp.style';
import { translate } from '@/core';
import { showErrorMessage } from '@/utils/promptUtils';
import ChefOk from '../../../assets/svgs/chef_fire.svg';
import ConfettiCannon from 'react-native-confetti-cannon';

const SupportApp = () => {
  const { styles } = useStyles(stylesheet);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [hasMadePurchase, setHasMadePurchase] = useState(false); // New state to track if a purchase has been made
  const [isLoading, setIsLoading] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    fetchProducts().then((purchaseProducts) => {
      setProducts(purchaseProducts || []);
    });
    setHasMadePurchase(false);
  }, []);

  const handlePurchase = async (option: PurchaseProduct) => {
    try {
      setIsLoading(true);
      await purchaseProduct(option.product);
      confettiRef?.current?.start();
      setHasMadePurchase(true); // Set purchaseMade to true after a successful purchase
    } catch (error) {
      // @ts-ignore
      if (error?.code !== PurchaseCancelError) {
        // @ts-ignore
        showErrorMessage(error?.message || translate('error.default.error_message'));
      }
    } finally {
      setIsLoading(false);
    }
  };
  const { height, width } = useWindowDimensions();

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }
    if (hasMadePurchase) {
      return (
        <ChefOk
          width={height / 3}
          height={width}
          style={{
            alignSelf: 'center',
          }}
        />
      );
    } else if (products.length > 0) {
      return products.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.button}
          onPress={() => handlePurchase(option)}
        >
          <Typography variant={'bodyMediumItalic'} style={styles.name}>
            {option.name}
          </Typography>
          <Typography variant={'bodyLarge'}>{option.amount}</Typography>
        </TouchableOpacity>
      ));
    } else {
      return (
        <View>
          <Typography variant={'titleLarge'} style={styles.thankYouText}>
            {translate('error.default.error_message')}
          </Typography>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant={'titleMedium'} style={styles.title}>
        {hasMadePurchase ? 'Thank you for your support!' : 'Support the app'}
      </Typography>

      {renderContent()}
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: -50, y: 10 }}
        fadeOut={true}
        autoStart={false}
        onAnimationEnd={() => {
          confettiRef.current?.stop();
          setTimeout(() => {
            setHasMadePurchase(false);
          }, 1000);
        }}
      />
    </View>
  );
};

export default SupportApp;
