import React from 'react';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/components/BottomSheet/bottomSheet.style';
import { SheetSize, TrueSheet, TrueSheetProps } from '@lodev09/react-native-true-sheet';

interface Props extends TrueSheetProps {
  bottomSheetRef: React.RefObject<TrueSheet>;
  children: React.ReactNode;
  snapPoints?: SheetSize[];
  title?: string;
}

const BottomSheet = ({ bottomSheetRef, children, snapPoints, title, ...props }: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const bottomSheetSnapPoints =
    (snapPoints?.length || 0) > 0 ? snapPoints : (['50%'] as SheetSize[]);

  return (
    <TrueSheet
      ref={bottomSheetRef}
      sizes={bottomSheetSnapPoints}
      cornerRadius={24}
      backgroundColor={colors.lightBackground}
      contentContainerStyle={{
        ...styles.bottomSheetContainer,
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
    </TrueSheet>
  );
};

export default BottomSheet;
