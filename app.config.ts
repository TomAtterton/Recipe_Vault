import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Recipe Vault',
  description: `Recipe Vault Mobile App`,
  slug: 'recipeapp',
  version: '0.0.17',
  runtimeVersion: '0.0.17',
  scheme: 'recipeapp',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#19120C',
  },
  updates: {
    checkAutomatically: 'ON_LOAD',
    url: 'https://u.expo.dev/9d67c9e0-c046-4082-b3dc-37c5fcfd0932',
    fallbackToCacheTimeout: 0,
  },
  ios: {
    supportsTablet: false,
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
    './plugins/withPodfile',
    'expo-secure-store',
    ['expo-config-plugin-ios-share-extension'],
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
        photosPermission: 'Used to upload your tasty recipes',
        cameraPermission: 'Used to upload your tasty recipes',
      },
    ],
    [
      'expo-calendar',
      {
        remindersPermission: 'The app needs to access your reminders.',
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
