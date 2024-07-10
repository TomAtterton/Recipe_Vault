import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';

import { renderBackdrop } from '@/components/BackDrop';
import { useController } from 'react-hook-form';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface Props {
  control: controlType;
  name: controlNameType;
  title: string;
  description: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const numberOfHours = 24;
const numberOfMinutes = 60;

const HourMinutePicker = ({ control, name, title, description, containerStyle }: Props) => {
  const { field } = useController({ control, name });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['50%'], []);
  const { theme } = useStyles();
  const { initialHours, initialMinutes } = useMemo(() => {
    if (field.value) {
      const parts = (field.value as string)?.toLowerCase()?.split(' ');
      if (parts.length === 2) {
        const time = parseInt(parts[0], 10);
        const unit = parts[1];

        if (!isNaN(time) && (unit === 'minutes' || unit === 'minute')) {
          return {
            initialHours: 0,
            initialMinutes: time,
          };
        } else if (!isNaN(time) && (unit === 'hours' || unit === 'hour')) {
          return {
            initialHours: time,
            initialMinutes: 0,
          };
        }
      } else if (parts.length === 4) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[2], 10);

        if (!isNaN(hours) && !isNaN(minutes)) {
          return {
            initialHours: hours,
            initialMinutes: minutes,
          };
        }
      }
    }
    return {
      initialHours: 0,
      initialMinutes: 0,
    };
  }, [field.value]);

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  useEffect(() => {
    setSelectedHour(initialHours);
    setSelectedMinute(initialMinutes);
  }, [initialHours, initialMinutes]);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const currentHours =
    selectedHour === 0 ? '' : `${selectedHour} hour${selectedHour > 1 ? 's' : ''}`;
  const currentMinutes =
    selectedMinute === 0 ? '' : `${selectedMinute} minute${selectedMinute > 1 ? 's' : ''}`;

  const handleSavePress = () => {
    let updatedValue = '';
    if (selectedHour > 0) {
      updatedValue = `${selectedHour} hour${selectedHour > 1 ? 's' : ''}`;
      if (selectedMinute > 0) {
        updatedValue += ` ${selectedMinute} minute${selectedMinute > 1 ? 's' : ''}`;
      }
    } else if (selectedMinute > 0) {
      updatedValue = `${selectedMinute} minute${selectedMinute > 1 ? 's' : ''}`;
    }
    field.onChange(updatedValue);
    bottomSheetModalRef.current?.close();
  };

  const renderHourPickerItems = () => {
    return Array.from({ length: numberOfHours }).map((_, i) => (
      <Picker.Item key={i} label={`${i}`} value={i} />
    ));
  };

  const renderMinutePickerItems = () => {
    return Array.from({ length: numberOfMinutes }).map((_, i) => (
      <Picker.Item key={i} label={`${i}`} value={i} />
    ));
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <InfoLabelButton
        title={title}
        buttonTitle={`${currentHours} ${currentMinutes}`}
        onPress={handlePresentModalPress}
      />
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        handleIndicatorStyle={{ backgroundColor: theme.colors.onBackground }}
        enablePanDownToClose
        snapPoints={snapPoints}
        onDismiss={handleSavePress}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
      >
        <View style={styles.contentContainer}>
          <Typography style={styles.title}>{title}</Typography>
          <Typography style={styles.description}>{description}</Typography>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedHour}
              onValueChange={setSelectedHour}
              itemStyle={styles.pickerItem}
            >
              {renderHourPickerItems()}
            </Picker>
            <View style={styles.labelContainer}>
              <Typography style={styles.labelText}>Hours</Typography>
            </View>

            <Picker
              style={styles.picker}
              selectedValue={selectedMinute}
              onValueChange={setSelectedMinute}
              itemStyle={styles.pickerItem}
            >
              {renderMinutePickerItems()}
            </Picker>
            <View style={styles.labelContainer}>
              <Typography style={styles.labelText}>Mins</Typography>
            </View>
          </View>
          <PrimaryButton style={styles.saveButton} onPress={handleSavePress} title={'Save'} />
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  selectedNumber: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  picker: {
    width: '35%',
  },
  pickerItem: {
    color: 'white',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelText: {
    textAlign: 'left',
  },
  saveButton: {
    marginTop: 20,
  },
  saveTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HourMinutePicker;
