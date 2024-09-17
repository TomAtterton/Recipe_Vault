import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    alignSelf: 'center',
  },
  description: {
    opacity: 0.6,
    textAlign: 'center',
    paddingTop: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pricesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Enables wrapping to the next line
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  tipButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.border, // Default border color for unselected
    backgroundColor: theme.colors.background, // Default background
  },
  selectedTipButton: {
    borderColor: theme.colors.primary, // Highlight selected item by changing border color
  },
  tipDetails: {
    alignItems: 'center',
  },
  name: {
    textAlign: 'center',
  },
  purchaseButton: {
    marginBottom: miniRuntime.insets.bottom + 20,
  },
  thankYouText: {
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
