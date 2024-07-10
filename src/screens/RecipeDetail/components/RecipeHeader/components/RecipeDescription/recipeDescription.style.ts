import { createStyleSheet } from 'react-native-unistyles';
import metrics from '@/theme/metrics';
import { IMAGE_HEIGHT } from '@/screens/RecipeDetail/components/RecipeHeader/recipeHeader.style';

export const stylesheet = createStyleSheet(({ colors }) => ({
  container: {
    flex: 1,
    marginTop: IMAGE_HEIGHT,
    maxHeight: metrics.screenHeight / 4,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContent: {
    marginLeft: 8,
  },
  timeTitle: {
    color: colors.placeholder,
  },
  titleContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  infoButton: {
    position: 'absolute',
    right: 0,
  },
  infoContainer: {
    gap: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  notes: {
    color: colors.placeholder,
  },
}));
