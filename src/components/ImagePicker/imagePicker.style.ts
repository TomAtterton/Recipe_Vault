import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme) => ({
  container: {
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
  },
  fullscreenImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacityBackground: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  image: {
    borderRadius: 8,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
