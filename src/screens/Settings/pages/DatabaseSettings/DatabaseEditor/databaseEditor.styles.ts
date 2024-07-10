import { createStyleSheet } from 'react-native-unistyles';

const stylesheet = createStyleSheet(({ colors }, { insets }) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: insets.top + 120,
  },
  contentContainer: {
    paddingBottom: insets.top + 140,
  },
  navBarButton: {
    position: 'absolute',
    top: insets.top + 20,
    left: 20,
  },
  tableTitle: {
    color: colors.onBackground80,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableKey: {
    color: colors.primary,
  },
  tableValue: { flex: 1, flexWrap: 'wrap' },
  recordContainer: {
    marginVertical: 20,
    backgroundColor: colors.lightBackground80,
    padding: 20,
  },
}));

export default stylesheet;
