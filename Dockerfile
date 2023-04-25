FROM node:18.12.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

ARG APP_ENV=ksdjlas
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY . .
RUN touch .env
RUN echo "${APP_ENV}" >> .env
RUN npx prisma migrate deploy
# RUN npx prisma migrate resolve
RUN npx prisma generate
RUN pnpm run build
RUN sh update_permission.sh

RUN dir -s

EXPOSE 3000


CMD ["node","dist/src/main.js"]