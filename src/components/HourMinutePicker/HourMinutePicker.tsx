import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';

import { useController } from 'react-hook-form';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import Typography from '@/components/Typography';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import BottomSheet from '@/components/BottomSheet';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './hourMinutePicker.style';

interface Props {
  control: controlType;
  name: controlNameType;
  title: string;
  description: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const numberOfHours = 24;
const numberOfMinutes = 60;

const hourItems = Array.from({ length: numberOfHours });
const minuteItems = Array.from({ length: numberOfMinutes });

const HourMinutePicker = ({ control, name, title, description, containerStyle }: Props) => {
  const { field } = useController({ control, name });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
  const { styles } = useStyles(stylesheet);
  useEffect(() => {
    setSelectedHour(initialHours);
    setSelectedMinute(initialMinutes);
  }, [initialHours, initialMinutes]);

  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  const buttonTitle = useMemo(() => {
    const currentHours =
      selectedHour === 0 ? '' : `${selectedHour} hour${selectedHour > 1 ? 's' : ''}`;
    const currentMinutes =
      selectedMinute === 0 ? '' : `${selectedMinute} minute${selectedMinute > 1 ? 's' : ''}`;
    return `${currentHours} ${currentMinutes}`;
  }, [selectedHour, selectedMinute]);

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

  const renderHourItems = useMemo(() => {
    return hourItems.map((_, i) => <Picker.Item key={i} label={`${i}`} value={i} />);
  }, []);

  const renderMinuteItems = useMemo(() => {
    return minuteItems.map((_, i) => <Picker.Item key={i} label={`${i}`} value={i} />);
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <InfoLabelButton title={title} buttonTitle={buttonTitle} onPress={handlePresentModalPress} />
      <BottomSheet bottomSheetRef={bottomSheetModalRef} onDismiss={handleSavePress}>
        <View style={styles.contentContainer}>
          <Typography variant={'titleMedium'} style={styles.title}>
            {title}
          </Typography>
          <Typography variant={'bodyMediumItalic'} style={styles.description}>
            {description}
          </Typography>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedHour}
              onValueChange={setSelectedHour}
              itemStyle={styles.pickerItem}
            >
              {renderHourItems}
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
              {renderMinuteItems}
            </Picker>
            <View style={styles.labelContainer}>
              <Typography style={styles.labelText}>Mins</Typography>
            </View>
          </View>
          <PrimaryButton style={styles.saveButton} onPress={handleSavePress} title={'Save'} />
        </View>
      </BottomSheet>
    </View>
  );
};

export default HourMinutePicker;
