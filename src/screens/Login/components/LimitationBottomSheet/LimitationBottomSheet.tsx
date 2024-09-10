import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import Typography from '@/components/Typography';
import { useWindowDimensions, View } from 'react-native';
import LabelButton from '@/components/buttons/LabelButton';
import { Routes } from '@/navigation/Routes';
import React, { useMemo } from 'react';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/screens/Login/login.style';
import { useNavigation } from '@react-navigation/native';

const LimitationBottomSheet = ({
  bottomsheetRef,
}: {
  bottomsheetRef: React.RefObject<BottomSheetRef>;
}) => {
  const { styles } = useStyles(stylesheet);
  const { navigate } = useNavigation();

  const { height } = useWindowDimensions();

  const snapPoints = useMemo(() => [height * 0.4], [height]);

  return (
    <BottomSheet
      bottomSheetRef={bottomsheetRef}
      snapPoints={snapPoints}
      title={'Why the limitation ?'}
      FooterComponent={() => {
        return (
          <LabelButton
            style={styles.proPlanButton}
            title={'Learn more about pro vaults'}
            onPress={() => {
              navigate(Routes.ProPlan);
            }}
          />
        );
      }}
    >
      <View style={styles.proContentContainer}>
        <Typography variant={'bodyMedium'} style={styles.proPlanDescription}>
          Our goal is to give everyone a taste by offering 5 recipe slots for free, you can explore
          the benefits of cloud syncing and see how it fits into your cooking routine.
        </Typography>
        <Typography variant={'bodyMedium'} style={styles.proPlanDescription}>
          If you find that 5 slots aren’t enough, you can always upgrade to our Pro Vault at a later
          point.
        </Typography>
      </View>
    </BottomSheet>
  );
};

export default LimitationBottomSheet;
