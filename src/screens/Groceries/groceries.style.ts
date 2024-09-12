import { createStyleSheet } from 'react-native-unistyles';

export const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    alignItems: 'center',
  },
  leftHeaderContent: { flexDirection: 'row', alignItems: 'center' },
  navButton: {
    alignSelf: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  shimmer: {
    borderRadius: 10,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  blurView: {
    paddingVertical: 8,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    marginVertical: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: miniRuntime.insets.bottom,
  },
  infoDescription: {
    marginVertical: 10,
    opacity: 0.8,
    textAlign: 'center',
  },
  infoBottomContent: {
    marginTop: 20,
    gap: 20,
  },
}));
