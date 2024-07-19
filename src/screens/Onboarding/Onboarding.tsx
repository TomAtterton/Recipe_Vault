import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Typography from '@/components/Typography';
import Icon from '@/components/Icon';
import LabelButton from '@/components/buttons/LabelButton';
import CheckBox from '@/components/CheckBox';
import { useStyles } from 'react-native-unistyles';

import { IconName } from '@/components/Icon/types';
import { SCREEN_WIDTH, stylesheet } from './onboarding.style';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { setHasOnboarded, useBoundStore } from '@/store';

const onboardingData: {
  icon: IconName;
  title: string;
}[] = [
  {
    icon: 'safe',
    title:
      'Welcome to recipe vault, where you can store all your favourite recipes locally and securely !',
  },
  {
    icon: 'book-search',
    title:
      'Dive into your personal library and explore! Easily search and filter your favourite recipes on your device!',
  },
  {
    icon: 'list-check',
    title:
      'Plan and shop with ease! Schedule meals for the week & add ingredients directly to your shopping list.',
  },
  {
    icon: 'paper-plane',
    title:
      'Share your recipes and meal plans with up to 2 friends using our syncing feature and shared cloud vault.\n\nLimited to 5 recipes; upgrade to a pro vault to unlock unlimited storage!\n',
  },
];

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / SCREEN_WIDTH);
    if (indexOfNextScreen !== currentPage) {
      setCurrentPage(indexOfNextScreen);
    }
  };
  const scrollViewRef = useRef<ScrollView>(null);
  const { styles } = useStyles(stylesheet);
  const hasOnboarded = useBoundStore((state) => state.hasOnboarded);
  const isFinalPage = currentPage === onboardingData.length - 1;
  const { navigate } = useNavigation();

  const handleCheckboxPress = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: SCREEN_WIDTH * index,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Handle scroll event at every 16ms for smoother tracking
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ width: SCREEN_WIDTH * onboardingData.length }}
      >
        {onboardingData.map((item, index) => (
          <OnboardingView key={index} {...item} />
        ))}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.checkboxContainer}>
          {onboardingData.map((_, index) => (
            <CheckBox
              style={{
                flex: 0,
              }}
              size={40}
              key={index}
              isSelected={index === currentPage}
              onPress={() => handleCheckboxPress(index)}
            />
          ))}
        </View>
        <LabelButton
          title={isFinalPage ? 'continue' : 'skip'}
          onPress={() => {
            if (isFinalPage) {
              /* Handle continue action */
              setHasOnboarded(true);

              if (hasOnboarded) {
                navigate(Routes.TabStack);
                return;
              }

              navigate(Routes.Login, {
                showSkip: true,
              });
              return;
            }
            /* Handle skip action */
            scrollViewRef.current?.scrollTo({
              x: SCREEN_WIDTH * (currentPage + 1),
              animated: true,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const OnboardingView = ({ icon, title }: { icon: IconName; title: string }) => {
  const { theme, styles } = useStyles(stylesheet);

  return (
    <View style={styles.onboardingView}>
      <View style={styles.imageContainer}>
        <Icon name={icon} size={120} color={theme.colors.onBackground} />
      </View>
      <Typography variant={'titleMedium'} style={styles.onboardingTitle}>
        {title}
      </Typography>
    </View>
  );
};

export default Onboarding;
