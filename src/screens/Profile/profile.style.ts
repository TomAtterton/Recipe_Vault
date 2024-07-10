import metrics from '@/theme/metrics';
import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  button: {
    width: metrics.screenWidth / 1.5,
    height: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  input: {},
}));
