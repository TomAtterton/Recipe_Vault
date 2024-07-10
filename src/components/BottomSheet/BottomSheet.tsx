import React from 'react';
import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { renderBackdrop } from 'src/components/BackDrop';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/components/BottomSheet/bottomSheet.style';

interface Props extends BottomSheetModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  snapPoints: (number | string)[];
  title?: string;
}

const BottomSheet = ({ bottomSheetRef, children, snapPoints, title, ...props }: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const bottomSheetSnapPoints = snapPoints?.length > 0 ? snapPoints : ['50%'];

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={bottomSheetSnapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.bottomSheetContainer, { backgroundColor: colors.lightBackground }]}
      style={[
        {
          backgroundColor: colors.lightBackground,
        },
        styles.bottomSheetContainer,
      ]}
      handleStyle={[
        {
          backgroundColor: colors.lightBackground,
        },
        styles.bottomSheetContainer,
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.onBackground,
      }}
      {...props}
    >
      {!!title && (
        <Typography
          variant={'titleMedium'}
          style={[
            styles.title,
            {
              color: colors.onBackground,
            },
          ]}
        >
          {title}
        </Typography>
      )}

      {children}
    </BottomSheetModal>
  );
};
export default BottomSheet;
