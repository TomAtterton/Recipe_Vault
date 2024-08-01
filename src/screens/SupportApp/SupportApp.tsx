import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  fetchProducts,
  PurchaseCancelError,
  purchaseProduct,
  PurchaseProduct,
} from '@/services/purchase';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { Image } from 'expo-image';
import { stylesheet } from './supportApp.style';
import images from '@/theme/images';
import { translate } from '@/core';
import { showErrorMessage } from '@/utils/promptUtils';

const SupportApp = () => {
  const { styles } = useStyles(stylesheet);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [hasMadePurchase, setHasMadePurchase] = useState(false); // New state to track if a purchase has been made
  const [isLoading, setIsLoading] = useState(false);

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

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }

    if (hasMadePurchase) {
      return <Image style={styles.thankYouGif} source={{ uri: images.THANK_YOU_GIF_URL }} />;
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
    </View>
  );
};

export default SupportApp;
