import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const defaultHitSlop = {
  top: 40,
  bottom: 40,
  left: 40,
  right: 40,
};

export default {
  screenHeight: height,
  screenWidth: width,
};
