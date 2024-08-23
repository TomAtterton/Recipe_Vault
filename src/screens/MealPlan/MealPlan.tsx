import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, { SlideInUp, LinearTransition, Easing } from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

import { RecipeDetailType } from '@/types';
import useMealPlan from '@/screens/MealPlan/hooks/useMealPlan';
import useSyncOnFocus from '@/database/hooks/useSyncOnFocus';
import Footer from 'src/screens/MealPlan/components/Footer';
import MealPlanMenuSelection from 'src/components/MealPlanMenuSelection';
import Typography from '@/components/Typography';
import SmallHorizontalCard from '@/components/cards/SmallHorizontalCard';
import Icon from '@/components/Icon';
import { stylesheet } from './mealPlan.style';
import { Routes } from '@/navigation/Routes';

export type MealPlanType = {
  date: string;
  entryType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title?: string;
  text?: string;
  recipeId?: string;
  image?: string;
  servings?: number;
  id: string;
  recipe?: RecipeDetailType;
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const keyExtractor = (item: MealPlanType) => item.id;

const WeekListWithRecipes = () => {
  const { currentDate, getCurrentDateByDay, currentWeek, data, weekOffset, setWeekOffset } =
    useMealPlan();
  const { styles } = useStyles(stylesheet);
  const tabBarHeight = useBottomTabBarHeight();
  const scrollViewRef = React.useRef(null);

  useScrollToTop(scrollViewRef);
  useSyncOnFocus();

  const renderDayPlans = useMemo(() => {
    return daysOfWeek.map((day, index) => (
      <DayPlan
        key={day}
        index={index}
        currentDate={currentDate}
        dayData={data[day]}
        getCurrentDateByDay={getCurrentDateByDay}
      />
    ));
  }, [currentDate, data, getCurrentDateByDay]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.contentContainer}
        entering={SlideInUp.duration(500)}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 60 }}
      >
        {renderDayPlans}
      </Animated.ScrollView>
      <Footer currentWeek={currentWeek} weekOffset={weekOffset} onWeekChange={setWeekOffset} />
    </View>
  );
};

const DayPlan = React.memo(
  ({
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

    const handleDayPress = useCallback(
      (event: 'dinner' | 'breakfast' | 'lunch') => {
        const selectDate = getCurrentDateByDay(index);
        navigate(Routes.Search, { selectDate, entryType: event });
      },
      [getCurrentDateByDay, index, navigate]
    );

    const handleRenderItem = useCallback(
      ({ item }: { item: MealPlanType }) => <SmallHorizontalCard item={item} />,
      []
    );

    return (
      <Animated.View
        style={styles.dayColumn}
        layout={LinearTransition.easing(Easing.ease).duration(300)}
      >
        <View style={styles.dayHeadingContainer}>
          <Typography
            variant={'titleMedium'}
            style={{ color: isToday ? colors.primary : colors.onBackground }}
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
  }
);

export default WeekListWithRecipes;
