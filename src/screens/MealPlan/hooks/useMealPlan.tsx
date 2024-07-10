import { useCallback, useMemo, useState } from 'react';
import { addDays, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { MealPlanType } from '@/screens/MealPlan/MealPlan';
import useGetMealplan from '@/database/api/mealplan/useGetMealplan';
import { useFocusEffect } from '@react-navigation/native';

type GroupedDataType = {
  [day: string]: MealPlanType[];
};

const useMealPlan = () => {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekOffset, setWeekOffset] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setCurrentDate(new Date().toISOString().split('T')[0]);
    }, [])
  );

  const startDateOfWeek = useMemo(
    () => startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 }),
    [weekOffset, today]
  );

  const currentWeek = useMemo(() => {
    const start = format(startDateOfWeek, 'dd MMM');
    const end = format(endOfWeek(startDateOfWeek, { weekStartsOn: 1 }), 'dd MMM');
    return `${start} - ${end}`;
  }, [startDateOfWeek]);

  const getCurrentDateByDay = (day: number) => {
    return format(addDays(startDateOfWeek, day), 'yyyy-MM-dd');
  };

  const { data } = useGetMealplan({
    startDate: format(startDateOfWeek, 'yyyy-MM-dd'),
    endDate: format(addDays(endOfWeek(startDateOfWeek, { weekStartsOn: 1 }), 1), 'yyyy-MM-dd'),
  });

  const groupedData: GroupedDataType = useMemo(() => {
    const list: GroupedDataType = {};

    if (data) {
      data.forEach((item) => {
        const day = item.date ? format(new Date(item.date), 'EEEE') : undefined;

        if (day && !list[day]) {
          list[day] = [];
        }
        day && item && list[day].push(item as MealPlanType);
      });
    }

    return list;
  }, [data]);

  return {
    currentDate,
    getCurrentDateByDay,
    currentWeek,
    data: groupedData,
    weekOffset,
    setWeekOffset,
  };
};

export default useMealPlan;
