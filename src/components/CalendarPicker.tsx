import React, { useState, useRef, useCallback } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import { MenuView } from '@react-native-menu/menu';
import { format } from 'date-fns';
import usePostMealPlan from '@/database/api/mealplan/usePostMealPlan';
import Typography from '@/components/Typography';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import IconButton from '@/components/buttons/IconButton';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { showErrorMessage, showSuccessMessage } from '@/utils/promptUtils';
import { translate } from '@/core';

interface Props {
  title?: string;
  id?: string;
  containerStyle?: StyleProp<ViewStyle>;
  initialValue?: Date;
}

const CalendarPicker = ({ title, id, initialValue = new Date() }: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetRef>(null);
  const [selectDate, setSelectDate] = useState(initialValue);
  const [entryType, setEntryType] = useState<'dinner' | 'breakfast' | 'lunch'>('dinner');

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
      showSuccessMessage(translate('calendar_picker.success_message'));
    } catch (e) {
      showErrorMessage(translate('calendar_picker.error_message'));
      console.log('error', e);
    }
  }, [addMealPlan, entryType, id, selectDate, title]);

  const handleSavePress = useCallback(async () => {
    await onAddToMealPlan();
    bottomSheetModalRef.current?.dismiss();
  }, [onAddToMealPlan]);

  const { styles } = useStyles(stylesheet);

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
      <BottomSheet bottomSheetRef={bottomSheetModalRef} snapPoints={['40%']}>
        <View style={styles.contentContainer}>
          <Typography variant={'titleLarge'} style={styles.title}>
            {translate('calendar_picker.title')}
          </Typography>
          <View style={styles.datePickerContainer}>
            <Typography variant={'titleMedium'}>{translate('calendar_picker.date')}</Typography>
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
                title: translate('calendar_picker.dinner'),
              },
              {
                id: 'lunch',
                title: translate('calendar_picker.lunch'),
              },
              {
                id: 'breakfast',
                title: translate('calendar_picker.breakfast'),
              },
            ]}
            onPressAction={({ nativeEvent }) => {
              const event = nativeEvent?.event;
              if (!event) return;
              setEntryType(event as 'dinner' | 'breakfast' | 'lunch');
            }}
          >
            <View style={styles.chowMomentsContainer}>
              <Typography variant={'titleMedium'}>
                {translate('calendar_picker.chow_moments')}
              </Typography>
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
          style={[styles.saveButton]}
          onPress={handleSavePress}
          title={translate('calendar_picker.save_button')}
        />
      </BottomSheet>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  contentContainer: {
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
    position: 'absolute',
    bottom: miniRuntime.insets.bottom,
    left: 0,
    right: 0,
    marginHorizontal: 16,
  },
}));

export default CalendarPicker;
