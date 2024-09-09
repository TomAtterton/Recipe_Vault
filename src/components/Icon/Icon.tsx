import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { ColorValue, TextProps } from 'react-native';
import { IconName } from '@/components/Icon/types';
import React from 'react';

export const IconMoon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'icomoon',
  require('../../../assets/fonts/icomoon.ttf'),
);

interface Props extends TextProps {
  /**
   * Size of the icon, can also be passed as fontSize in the style object.
   *
   * @default 12
   */
  size?: number | undefined;

  /**
   * Name of the icon to show
   *
   * See Icon Explorer app
   */
  name: IconName;

  /**
   * Color of the icon
   */
  color?: ColorValue | number | undefined;
}

const Icon = ({ ...props }: Props) => {
  // @ts-ignore
  return <IconMoon {...props} />;
};

export default Icon;
