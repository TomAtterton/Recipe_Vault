export const Env = {
  BUNDLE_ID: 'com.tomatterton.recipeapp',
  PACKAGE: 'com.tomatterton.recipeapp',
  NAME: 'Recipe Vault',
  SUPABASE_URL: 'https://cfzwkhnvjvfjfgazjlzh.supabase.co',
  SUPABASE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmendraG52anZmamZnYXpqbHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE5Mjc0MTAsImV4cCI6MjAwNzUwMzQxMH0.M14EPvilmyyS-lRT2KfYyBFwNd_aIljuuBcLZDwmK6c',
  SUPABASE_STORAGE_URL:
    'https://cfzwkhnvjvfjfgazjlzh.supabase.in/storage/v1/object/public/photos/recipes/',
  TEST_LOGIN_EMAIL: process.env.EXPO_PUBLIC_TEST_LOGIN_EMAIL,
  TEST_LOGIN_PASSWORD: process.env.EXPO_PUBLIC_TEST_LOGIN_PASSWORD,
  TEST_GROUP_ID: 'initial-group',
  TEST_USER_ID: process.env.EXPO_PUBLIC_TEST_USER_ID || 'test-user-id',
  SQLITE_DB_NAME: 'local_vault.db',
  SENTRY_DSN:
    'https://0a1dfbee6f4482e26138d899fc029561@o4506343650361344.ingest.sentry.io/4506744661278720',
  BETA_KEY: process.env.EXPO_PUBLIC_BETA_KEY || process.env.BETA_KEY,
  PRIVACY_POLICY_URL:
    'https://gist.githubusercontent.com/TomAtterton/04e81636357761d62d0ad328b94dc046/raw/7830bbead7548b374416f6514c3451fd9f4891fe/recipe-vault-privacy-policy.md',
  REVENUE_CAT_API_KEY: process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY,
  CLOUD_RECIPE_LIMIT: 5,
  BETA_VAULTS: [process.env.EXPO_PUBLIC_BETA_VAULTS || process.env.VAULT_KEY],
};
