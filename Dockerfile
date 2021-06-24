FROM golang:1.16 as builder

ADD . /app
WORKDIR /app/

RUN DEBIAN_FRONTEND=noninteractive curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install make git nodejs
RUN DEBIAN_FRONTEND=noninteractive npm i -g yarn

RUN yarn build

FROM debian:buster-slim

EXPOSE 1323

RUN adduser --home /app --disabled-password --gecos "" app ;\
	apt update ;\
	apt install ca-certificates -y --no-install-recommends ;\
	rm -rf /var/lib/apt/lists/*

USER app

COPY --from=builder /app/bin/parquet-online-viewer /app/service
COPY --from=builder /app/frontend/build /app/public
COPY --from=builder /app/package.json /app/package.json

CMD ["/app/service --frontend=/app/public"]