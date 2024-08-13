import React, { useRef, useMemo, memo } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { stylesheet } from './numberPicker.style';

import { useController } from 'react-hook-form';
import { controlNameType, controlType } from '@/utils/recipeFormUtil';
import Typography from '@/components/Typography';
import InfoLabelButton from '@/components/buttons/InfoLabelButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { useStyles } from 'react-native-unistyles';

interface Props {
  control: controlType;
  name: controlNameType;
  containerStyle?: StyleProp<ViewStyle>;
  title: string;
  description: string;
  valueSuffix?: string;
}

const numberItems = Array.from({ length: 30 });

const NumberPicker = ({
  name,
  control,
  title,
  description,
  valueSuffix,
  containerStyle,
}: Props) => {
  const { field } = useController({ control, name });
  const bottomSheetModalRef = useRef<BottomSheetRef>(null);
  const { styles } = useStyles(stylesheet);
  const selectedNumber = field?.value;

  const buttonTitle = useMemo(
    () => selectedNumber + (valueSuffix ? ' ' + valueSuffix : ''),
    [selectedNumber, valueSuffix]
  );

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleSavePress = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const renderPickerItems = useMemo(() => {
    return numberItems.map((_, i) => <Picker.Item key={i} label={`${i}`} value={i} />);
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <InfoLabelButton title={title} buttonTitle={buttonTitle} onPress={handlePresentModalPress} />
      <BottomSheet bottomSheetRef={bottomSheetModalRef}>
        <View style={styles.contentContainer}>
          <Typography style={styles.title}>{title}</Typography>
          <Typography style={styles.description}>{description}</Typography>
          <Picker
            selectedValue={selectedNumber}
            onValueChange={(value) => {
              value && field.onChange(+value);
            }}
            itemStyle={styles.itemStyle}
          >
            {renderPickerItems}
          </Picker>
          <PrimaryButton style={styles.saveButton} onPress={handleSavePress} title={'Save'} />
        </View>
      </BottomSheet>
    </View>
  );
};

export default memo(NumberPicker);
