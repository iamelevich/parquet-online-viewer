FROM golang:1.16 as builder

ADD . /app
WORKDIR /app

RUN DEBIAN_FRONTEND=noninteractive curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install make nodejs
RUN DEBIAN_FRONTEND=noninteractive npm i -g yarn

RUN yarn build

FROM debian:buster-slim

EXPOSE 1323

RUN adduser --gid 100 --home /app --disabled-password --gecos "" app

COPY --chown=app:users --from=builder /app/bin/parquet-online-viewer /app/service
COPY --chown=app:users --from=builder /app/frontend/build /app/public
COPY --chown=app:users --from=builder /app/package.json /app/package.json

USER app

CMD ["/app/service", "--frontend=/app/public", "--package=/app/package.json"]