import path from 'path';

require('dotenv').config();

const { env } = process;

export const DATABASE_HOST: string = env.DATABASE_HOST || 'localhost';
export const DATABASE_USER: string = env.DATABASE_USERNAME || 'postgres';
export const DATABASE_PASSWORD: string = env.DATABASE_PASSWORD || 'postgres';
export const DATABASE_NAME: string = env.DATABASE_NAME || 'postgres';

// Para los archivos
export const UPLOAD_DIRECTORY: string = env.UPLOAD_DIRECTORY || path.join(__dirname, '../', '/uploads/');

// Para los correos (No es necesario en production o en development environment)
export const EMAIL_ADDRESS: string = env.EMAIL || 'MISSING EMAIL';
export const EMAIL_CLIENT_ID: string = env.EMAIL_CLIENT_ID || 'MISSING CLIENT ID';
export const EMAIL_CLIENT_SECRET: string = env.EMAIL_CLIENT_SECRET || 'MISSING CLIENT SECRET';
export const EMAIL_REFRESH_TOKEN: string = env.EMAIL_REFRESH_TOKEN || 'MISSING EMAIL REFRESH TOKEN';
export const EMAIL_RECEIVER_DOMAIN: string = env.RECEIVER_EMAIL_DOMAIN || 'MISSING RECEIVER EMAIL DOMAIN';

// Links y otros
export const COMPANY: string = 'Meeting';
export const COMPANY_LOGO: string = 'http://meetinguvg.me/imgs/logo.svg';
export const COMPANY_LINK: string = 'http://meetinguvg.me/';
export const RECEIVER_PASSWORD_LINK: string = 'http://meetinguvg.me/recovery';
export const CONFIRM_ACCOUNT_LINK: string = 'http://meetinguvg.me/confirm';

// tokens para los jwt
export const AUTH_TOKEN_KEY: string = env.AUTH_TOKEN_KEY || 'MISSING AUTH TOKEN KEY';
export const RESET_PASSWORD_TOKEN_KEY: string = env.RESET_PASSWORD_TOKEN_KEY || 'MISSING RESET PASSWORD TOKEN KEY';
export const VERIFY_TOKEN_KEY: string = env.VERIFY_ACCOUNT_TOKEN_KEY || 'MISSING VERIFY ACCOUNT TOKEN KEY';
export const ENVIRONMENT: string = env.ENVIRONMENT || 'production';
