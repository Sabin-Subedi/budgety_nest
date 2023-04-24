const env = {
  DATABASE_URL:
    'postgres://budgety_user:sO7jJTkzjO0Ykk9vorgXfoCB8zVlNE09@dpg-ch2b0b3h4hsum45rbde0-a.oregon-postgres.render.com/budgety',

  DEFAULT_JWT_SECRET:
    'daksjdlajsdjlkasjdklajslkdjlkasjdlkjalkjdklajsldjlaskdjaskljdlajslkdjlkajdlkajsldjlkajdklajslkdjkajdoiqdlkjnaljsdioq',
  DEFAULT_JWT_EXPIRY: '60s',
  DEFAULT_JWT_AUDIENCE: "don't go broke trying to look rich",
  DEFAULT_JWT_ISSUER: 'budgety-issuer',
  DEFAULT_JWT_MAX_AGE: '14d',

  ACCESS_TOKEN_SECRET: 'skdjaljdkajsdljalskjdasl',
  ACCESS_TOKEN_EXPIRY: '4h',

  REFRESH_TOKEN_SECRET: 'skdjaljdkajsdljalskjdasl',
  REFRESH_TOKEN_EXPIRY: '1d',

  REDIS_URL:
    'rediss://red-ch2b2hdgk4qarqg75jkg:PcopEbXgbsczMSef6s3djsR9dnakh1nR@oregon-redis.render.com:6379',

  EMAIL_SMTP_PORT: '2525',
  EMAIL_SMTP_HOST: 'sandbox.smtp.mailtrap.io',
  EMAIL_SMTP_USER: 'dd750b565c7231',
  EMAIL_SMTP_PASSWORD: 'c874d5b3676e1f',
};
