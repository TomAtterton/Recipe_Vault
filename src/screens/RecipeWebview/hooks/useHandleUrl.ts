import { WebViewNavigation } from 'react-native-webview/src/WebViewTypes';
import { injectedJavaScript } from '@/screens/RecipeWebview/webviewUtils';
import { useRef } from 'react';
import WebView from 'react-native-webview';
import { addHistory } from '@/store';

const useHandleUrl = (setUri: (uri: string) => void) => {
  const webViewRef = useRef<WebView>(null);
  const oldUri = useRef<string | undefined>();
  const isBackEnabled = useRef(false);
  const isForwardEnabled = useRef(false);

  const handleWebViewNavigationStateChange = (newNavState: WebViewNavigation) => {
    const { title, url, navigationType, canGoForward, canGoBack } = newNavState;

    if (navigationType === 'click' || navigationType === 'other') {
      return;
    }

    if (!navigationType && url !== oldUri.current) {
      addHistory({ name: title || url, url });
    }

    isBackEnabled.current = canGoBack;
    isForwardEnabled.current = canGoForward;

    if (navigationType === 'backforward') {
      webViewRef?.current?.injectJavaScript(injectedJavaScript);
    }

    if (!url) return;

    if (url === oldUri.current) return;
    oldUri.current = url;
    setUri(url);
  };

  return {
    webViewRef,
    isBackEnabled,
    isForwardEnabled,
    handleWebViewNavigationStateChange,
  };
};

export default useHandleUrl;
