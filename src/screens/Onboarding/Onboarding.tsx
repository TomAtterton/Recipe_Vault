import React, { useRef, useState } from 'react';
import {
  ScrollView,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import Typography from '@/components/Typography';
import LabelButton from '@/components/buttons/LabelButton';
import CheckBox from '@/components/CheckBox';
import { useStyles } from 'react-native-unistyles';

import { stylesheet } from './onboarding.style';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import { setHasOnboarded, useBoundStore } from '@/store';
import svgs from '@/theme/svgs';
import { SvgProps } from 'react-native-svg';

const onboardingData: {
  Icon: React.FC<SvgProps>;
  title: string;
}[] = [
  {
    Icon: svgs.ChefFire,
    title:
      'Welcome to recipe vault, where you can store all your favourite recipes locally and securely !',
  },
  {
    Icon: svgs.ChefOk,
    title:
      'Dive into your personal library and explore! Easily search and filter your favourite recipes on your device!',
  },
  {
    Icon: svgs.ChefShare,
    title:
      'Plan and shop with ease! Schedule meals for the week & add ingredients directly to your shopping list.',
  },
  {
    Icon: svgs.ChefCut,
    title:
      'Share your recipes and meal plans with up to 2 friends using our syncing feature and shared cloud vault.',
  },
];

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { width } = useWindowDimensions();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
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
      x: width * index,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ width: width * onboardingData.length }}
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
            scrollViewRef.current?.scrollTo({
              x: width * (currentPage + 1),
              animated: true,
            });
          }}
        />
      </View>
    </View>
  );
};

const OnboardingView = ({ Icon, title }: { Icon: React.FC<SvgProps>; title: string }) => {
  const { styles } = useStyles(stylesheet);
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.onboardingView}>
      <View style={styles.imageContainer}>
        <Icon height={height / 3} width={width - 40} />
      </View>
      <Typography variant={'titleMedium'} style={styles.onboardingTitle}>
        {title}
      </Typography>
    </View>
  );
};

export default Onboarding;
