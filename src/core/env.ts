export const Env = {
  BUNDLE_ID: 'com.tomatterton.recipeapp',
  PACKAGE: 'com.tomatterton.recipeapp',
  NAME: 'Recipe Vault',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
  TEST_LOGIN_EMAIL: process.env.EXPO_PUBLIC_TEST_LOGIN_EMAIL,
  TEST_LOGIN_PASSWORD: process.env.EXPO_PUBLIC_TEST_LOGIN_PASSWORD,
  TEST_GROUP_ID: 'initial-group',
  TEST_USER_ID: 'test-user-id',
  SQLITE_DB_NAME: 'local_vault.db',
  SENTRY_DSN:
    'https://0a1dfbee6f4482e26138d899fc029561@o4506343650361344.ingest.sentry.io/4506744661278720',
  BETA_KEY: process.env.EXPO_PUBLIC_BETA_KEY || process.env.BETA_KEY,
  PRIVACY_POLICY_URL: 'https://tomatterton.com/recipe-vault/privacy-policy.md',
  REVENUE_CAT_API_KEY:
    process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY || process.env.REVENUE_CAT_API_KEY,
  CLOUD_RECIPE_LIMIT: 5,
  CLOUDINARY_KEY: process.env.EXPO_PUBLIC_CLOUDINARY_KEY,
};
