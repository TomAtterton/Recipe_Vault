import Purchases from 'react-native-purchases';
import { Env } from '@/core/env';

const productIds = ['recipetier1tip', 'recipetier2tip', 'recipetier3tip', 'recipetier4tip'];

export const initPurchases = async () => {
  const apiKey = Env.REVENUE_CAT_API_KEY;
  if (apiKey) {
    Purchases.configure({
      apiKey,
    });
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  }
};

export const fetchProducts = async () => {
  const products = await Purchases.getProducts(productIds);
  console.log('products', products);
  return products;
};
