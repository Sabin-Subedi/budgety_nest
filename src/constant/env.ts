import { join } from 'path';

export const APP_PORT = process.env.APP_PORT;

export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const DEFAULT_JWT_ISSUER = process.env.DEFAULT_JWT_ISSUER;
export const DEFAULT_JWT_AUDIENCE = process.env.DEFAULT_JWT_AUDIENCE;
export const DEFAULT_JWT_MAX_AGE = process.env.DEFAULT_JWT_MAX_AGE;
export const DEFAULT_JWT_EXPIRY = process.env.DEFAULT_JWT_EXPIRY;
export const DEFAULT_JWT_SECRET = process.env.DEFAULT_JWT_SECRET;
export const BLACKLIST_TOKEN_INITIAL = process.env.BLACKLIST_TOKEN_INITIAL;

export const REDIS_URL = process.env.REDIS_URL;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_USER_PWD = process.env.REDIS_USER_PWD;
export const REDIS_USER = process.env.REDIS_USER;

export const EMAIL_SMTP_HOST = process.env.EMAIL_SMTP_HOST;
export const EMAIL_SMTP_PORT = process.env.EMAIL_SMTP_PORT;
export const EMAIL_SMTP_USER = process.env.EMAIL_SMTP_USER;
export const EMAIL_SMTP_PASSWORD = process.env.EMAIL_SMTP_PASSWORD;

export const BASE_OAUTH_URL = process.env.BASE_OAUTH_URL;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const GOOGLE_SCOPE = ['openid', 'email', 'profile'];

export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

export const BASE_PATH = join(__dirname, '..', '..', '..');
