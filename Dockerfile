FROM node:latest

#RUN apt-get update -y && apt-get install git vim -y

WORKDIR /app
COPY package.json /app/

RUN npm install

CMD [ "node" ]
