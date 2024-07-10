import { StyleSheet } from 'react-native';

const IMAGE_SIZE = 100;

export default StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  image: {
    borderRadius: 8,
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  textContainer: {
    flex: 1,
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  metaContainer: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cookTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTitle: {
    marginLeft: 4,
  },
});
