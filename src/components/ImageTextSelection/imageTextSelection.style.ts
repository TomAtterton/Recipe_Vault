import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 60,
  },
  contentContainer: {
    flex: 1,
  },
  selectionButton: {
    position: 'absolute',
    backgroundColor: theme.colors.selectButton,
    padding: 5,
    borderRadius: 10,
    zIndex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background60,
    height: miniRuntime.insets.top + 60,
  },
  backButton: {
    position: 'absolute',
    bottom: 4,
    left: 0,
  },
  generateRecipeButton: {
    position: 'absolute',
    bottom: 8,
    right: 20,
  },
  onboardingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.black60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingContent: {
    backgroundColor: theme.colors.black60,
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 12,
    gap: 15,
    maxWidth: '85%',
    alignItems: 'center',
  },
  onboardingText: { textAlign: 'center' },
}));
