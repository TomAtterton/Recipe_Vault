import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import Typography from '@/components/Typography';
import { useWindowDimensions, View } from 'react-native';
import LabelButton from '@/components/buttons/LabelButton';
import { Routes } from '@/navigation/Routes';
import React, { useMemo } from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Login/login.style';
import { useNavigation } from '@react-navigation/native';
import { translate } from '@/core';

const LimitationBottomSheet = ({
  bottomsheetRef,
}: {
  bottomsheetRef: React.RefObject<BottomSheetRef>;
}) => {
  const { styles } = useStyles(stylesheet);
  const { navigate } = useNavigation();

  const { height } = useWindowDimensions();

  const snapPoints = useMemo(() => [height * 0.4], [height]);

  const handleRenderFooter = () => (
    <LabelButton
      style={styles.proPlanButton}
      title={translate('limitation.button')}
      onPress={() => {
        navigate(Routes.ProPlan);
      }}
    />
  );

  return (
    <BottomSheet
      bottomSheetRef={bottomsheetRef}
      snapPoints={snapPoints}
      title={translate('limitation.title')}
      FooterComponent={handleRenderFooter}
    >
      <View style={styles.proContentContainer}>
        <Typography variant={'bodyMedium'} style={styles.proPlanDescription}>
          {translate('limitation.description1')}
        </Typography>
        <Typography variant={'bodyMedium'} style={styles.proPlanDescription}>
          {translate('limitation.description2')}
        </Typography>
      </View>
    </BottomSheet>
  );
};

export default LimitationBottomSheet;
