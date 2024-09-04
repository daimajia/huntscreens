import { UserScope, LogtoNextConfig } from '@logto/next';

export const logtoConfig:LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APPID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl:  process.env.LOGTO_BASE_URL!, // Change to your own base URL
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!, // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === 'production',
  scopes: [UserScope.Email, UserScope.Profile],
};