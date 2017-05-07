FROM ubuntu:xenial

RUN mkdir /src
WORKDIR /src

COPY ./src/package.json /src

# install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

RUN apt-get purge node nodejs npm

# nodejs and npm
RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get install -y nodejs
RUN apt-get install -y npm

# Debian installs NodeJS as 'nodejs.' We need to fix this to 'node.'
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

RUN npm install mocha -g
#RUN npm install chai -g
