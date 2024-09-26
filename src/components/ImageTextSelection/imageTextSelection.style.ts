import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((_, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 60,
  },
  contentContainer: {
    flex: 1,
  },
  selectionButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 128, 0, 0.8)', // Green background
    padding: 5,
    borderRadius: 10,
    zIndex: 1,
  },
  generateRecipeButton: {
    position: 'absolute',
    top: miniRuntime.insets.top + 5,
    right: 20,
  },
  onboardingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 12,
    gap: 15,
    maxWidth: '85%',
    alignItems: 'center',
  },
  onboardingText: { textAlign: 'center' },
}));
