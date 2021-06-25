# Parquet Online Viewer

This is simple application to view Apache Parquet files. 
You can test it [here](http://static.133.190.201.138.clients.your-server.de/)

## Development

### Backend
To start backend in dev mod run:
```shell
yarn start:dev:be
```
or
```shell
go run main.go --disable-frontend=true
```

### Frontend
To start frontend with HRM run:
```shell
yarn start:dev:fe
```
or for to `frontend` dir and run
```shell
yarn start
```

## Production

### Build
```shell
yarn build
```

### Start
```shell
./bin/parquet-online-viewer
```

## Docker

### Build
```shell
yarn docker:build
```

### Run container

To run container from docker.hub

```shell
docker run --name=parquet-online-viewer -p 80:1323 -d beer13/parquet-online-viewer
```

## Run with docker-compose

```shell
version: "3"
services:
  parquet-online-viewer:
    image: beer13/parquet-online-viewer:latest
    ports:
      - "80:1323"
```
