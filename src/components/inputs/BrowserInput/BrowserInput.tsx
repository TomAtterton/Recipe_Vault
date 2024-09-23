import { Share, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import WebView from 'react-native-webview';
import { ICON_SIZE, stylesheet } from './browserInput.style';
import Animated, {
  SharedValue,
  SlideInRight,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
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
  loadingProgress: SharedValue<number>;
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
  loadingProgress,
}: Props) => {
  const { styles, theme } = useStyles(stylesheet);

  const handleSubmit = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }
      handleUrlSubmit(value);
    },
    [handleUrlSubmit],
  );

  const isFocused = showBookmark;

  const handleBookmarkClick = () => onShowBookmarkModal({});

  const titleUrl = useMemo(() => {
    let simplified = url.replace(/(https?:\/\/)?(www\.)?/, '');
    let secondSlashIndex = simplified.indexOf('/', simplified.indexOf('/') + 1);
    return secondSlashIndex !== -1 ? simplified.slice(0, secondSlashIndex) : simplified;
  }, [url]);

  const { showInput } = useFloatingInput();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${loadingProgress.value}%`,
      opacity:
        loadingProgress.value === 100
          ? withTiming(0, {
              duration: 500,
            })
          : 1,
      ...styles.loadingBar,
    };
  }, [loadingProgress.value]);

  const handleSend = () => {
    Share.share({
      message: url,
    });
  };

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
          <Animated.View style={animatedStyle} />
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
        {isFocused ? (
          <AnimatedButton
            entering={SlideInRight}
            style={styles.cancelButton}
            onPress={() => {
              setShowBookmark(false);
            }}
            title={translate('default.cancel')}
          />
        ) : (
          <IconButton
            style={styles.shareButton}
            iconSource={'send'}
            buttonSize={'small'}
            iconSize={ICON_SIZE}
            onPress={handleSend}
          />
        )}
      </View>
    </View>
  );
};
export default BrowserBar;
