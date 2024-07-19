import React, { useMemo, useState } from 'react';
import { Keyboard, StyleProp, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import HomeAnimation from '@/screens/Home/homeAnimation';

import { useStyles } from 'react-native-unistyles';
import SquircleDynamicContainer from '@/components/SquircleDynamicContainer';
import Icon from '@/components/Icon';
import Input from '@/components/inputs';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import Typography from '@/components/Typography';
import { stylesheet } from '@/screens/Home/components/SearchBar/searchBar.style';
import { translate } from '@/core';

interface Props {
  style?: StyleProp<ViewStyle>;
  searchText: string;
  setSearchText: (text: string) => void;
  onFocus?: () => void;
  setShowingSearch?: (showing: boolean) => void;
  showingSearch?: boolean;
}

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

const DEFAULT_HEIGHT = 48;
const DEFAULT_WIDTH = SCREEN_WIDTH - 40;

const SearchBar = ({
  style,
  searchText,
  setSearchText,
  onFocus,
  setShowingSearch,
  showingSearch,
}: Props) => {
  const searchRef = React.useRef<TextInput>(null);
  const { styles, theme } = useStyles(stylesheet);
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = useMemo(() => {
    if (isFocused) {
      return theme.colors.primary;
    }
    return theme.colors.onBackground;
  }, [isFocused, theme.colors.onBackground, theme.colors.primary]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          // @ts-ignore
          backgroundColor: theme.colors.inputBackground,
        },
        style,
      ]}
      {...HomeAnimation.searchBarAnimation}
    >
      <SquircleDynamicContainer
        style={styles.squircleContainer}
        height={DEFAULT_HEIGHT}
        width={DEFAULT_WIDTH}
        color={borderColor}
        animationDuration={400}
        {...HomeAnimation.searchContainerAnimation}
      >
        <View
          style={[
            styles.contentContainer,
            {
              borderColor,
            },
          ]}
        >
          <Icon name={'search'} color={theme.colors.onBackground} />
          <Input
            ref={searchRef}
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={theme.colors.placeholder}
            placeholder={translate('home.search.placeholder')}
            returnKeyType={'search'}
            inputMode={'search'}
            onBlur={() => {
              setIsFocused(false);
            }}
            onFocus={() => {
              setIsFocused(true);
              onFocus && onFocus();
            }}
          />
        </View>
      </SquircleDynamicContainer>
      {showingSearch && (
        <AnimatedButton
          style={styles.cancelButton}
          onPress={() => {
            setShowingSearch && setShowingSearch(false);
            setSearchText('');
            Keyboard.dismiss();
          }}
          {...HomeAnimation.searchCancelButtonAnimation}
        >
          <Typography
            style={{
              color: theme.colors.primary,
            }}
          >
            {translate('default.cancel')}
          </Typography>
        </AnimatedButton>
      )}
    </Animated.View>
  );
};

export default SearchBar;
