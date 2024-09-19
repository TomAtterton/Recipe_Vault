import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';

import { injectedJavaScript, onHandleGoogleSearch } from '@/screens/RecipeWebview/webviewUtils';
import BookmarkPage from '@/screens/RecipeWebview/components/BookmarkPage';
import AddButton from '@/screens/RecipeWebview/components/AddButton';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useStyles } from 'react-native-unistyles';
import BrowserInput from '@/components/inputs/BrowserInput';
import useHandleUrl from '@/screens/RecipeWebview/hooks/useHandleUrl';
import useHandleDetection from '@/screens/RecipeWebview/hooks/useHandleDetection';
import useHandleBookmark from '@/screens/RecipeWebview/hooks/useHandleBookmark';
import stylesheet from './recipeWebview.style';
import { useSharedValue } from 'react-native-reanimated';

const DEFAULT_URL = 'https://www.google.com/';

const RecipeWebview = ({
  route,
}: {
  route: {
    params?: {
      url?: string;
    };
  };
}) => {
  const [uri, setUri] = useState(route.params?.url || DEFAULT_URL);

  const { webViewRef, isBackEnabled, isForwardEnabled, handleWebViewNavigationStateChange } =
    useHandleUrl(setUri);

  const { handleMessage, recipeDetected, handleAddRecipe } = useHandleDetection(uri);

  const { showBookmark, setShowBookmark, handleShowBookmarkModal, handleLinkPress } =
    useHandleBookmark(uri, setUri);

  const handleUrlSubmit = (newUrl: string) => {
    const handledUrl = onHandleGoogleSearch(newUrl);
    setUri(handledUrl);
    setShowBookmark(false);
  };

  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const loadingProgress = useSharedValue(0);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            marginBottom: tabBarHeight,
          },
        ]}
      >
        <BrowserInput
          onShowBookmarkModal={handleShowBookmarkModal}
          webviewRef={webViewRef}
          url={uri}
          handleUrlSubmit={handleUrlSubmit}
          showBookmark={showBookmark}
          setShowBookmark={setShowBookmark}
          isBackEnabled={isBackEnabled?.current}
          isForwardEnabled={isForwardEnabled?.current}
          loadingProgress={loadingProgress}
        />
        <WebView
          ref={webViewRef}
          style={styles.webview}
          source={{ uri }}
          onMessage={handleMessage}
          injectedJavaScript={injectedJavaScript}
          injectedJavaScriptForMainFrameOnly={false}
          webviewDebuggingEnabled={__DEV__}
          allowsInlineMediaPlayback={false}
          allowsAirPlayForMediaPlayback={false}
          onLoadProgress={({ nativeEvent }) => {
            loadingProgress.value = nativeEvent.progress * 100;
          }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          decelerationRate="normal"
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          hideKeyboardAccessoryView
          mediaPlaybackRequiresUserAction={true}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />
        {recipeDetected && <AddButton handleAddRecipe={handleAddRecipe} />}
        <BookmarkPage
          showBookmark={showBookmark}
          onLinkPress={handleLinkPress}
          onShowBookmarkModal={handleShowBookmarkModal}
        />
      </View>
    </>
  );
};

export default RecipeWebview;
