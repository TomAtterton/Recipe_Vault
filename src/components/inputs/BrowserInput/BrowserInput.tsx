import { TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import WebView from 'react-native-webview';
import { ICON_SIZE, stylesheet } from './browserInput.style';
import Animated, { SlideInRight } from 'react-native-reanimated';
import Typography from '@/components/Typography';
import { useStyles } from 'react-native-unistyles';
import IconButton from '@/components/buttons/IconButton';
import LabelButton from '@/components/buttons/LabelButton';
import { translate } from '@/core';
import { useFloatingInput } from '@/providers/FloatingInputProvider';

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
  const { styles, theme } = useStyles(stylesheet);

  const handleSubmit = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }
      handleUrlSubmit(value);
    },
    [handleUrlSubmit]
  );

  const isFocused = showBookmark;

  const handleBookmarkClick = () => onShowBookmarkModal({});

  const titleUrl = useMemo(() => {
    let simplified = url.replace(/(https?:\/\/)?(www\.)?/, '');
    let secondSlashIndex = simplified.indexOf('/', simplified.indexOf('/') + 1);
    return secondSlashIndex !== -1 ? simplified.slice(0, secondSlashIndex) : simplified;
  }, [url]);

  const { showInput } = useFloatingInput();
  return (
    <View style={styles.container}>
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
          <IconButton
            buttonSize={'small'}
            iconSize={ICON_SIZE}
            disabled={!isBackEnabled}
            iconSource={'arrow-left'}
            onPress={() => {
              webviewRef.current?.goBack();
            }}
          />
          <TouchableOpacity
            style={styles.title}
            onPress={() => {
              setShowBookmark(true);
              console.log('input', url);
              showInput &&
                showInput({
                  placeholder: 'Enter URL',
                  initialValue: url,
                  onSubmit: handleSubmit,
                  multiline: true,
                  additionalInputProps: {
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    returnKeyType: 'next',
                  },
                });
            }}
          >
            <Typography variant={'bodyMedium'} numberOfLines={1}>
              {titleUrl}
            </Typography>
          </TouchableOpacity>
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
        </View>
        {isFocused && (
          <AnimatedButton
            entering={SlideInRight}
            style={styles.cancelButton}
            onPress={() => {
              setShowBookmark(false);
            }}
            title={translate('default.cancel')}
          />
        )}
      </View>
    </View>
  );
};

export default BrowserBar;
