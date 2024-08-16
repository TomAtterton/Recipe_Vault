import { useNetInfo } from '@react-native-community/netinfo';

const useIsConnected = () => {
  const { isConnected } = useNetInfo();
  return isConnected;
};
