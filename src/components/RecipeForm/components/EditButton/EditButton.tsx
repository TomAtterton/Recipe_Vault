import NavBarButton from '@/components/buttons/NavBarButton';
import * as React from 'react';
import { MenuView } from '@react-native-menu/menu';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface Props {
  onPress: () => void;
}

const EditButton = ({ onPress }: Props) => {
  const { styles } = useStyles(stylesheet);
  return (
    <MenuView
      style={styles.container}
      actions={[
        {
          title: 'Clear Form',
          id: 'Clear',
          attributes: {
            destructive: true,
          },
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        const event = nativeEvent?.event;
        if (!event) return;
        if (event === 'Clear') {
          onPress();
        }
      }}
    >
      <NavBarButton iconSource={'settings'} />
    </MenuView>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export default EditButton;
