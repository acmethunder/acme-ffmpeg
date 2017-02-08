FROM ubuntu:xenial

RUN mkdir /src
WORKDIR /src

COPY ./src/package.json /src

# install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# nodejs and npm
RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y nodejs npm

# Debian installs NodeJS as 'nodejs.' We need to fix this to 'node.'
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

RUN npm install mocha -g
RUN npm install chai --save-dev
