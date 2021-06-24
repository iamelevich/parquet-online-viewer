GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean

ENTRYPOINT=.
BIN_NAME=parquet-online-viewer
BIN_DIR=bin
BIN_OUT=${BIN_DIR}/${BIN_NAME}

vendor:
	go mod vendor

deps:
	$(GOCMD) mod tidy
	$(GOCMD) mod download

build:
	$(GOBUILD) -i -o $(BIN_OUT) $(ENTRYPOINT)

clean:
	$(GOCLEAN) $(ENTRYPOINT)
	rm -rf $(BIN_DIR) .git-env vendor frontend/build || true