import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import IconButton from '@/components/buttons/IconButton';
import { IconName } from '@/components/Icon/types';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './navBarButton.style';
import { IconButtonProps } from '@/components/buttons/IconButton/IconButton';

export interface NavBarProps extends IconButtonProps {
  style?: StyleProp<ViewStyle>;
  iconSource: IconName;
}

const NavBarButton = ({ iconSource, ...props }: NavBarProps) => {
  const { styles } = useStyles(stylesheet);

  return <IconButton iconSource={iconSource} {...props} style={[props.style, styles.container]} />;
};
export default NavBarButton;
