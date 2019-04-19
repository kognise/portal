FROM node:8
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY . .
RUN chmod +x ./wait-for-it.sh
EXPOSE 80
CMD [ "./wait-for-it.sh", "mongo:27017", "--", "yarn", "start" ]