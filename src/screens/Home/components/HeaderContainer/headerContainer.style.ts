import { HEIGHT } from '@/theme/constants';
import { createStyleSheet } from 'react-native-unistyles';

const HEADER_HEIGHT = HEIGHT / 3.5;

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    minHeight: HEADER_HEIGHT,
  },
  title: {},
  subTitle: {
    paddingTop: 8,
    color: theme.colors.primary,
  },
  textContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
}));
