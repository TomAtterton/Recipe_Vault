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
  const [currentDate, setCurrentDate] = useState<string>(today.toISOString().split('T')[0]);
  const [weekOffset, setWeekOffset] = useState<number>(0);

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

  const getCurrentDateByDay = useCallback(
    (day: number): string => format(addDays(startDateOfWeek, day), 'yyyy-MM-dd'),
    [startDateOfWeek]
  );

  const { data } = useGetMealplan({
    startDate: format(startDateOfWeek, 'yyyy-MM-dd'),
    endDate: format(addDays(endOfWeek(startDateOfWeek, { weekStartsOn: 1 }), 1), 'yyyy-MM-dd'),
  });

  const groupedData: GroupedDataType = useMemo(() => {
    const list: GroupedDataType = {};
    const order = ['breakfast', 'lunch', 'dinner'];

    if (data) {
      data.forEach((item) => {
        const day = item.date ? format(new Date(item.date), 'EEEE') : undefined;

        if (day) {
          if (!list[day]) {
            list[day] = [];
          }

          // Insert the item in the correct position based on entryType
          const index = list[day].findIndex(
            (meal) => order.indexOf(meal.entryType) > order.indexOf(item.entryType)
          );
          if (index === -1) {
            list[day].push(item as MealPlanType);
          } else {
            list[day].splice(index, 0, item as MealPlanType);
          }
        }
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
