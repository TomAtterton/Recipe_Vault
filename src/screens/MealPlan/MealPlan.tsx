import React, { useCallback } from 'react';
import { View, SafeAreaView } from 'react-native';

import { RecipeDetailType } from '@/types';
import useMealPlan from '@/screens/MealPlan/hooks/useMealPlan';
import Footer from 'src/screens/MealPlan/components/Footer';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { Routes } from '@/navigation/Routes';
import MealPlanMenuSelection from 'src/components/MealPlanMenuSelection';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import useSyncOnFocus from '@/database/hooks/useSyncOnFocus';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './mealPlan.style';
import SmallHorizontalCard from '@/components/cards/SmallHorizontalCard';
import Icon from '@/components/Icon';
import Animated, { SlideInUp, LinearTransition, Easing } from 'react-native-reanimated';

export type MealPlanType = {
  date: string;
  entryType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title?: string;
  text?: string;
  recipeId?: string;
  image?: string;
  id: string;
  recipe?: RecipeDetailType;
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const keyExtractor = (item: MealPlanType) => item.id;

const WeekListWithRecipes = () => {
  const { currentDate, getCurrentDateByDay, currentWeek, data, weekOffset, setWeekOffset } =
    useMealPlan();

  const { styles } = useStyles(stylesheet);

  useSyncOnFocus();

  const tabBarHeight = useBottomTabBarHeight();
  const scrollViewRef = React.useRef(null);

  useScrollToTop(scrollViewRef);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.contentContainer}
        entering={SlideInUp.duration(500)}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 32 }}
      >
        <DayPlan
          index={0}
          currentDate={currentDate}
          dayData={data[daysOfWeek[0]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
        <DayPlan
          index={1}
          currentDate={currentDate}
          dayData={data[daysOfWeek[1]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
        <DayPlan
          index={2}
          currentDate={currentDate}
          dayData={data[daysOfWeek[2]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
        <DayPlan
          index={3}
          currentDate={currentDate}
          dayData={data[daysOfWeek[3]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
        <DayPlan
          index={4}
          currentDate={currentDate}
          dayData={data[daysOfWeek[4]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
        <DayPlan
          index={5}
          currentDate={currentDate}
          dayData={data[daysOfWeek[5]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
        <DayPlan
          index={6}
          currentDate={currentDate}
          dayData={data[daysOfWeek[6]]}
          getCurrentDateByDay={getCurrentDateByDay}
        />
      </Animated.ScrollView>
      <Footer currentWeek={currentWeek} weekOffset={weekOffset} onWeekChange={setWeekOffset} />
    </SafeAreaView>
  );
};

const DayPlan = ({
  index,
  currentDate,
  dayData,
  getCurrentDateByDay,
}: {
  index: number;
  currentDate: string;
  dayData: MealPlanType[];
  getCurrentDateByDay: (index: number) => string;
}) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const day = daysOfWeek[index];

  const currentSelectDate = getCurrentDateByDay(index);
  const dayNumber = currentSelectDate.split('-')[2];
  const isToday = currentSelectDate === currentDate;
  const { navigate } = useNavigation();

  const handleDayPress = (event: 'dinner' | 'breakfast' | 'lunch') => {
    const selectDate = getCurrentDateByDay(index);
    navigate(Routes.Search, {
      selectDate,
      entryType: event,
    });
  };

  const handleRenderItem = useCallback(
    ({ item }: { item: MealPlanType }) => <SmallHorizontalCard item={item} />,
    []
  );

  return (
    <Animated.View
      style={styles.dayColumn}
      key={day}
      layout={LinearTransition.easing(Easing.ease).duration(300)}
    >
      <View style={styles.dayHeadingContainer}>
        <Typography
          variant={'titleMedium'}
          style={{
            color: isToday ? colors.primary : colors.onBackground,
          }}
        >
          {`${dayNumber} ${day}`}
        </Typography>
        <MealPlanMenuSelection onPress={handleDayPress}>
          <View style={styles.plusIconContainer}>
            <Icon name={'plus'} size={24} color={colors.primary} />
          </View>
        </MealPlanMenuSelection>
      </View>
      <Animated.FlatList
        keyExtractor={keyExtractor}
        initialNumToRender={3}
        layout={LinearTransition.delay(100)}
        contentContainerStyle={styles.scrollContent}
        horizontal={true}
        data={dayData}
        renderItem={handleRenderItem}
      />
    </Animated.View>
  );
};

export default WeekListWithRecipes;
