FROM ubuntu:16.04
RUN apt-get update && apt-get install -y \
    apt-transport-https ca-certificates curl wget gnupg --no-install-recommends \
    # adding key, repository, and installing chrome stable
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    --no-install-recommends \
    # adding repository and installing nodejs 11.x
    && curl -sL https://deb.nodesource.com/setup_11.x | bash - \
    && apt install nodejs -y

WORKDIR /ChromeHTML2PDF
COPY ./ /ChromeHTML2PDF

RUN npm i && npm i -g typescript && tsc server.ts
CMD [ "npm","start" ]