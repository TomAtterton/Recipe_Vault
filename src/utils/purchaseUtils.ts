import Purchases from 'react-native-purchases';
import { Env } from '@/core/env';
import { PurchasesStoreProduct } from '@revenuecat/purchases-typescript-internal/dist/offerings';

const supportAppDescription = {
  recipetier1tip: '☕ Fuel my caffeine addiction',
  recipetier2tip: "📚 Help me buy a book I'll never finish",
  recipetier3tip: '🍕 Treat me to a slice of fancy pizza',
  recipetier4tip: '💻 Chip in for my dream laptop',
};
type SupportAppDescriptionKey = keyof typeof supportAppDescription;

function isSupportAppDescriptionKey(key: string | undefined): key is SupportAppDescriptionKey {
  return key !== undefined && key in supportAppDescription;
}

export type PurchaseProduct = {
  id: string;
  name: string;
  amount: string;
  product: PurchasesStoreProduct;
};

export const initPurchases = async () => {
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
