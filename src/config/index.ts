/* eslint-disable */
require('dotenv').config();

import { APP_ENV } from '../common/constant';

export const configuration = {
  api: {
    nodeEnv: process.env.APP_ENV || APP_ENV.LOCAL,
  },
  connectionString: process.env.DATABASE_URL,
  databaseLocal: process.env.DATABASE_URL || '',
  databaseTest: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  sentryKey: process.env.SENTRY_DSN || '',
  aws: {
    region: process.env.REGION || 'ap-southeast-1',
    secretKey: process.env.AWS_SECRET_KEY,
    accessKey: process.env.AWS_ACCESS_KEY,
    s3BucketName: process.env.S3_BUCKET,
    mainQueueUrl: process.env.MAIN_QUEUE_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    camille_secret_key: process.env.STRIPE_CAMILLE_SECRET_KEY,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'nestapp@1234',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'nestapp@1234',
    expiredIn: '300s',
  },
  domain: process.env.DOMAIN || 'localhost',
  port: process.env.PORT || 12345,
  timeout: process.env.TIME_OUT || 100000,
  bcrypt: {
    salt: process.env.SALT_ROUND || 5,
  },
  smtpService: {
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: +process.env.SMTP_PORT || 465,
    user: process.env.SMTP_USER || 'trinhlen@gmail.com',
    password: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'trinhle@gmail.com',
  },
  cloudinaryService: {
    name: process.env.CLOUD_NAME,
    key: process.env.CLOUDINARY_KEY,
    secret: process.env.CLOUDINARY_SECRET,
    originFolder: process.env.CLOUDINARY_ORIGIN_FOLDER,
  }
};
export const CLOUDINARY = 'Cloudinary';