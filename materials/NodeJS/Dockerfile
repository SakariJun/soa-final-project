FROM node:latest
RUN mkdir /api
WORKDIR /api
COPY package.json /api/package.json
RUN yarn
COPY . /api
EXPOSE 46789
CMD [ "yarn", "start" ]