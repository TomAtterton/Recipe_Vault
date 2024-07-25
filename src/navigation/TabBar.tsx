import { Pressable } from 'react-native';
import { Routes } from '@/navigation/Routes';
import Icon from '@/components/Icon';
import * as React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from '@/navigation/tabBar.style';
import { IconName } from '@/components/Icon/types';
import { useBoundStore } from '@/store';

const TAB_ICONS = {
  [Routes.Home]: 'open-book',
  [Routes.RecipeWebview]: 'safari',
  [Routes.AddRecipe]: 'recipe-add',
  [Routes.MealPlan]: 'calendar-curve',
  [Routes.Groceries]: 'shopping-border',
};

export const TabBar = ({ state, descriptors, navigation, insets }: BottomTabBarProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const tabBarHeight = 45 + insets.bottom;
  const darkMode = useBoundStore((_) => _.darkMode);
  return (
    <BlurView
      tint={darkMode ? 'dark' : 'light'}
      intensity={100}
      style={[
        styles.container,
        {
          height: tabBarHeight,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            {!!route?.name && (
              <Icon
                size={24}
                // @ts-ignore
                name={TAB_ICONS[route?.name] as IconName}
                color={isFocused ? theme.colors.primary : theme.colors.onBackground}
              />
            )}
          </Pressable>
        );
      })}
    </BlurView>
  );
};
