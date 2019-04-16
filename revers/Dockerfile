FROM node:8
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY . .
EXPOSE 80
CMD [ "yarn", "start" ]