FROM node:8

WORKDIR /usr/app/src

# Load Source
COPY . .

# Install Gulp
RUN npm install -g gulp

# Install node_modules
RUN npm install

# Build Using Gulp
RUN gulp build

CMD node app.js
