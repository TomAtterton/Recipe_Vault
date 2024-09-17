import Purchases, { PurchasesStoreProduct } from 'react-native-purchases';
import { Env } from '@/core/env';
import { Alert } from 'react-native';
import { supabase } from '@/services';
import { useBoundStore } from '@/store';
import { translate } from '@/core';
import { getUserId } from '@/hooks/common/useUserId';

export const PurchaseCancelError = Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;

export const supportAppDescription = {
  recipetier1tip: '☕ Fuel my caffeine addiction',
  recipetier2tip: "📚 Help me buy a book I'll never finish",
  recipetier3tip: '🍕 Treat me to a slice of fancy pizza',
  recipetier4tip: '💻 Chip in for my dream laptop',
};
export type SupportAppDescriptionKey = keyof typeof supportAppDescription;

function isSupportAppDescriptionKey(key: string | undefined): key is SupportAppDescriptionKey {
  return key !== undefined && key in supportAppDescription;
}

export type PurchaseProduct = {
  id: string;
  name: string;
  amount: string;
  product: PurchasesStoreProduct;
};

export const initPurchases = () => {
  const apiKey = Env.REVENUE_CAT_API_KEY;
  if (apiKey) {
    Purchases.configure({
      apiKey,
    });
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }
  }
};

export const getProPrice = async () => {
  const products = await Purchases.getProducts(['recipevaultpropuchase']);
  return products?.[0]?.priceString || '$19,99';
};

export const handleProPlanPurchase = async (onContactCustomerSupport: () => void) => {
  try {
    const products = await Purchases.getProducts(['recipevaultpropuchase']);
    const product = products[0];
    if (!product) {
      throw new Error('Product not found');
    }
    await Purchases.purchaseStoreProduct(product);
    const groupId = useBoundStore.getState().profile?.groupId;
    const profileId = getUserId();

    const { error } = await supabase.from('pro_vaults').insert({
      updated_at: new Date().toISOString(),
      profile_id: profileId,
      group_id: groupId,
    });

    if (error) {
      throw new Error('Error purchasing pro plan ' + error.message);
    }

    useBoundStore.getState().setDatabaseStatus('pro');

    return true;
  } catch (error) {
    // @ts-ignore
    if (error?.code === PurchaseCancelError) {
      throw new Error('Cancelled purchase');
    }

    Alert.alert('Contact support', 'There was an issue with your purchase', [
      {
        text: translate('default.ok'),
        onPress: onContactCustomerSupport,
      },
    ]);
  }
};

export const fetchProducts = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages.map((purchasePackage) => {
    const { product } = purchasePackage;

    const productName = isSupportAppDescriptionKey(product?.identifier)
      ? supportAppDescription[product.identifier]
      : product.title;

    return {
      id: product.identifier,
      name: productName,
      amount: product.priceString,
      product: product,
    };
  });
};

export const purchaseProduct = async (product: PurchasesStoreProduct) => {
  return Purchases.purchaseStoreProduct(product);
};
