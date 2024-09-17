import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, useWindowDimensions, TouchableOpacity } from 'react-native';
import {
  fetchProducts,
  purchaseProduct,
  PurchaseProduct,
  supportAppDescription,
  SupportAppDescriptionKey,
} from '@/services/purchase';
import { useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { stylesheet } from './supportApp.style';
import { translate } from '@/core';
import ChefOk from '../../../assets/svgs/chef_fire.svg';
import ConfettiCannon from 'react-native-confetti-cannon';
import PrimaryButton from '@/components/buttons/PrimaryButton';

const SupportApp = () => {
  const { styles } = useStyles(stylesheet);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [selectedOption, setSelectedOption] = useState<SupportAppDescriptionKey>('recipetier1tip');
  const [hasMadePurchase, setHasMadePurchase] = useState(false);
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
      setHasMadePurchase(true);
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
      return <ActivityIndicator style={styles.loadingContainer} />;
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
      return (
        <>
          <Typography variant={'bodyMediumItalic'} style={styles.description}>
            {translate('support_app.description')}
          </Typography>
          <View style={styles.contentContainer}>
            <View style={styles.pricesContainer}>
              {products.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.tipButton,
                    selectedOption === option.id && styles.selectedTipButton,
                  ]}
                  onPress={() => setSelectedOption(option.id as SupportAppDescriptionKey)}
                >
                  <View style={styles.tipDetails}>
                    <Typography variant={'bodyLarge'}>{option.amount}</Typography>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Typography variant={'bodyMediumItalic'} style={styles.name}>
              {supportAppDescription[selectedOption]}
            </Typography>
          </View>
        </>
      );
    } else {
      return (
        <View>
          <Typography variant={'titleLarge'} style={styles.thankYouText}>
            {translate('default.error_message')}
          </Typography>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant={'titleMedium'} style={styles.title}>
        {hasMadePurchase ? translate('support_app.thank_you') : translate('support_app.title')}
      </Typography>

      {renderContent()}

      {selectedOption && (
        <PrimaryButton
          style={styles.purchaseButton}
          onPress={() => {
            const selectedProduct = products.find((p) => p.id === selectedOption);
            if (selectedProduct) handlePurchase(selectedProduct);
          }}
          title={translate('support_app.purchase_button')}
          isLoading={isLoading}
        />
      )}

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
