FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .


RUN npx prisma generate
RUN pnpm run build

RUN dir -s

EXPOSE 3000

CMD ["pnpm","run","start"]