import React, { useRef, useMemo, useCallback } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import styles from './numberPicker.style';

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
  containerStyle?: StyleProp<ViewStyle>;
  title: string;
  description: string;
  valueSuffix?: string;
}

const NumberPicker = ({
  name,
  control,
  title,
  description,
  valueSuffix,
  containerStyle,
}: Props) => {
  const { field } = useController({ control, name });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { theme } = useStyles();

  const selectedNumber = field?.value;

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSavePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const renderPickerItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= 100; i++) {
      items.push(<Picker.Item key={i} label={`${i}`} value={i} />);
    }
    return items;
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <InfoLabelButton
        title={title}
        buttonTitle={selectedNumber + (valueSuffix ? ' ' + valueSuffix : '')}
        onPress={handlePresentModalPress}
      />
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        handleIndicatorStyle={{ backgroundColor: theme.colors.onBackground }}
        snapPoints={['50%']}
        enablePanDownToClose
        onDismiss={handleSavePress}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
      >
        <View style={styles.contentContainer}>
          <Typography style={styles.title}>{title}</Typography>
          <Typography style={styles.description}>{description}</Typography>
          <Picker
            selectedValue={selectedNumber}
            onValueChange={(value) => {
              // convert to number
              value && field.onChange(+value);
            }}
            itemStyle={styles.itemStyle}
          >
            {renderPickerItems}
          </Picker>
          <PrimaryButton style={styles.saveButton} onPress={handleSavePress} title={'Save'} />
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default NumberPicker;
