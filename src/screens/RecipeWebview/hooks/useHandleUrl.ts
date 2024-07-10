import { WebViewNavigation } from 'react-native-webview/src/WebViewTypes';
import { addHistory } from '@/store';
import { injectedJavaScript } from '@/screens/RecipeWebview/webviewUtils';
import { useRef, useState } from 'react';
import WebView from 'react-native-webview';

const DEFAULT_URL = 'https://google.com/';

const useHandleUrl = (routeUrl?: string) => {
  const [uri, setUri] = useState(routeUrl || DEFAULT_URL);

  const webViewRef = useRef<WebView>(null);
  const isBackEnabled = useRef(false);
  const isForwardEnabled = useRef(false);

  const handleWebViewNavigationStateChange = (newNavState: WebViewNavigation) => {
    const { title, url, navigationType, canGoForward, canGoBack } = newNavState;

    if (url !== uri) {
      addHistory({ name: title || url, url });
    }

    isBackEnabled.current = canGoBack;
    isForwardEnabled.current = canGoForward;

    if (navigationType === 'backforward') {
      webViewRef?.current?.injectJavaScript(injectedJavaScript);
    }

    if (!url) return;

    if (url === uri) return;

    setUri(url);
  };

  return {
    uri,
    setUri,
    webViewRef,
    isBackEnabled,
    isForwardEnabled,
    handleWebViewNavigationStateChange,
  };
};

export default useHandleUrl;
