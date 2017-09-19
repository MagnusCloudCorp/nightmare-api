FROM realogic/nightmare
MAINTAINER benabbousalim

RUN npm install -g pm2

WORKDIR /opt/nightmare-server
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN npm install --production
COPY pm2.json .
COPY ./dist .

CMD /usr/bin/xvfb-run --auto-servernum pm2-docker pm2.json
EXPOSE 3000
