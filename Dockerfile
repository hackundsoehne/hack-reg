FROM node:8

WORKDIR /usr/app/src

# Load Source
COPY . .

RUN mkdir uploads

VOLUME /usr/app/src/uploads

# Install Gulp
RUN npm install -g gulp

# Install node_modules
RUN npm install

# Build Using Gulp
RUN gulp build

ENV DATABASE = mongodb://localhost

ENV PORT = 3000

ENV JWT_SECRET = secret

ENV ROOT_URL = http://localhost:3000

ENV ADMIN_EMAIL = foo@bar.com

ENV ADMIN_PASS = secret

ENV EMAIL_CONTACT = FooBar <foo@bar.com>

ENV EMAIL_HOST = smtp.bar.com

ENV EMAIL_USER = foo@bar.com

ENV EMAIL_ADDRESS = foo@bar.com

ENV HACKATHON_NAME = Hacktival

ENV TWITTER_HANDLE = @hackundsoehne

ENV FACEBOOK_HANDLE = hackundsoehne

ENV EMAIL_PASS = abc123changeme

ENV EMAIL_PORT = 465

ENV EMAIL_HEADER = image.png

ENV NODE_ENV = dev

ENV TEAM_MAX_SIZE = 4

ENV SLACK_HOOK = https://hooks.slack.com/services/yourapikey

EXPOSE 3000

CMD node app.js
