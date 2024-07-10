import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { ICON_SIZE, stylesheet } from './browserInput.style';
import Animated, { SlideInRight } from 'react-native-reanimated';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import Input from '@/components/inputs';
import IconButton from '@/components/buttons/IconButton';
import LabelButton from '@/components/buttons/LabelButton';

interface Props {
  onShowBookmarkModal: (item: { id?: string; name?: string }) => void;
  webviewRef: React.MutableRefObject<WebView | null>;
  url: string;
  handleUrlSubmit: (url: string) => void;
  showBookmark: boolean;
  setShowBookmark: (show: boolean) => void;
  isBackEnabled: boolean;
  isForwardEnabled: boolean;
}

const AnimatedButton = Animated.createAnimatedComponent(LabelButton);

const BrowserBar = ({
  onShowBookmarkModal,
  webviewRef,
  url,
  handleUrlSubmit,
  showBookmark,
  setShowBookmark,
  isBackEnabled,
  isForwardEnabled,
}: Props) => {
  const { top } = useSafeAreaInsets();

  const [urlValue, setUrlValue] = useState('https://google.com');
  const onSubmit = () => {
    handleUrlSubmit(urlValue);
  };

  useEffect(() => {
    setUrlValue(url);
  }, [url]);

  const isFocused = showBookmark;

  const handleBookmarkClick = () => onShowBookmarkModal({});

  const { styles, theme } = useStyles(stylesheet);
  const textInputRef = useRef<TextInput>(null);

  const titleUrl = useMemo(() => {
    // Remove http://, https:// and www
    let simplified = url.replace(/(https?:\/\/)?(www\.)?/, '');

    // Find the index of the second slash
    let secondSlashIndex = simplified.indexOf('/', simplified.indexOf('/') + 1);

    // If a second slash is found, slice up to that index, otherwise return the whole string
    if (secondSlashIndex !== -1) {
      return simplified.slice(0, secondSlashIndex);
    }

    return simplified;
  }, [url]);

  return (
    <View style={[styles.container, { marginTop: top }]}>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.inputContentContainer,
            {
              borderColor: isFocused ? theme.colors.primary : theme.colors.onBackground,
            },
          ]}
        >
          <IconButton
            iconSource={'bookmark-add'}
            buttonSize={'small'}
            iconSize={ICON_SIZE}
            onPress={handleBookmarkClick}
          />
          {!isFocused && (
            <IconButton
              buttonSize={'small'}
              iconSize={ICON_SIZE}
              disabled={!isBackEnabled}
              iconSource={'arrow-left'}
              onPress={() => {
                webviewRef.current?.goBack();
              }}
            />
          )}

          <Input
            ref={textInputRef}
            style={styles.input}
            containerStyle={styles.inputContainer}
            value={urlValue}
            onChangeText={setUrlValue}
            spellCheck={false}
            selectTextOnFocus={true}
            numberOfLines={1}
            placeholder="Enter URL"
            returnKeyType={'go'}
            onSubmitEditing={onSubmit}
            blurOnSubmit
            onFocus={() => {
              setShowBookmark(true);
            }}
          />

          {!isFocused && (
            <TouchableOpacity style={styles.title} onPress={() => textInputRef.current?.focus()}>
              <Typography variant={'bodyMedium'} numberOfLines={1}>
                {titleUrl}
              </Typography>
            </TouchableOpacity>
          )}

          {!isFocused && (
            <>
              <IconButton
                disabled={!isForwardEnabled}
                iconSource={'arrow-right'}
                buttonSize={'small'}
                iconSize={ICON_SIZE}
                onPress={webviewRef.current?.goForward}
              />
              <IconButton
                iconSource={'reload'}
                buttonSize={'small'}
                iconSize={ICON_SIZE}
                onPress={webviewRef.current?.reload}
              />
            </>
          )}
        </View>
        {isFocused && (
          <AnimatedButton
            entering={SlideInRight}
            style={styles.cancelButton}
            onPress={() => {
              Keyboard.dismiss();
              setUrlValue(url);
              setShowBookmark(false);
            }}
            title={'cancel'}
          />
        )}
      </View>
    </View>
  );
};

export default BrowserBar;
