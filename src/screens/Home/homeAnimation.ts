import {
  CurvedTransition,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutRight,
  SlideOutUp,
} from 'react-native-reanimated';

const defaultDuration = 300;

const HomeAnimation = {
  headerContainerAnimation: {
    entering: SlideInUp.duration(400),
    exiting: SlideOutUp.duration(400),
  },
  searchContainerAnimation: {
    layout: CurvedTransition.duration(defaultDuration),
  },
  searchBarAnimation: {
    layout: CurvedTransition.duration(defaultDuration),
  },
  categoryListAnimation: {
    entering: SlideInRight.duration(defaultDuration).delay(100),
  },
  searchCancelButtonAnimation: {
    entering: SlideInRight.duration(defaultDuration),
  },
  trySomethingCarousel: {
    entering: SlideInRight.duration(defaultDuration),
    exiting: SlideOutRight.duration(defaultDuration),
  },
  addRecipeBlockAnimation: {
    entering: SlideInLeft.duration(defaultDuration),
  },
  searchListAnimation: {
    entering: SlideInDown.duration(defaultDuration * 2),
  },
};

export default HomeAnimation;
