import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import { MenuView } from '@react-native-menu/menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import usePostMealPlan from '@/database/api/mealplan/usePostMealPlan';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import IconButton from '@/components/buttons/IconButton';
import BottomSheet from '@/components/BottomSheet';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';

interface Props {
  title?: string;
  id?: string;
  containerStyle?: StyleProp<ViewStyle>;
  initialValue?: Date;
}

const CalendarPicker = ({ title, id, initialValue = new Date() }: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectDate, setSelectDate] = useState(initialValue);
  const [entryType, setEntryType] = useState<'dinner' | 'breakfast' | 'lunch'>('dinner');
  const {} = useStyles();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { addMealPlan } = usePostMealPlan();
  const onAddToMealPlan = useCallback(async () => {
    try {
      await addMealPlan({
        // @ts-ignore
        title,
        // @ts-ignore
        recipeId: id,
        date: format(selectDate, 'yyyy-MM-dd'),
        entryType: entryType,
      });
      showSuccessMessage('Meal plan added successfully');
    } catch (e) {
      showErrorMessage('Something went wrong');
      console.log('error', e);
    }
  }, [addMealPlan, entryType, id, selectDate, title]);

  const handleSavePress = useCallback(async () => {
    await onAddToMealPlan();
    bottomSheetModalRef.current?.close();
  }, [onAddToMealPlan]);

  const { bottom } = useSafeAreaInsets();

  const {
    theme: { colors },
  } = useStyles();
  return (
    <View>
      <IconButton
        buttonSize={'medium'}
        iconSource={'calendar-add'}
        onPress={handlePresentModalPress}
      />
      <BottomSheet bottomSheetRef={bottomSheetModalRef} snapPoints={['40%']} enablePanDownToClose>
        <View style={styles.contentContainer}>
          <Typography variant={'titleLarge'} style={styles.title}>
            Add to meal plan!
          </Typography>
          <View style={styles.datePickerContainer}>
            <Typography variant={'titleMedium'}>Date:</Typography>
            <RNDateTimePicker
              style={styles.datePicker}
              value={selectDate}
              display="calendar"
              // @ts-ignore issue with the library
              themeVariant="dark"
              onChange={(event, date) => {
                date && setSelectDate(date);
              }}
            />
          </View>

          <MenuView
            actions={[
              {
                id: 'dinner',
                title: 'Dinner',
              },
              {
                id: 'lunch',
                title: 'Lunch',
              },
              {
                id: 'breakfast',
                title: 'Breakfast',
              },
            ]}
            onPressAction={({ nativeEvent }) => {
              const event = nativeEvent?.event;
              if (!event) return;
              setEntryType(event as 'dinner' | 'breakfast' | 'lunch');
            }}
          >
            <View style={styles.chowMomentsContainer}>
              <Typography variant={'titleMedium'}>{'Chow Moments: '}</Typography>
              <Typography
                variant={'bodyLarge'}
                style={[styles.entryTypeText, { color: colors.primary }]}
              >
                {entryType}
              </Typography>
            </View>
          </MenuView>
        </View>
        <PrimaryButton
          style={[styles.saveButton, { marginBottom: bottom }]}
          onPress={handleSavePress}
          title={'Save to meal plan'}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  datePicker: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chowMomentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    marginHorizontal: 16,
  },
  saveTitle: {
    fontWeight: 'bold',
  },
});

export default CalendarPicker;
