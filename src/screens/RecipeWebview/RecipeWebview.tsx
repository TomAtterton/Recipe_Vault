import React from 'react';
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

const RecipeWebview = ({
  route,
}: {
  route: {
    params?: {
      url?: string;
    };
  };
}) => {
  const {
    uri,
    setUri,
    webViewRef,
    isBackEnabled,
    isForwardEnabled,
    handleWebViewNavigationStateChange,
  } = useHandleUrl(route.params?.url);

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
        />
        <WebView
          ref={webViewRef}
          style={styles.webview}
          source={{ uri }}
          onMessage={handleMessage}
          injectedJavaScript={injectedJavaScript}
          injectedJavaScriptForMainFrameOnly={false}
          webviewDebuggingEnabled={true}
          allowsInlineMediaPlayback={false}
          allowsAirPlayForMediaPlayback={false}
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
        <BookmarkPage
          showBookmark={showBookmark}
          onLinkPress={handleLinkPress}
          onShowBookmarkModal={handleShowBookmarkModal}
        />
        {recipeDetected && <AddButton handleAddRecipe={handleAddRecipe} />}
      </View>
    </>
  );
};

export default RecipeWebview;
