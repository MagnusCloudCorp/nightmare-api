FROM realogic/nightmare
MAINTAINER benabbousalim

# RUN apt-get update -y && \
#   apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi \
#   xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev \
#   libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev \
#   libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 \
#   libnss3-dev gcc-multilib g++-multilib && \
#   apt-get clean

WORKDIR /opt/nightmare-server
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn

COPY ./dist .

CMD /usr/bin/xvfb-run node ./index.js
EXPOSE 3000
