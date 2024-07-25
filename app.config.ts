import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Recipe Vault',
  description: `Recipe Vault Mobile App`,
  slug: 'recipeapp',
  version: '0.0.21',
  runtimeVersion: '0.0.21',
  scheme: 'recipeapp',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#19120C',
  },
  updates: {
    checkAutomatically: 'ON_LOAD',
    url: 'https://u.expo.dev/9d67c9e0-c046-4082-b3dc-37c5fcfd0932',
    fallbackToCacheTimeout: 0,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tomatterton.recipeapp',
    usesAppleSignIn: true,
    icon: './assets/icon.png',
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.tomatterton.recipeapp',
  },
  plugins: [
    [
      'expo-asset',
      {
        assets: ['./assets/icon.png', './assets/splash.png'],
      },
    ],
    './plugins/withPodfile',
    'expo-config-plugin-ios-share-extension',

    [
      'expo-secure-store',
      {
        faceIDPermission: false,
      },
    ],
    'expo-apple-authentication',
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io',
        organization: 'tom-atterton',
        project: 'recipe-vault',
      },
    ],
    [
      'expo-dev-launcher',
      {
        launchMode: 'most-recent',
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Inter.ttf',
          './assets/fonts/icomoon.ttf',
          './assets/fonts/DMMono-Regular.ttf',
          './assets/fonts/DMMono-Italic.ttf',
          './assets/fonts/DMMono-Light.ttf',
          './assets/fonts/DMMono-LightItalic.ttf',
          './assets/fonts/DMMono-Medium.ttf',
          './assets/fonts/DMMono-MediumItalic.ttf',
        ],
      },
    ],
    'expo-localization',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '1.8.10',
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          '$(PRODUCT_NAME) needs access to photos to upload images of your tasty recipes',
        cameraPermission:
          '$(PRODUCT_NAME) needs access to camera to upload images of your tasty recipes',
        microphonePermission: false,
      },
    ],
    [
      'expo-av',
      {
        microphonePermission: false,
      },
    ],
    [
      'expo-calendar',
      {
        remindersPermission:
          '$(PRODUCT_NAME) needs access to your reminders to add to shopping list',
        calendarPermission:
          '$(PRODUCT_NAME) doesnt need access to your calendar please ignore if prompted',
      },
    ],
  ],
  extra: {
    ios: {
      teamId: '8A2W9A8E46',
    },
    eas: {
      projectId: '9d67c9e0-c046-4082-b3dc-37c5fcfd0932',
      build: {
        experimental: {
          ios: {
            appExtensions: [
              {
                targetName: 'ShareExtension',
                bundleIdentifier: 'com.tomatterton.recipeapp.share-extension',
                entitlements: {
                  'com.apple.security.application-groups': ['group.com.tomatterton.recipeapp'],
                },
              },
            ],
          },
        },
      },
    },
  },
});
