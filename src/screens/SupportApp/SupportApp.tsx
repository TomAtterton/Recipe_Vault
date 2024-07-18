import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  fetchProducts,
  PurchaseCancelError,
  purchaseProduct,
  PurchaseProduct,
} from '@/services/purchase';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { Image } from 'expo-image';
import { showErrorMessage } from '@/utils/errorUtils';
import { stylesheet } from './supportApp.style';

const SupportApp = () => {
  const { styles } = useStyles(stylesheet);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [purchaseMade, setPurchaseMade] = useState(false); // New state to track if a purchase has been made

  useEffect(() => {
    fetchProducts().then((purchaseProducts) => {
      setProducts(purchaseProducts || []);
    });
    setPurchaseMade(false);
  }, []);

  const handlePurchase = async (option: PurchaseProduct) => {
    try {
      await purchaseProduct(option.product);
      setPurchaseMade(true); // Set purchaseMade to true after a successful purchase
    } catch (error) {
      // @ts-ignore
      if (error?.code !== PurchaseCancelError) {
        // @ts-ignore
        showErrorMessage(error?.message || 'Something went wrong');
      }
    }
  };

  const renderContent = () => {
    if (purchaseMade) {
      return (
        <View>
          <Typography variant={'titleLarge'} style={styles.thankYouText}>
            Thank you for your support!
          </Typography>
          <Image style={styles.thankYouGif} source={require('../../../assets/gif/thankyou.gif')} />
        </View>
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
      // Empty state
      return (
        <View>
          <Typography variant={'titleLarge'} style={styles.thankYouText}>
            Oops something went wrong!
          </Typography>
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

export default SupportApp;
