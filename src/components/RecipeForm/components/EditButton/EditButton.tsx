import NavBarButton from '@/components/buttons/NavBarButton';
import * as React from 'react';
import { MenuView } from '@react-native-menu/menu';

interface Props {
  onPress: () => void;
}

const menuActions = [
  {
    title: 'Clear Form',
    id: 'Clear',
    attributes: {
      destructive: true,
    },
  },
];

const EditButton = ({ onPress }: Props) => (
  <MenuView
    actions={menuActions}
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

export default EditButton;
