FROM node:18.12.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

ARG DATABASE_URL=
ENV DATABASE_URL=${DATABASE_URL}
# ARG REDIS_URL=
# ARG ACCESS_TOKEN_SECRET=
# ARG DEFAULT_JWT_SECRET=
# ARG EMAIL_SMTP_HOST=
# ARG EMAIL_SMTP_PORT=
# ARG EMAIL_SMTP_USER=
# ARG EMAIL_SMTP_PASSWORD=
# ARG REFRESH_TOKEN_SECRET=
# ARG ACCESS_TOKEN_EXPIRY=
# ARG DEFAULT_JWT_EXPIRY=
# ARG REFRESH_TOKEN_EXPIRY=
# ARG DEFAULT_JWT_MAX_AGE=
# ARG DEFAULT_JWT_ISSUER=
# ARG DEFAULT_JWT_AUDIENCE=






ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY . .

RUN npx prisma migrate deploy
# RUN npx prisma migrate resolve
RUN npx prisma generate
RUN pnpm run build
RUN sh update_permission.sh

RUN dir -s

EXPOSE 3000


CMD ["node","dist/src/main.js"]