package main

import (
	"flag"
	log "github.com/sirupsen/logrus"
	"os"
	"parquet-online-viewer/api"
	"parquet-online-viewer/logger"
	"path/filepath"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func init() {
	log.SetFormatter(&log.TextFormatter{})
	log.SetOutput(os.Stdout)
}

func main() {
	path, err := os.Executable()
	if err != nil {
		panic(err)
	}

	pathPtr := flag.String("frontend", filepath.Join(path, "../../frontend/build"), "Path to frontend build folder")
	flag.Parse()

	e := echo.New()
	e.HideBanner = true

	logger.Logger = log.New()
	e.Logger = logger.GetEchoLogger()
	e.Use(logger.Hook())

	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	g := e.Group("/v1")
	g.POST("/parquet", api.Parquet())
	g.GET("/info", api.Info())

	if string((*pathPtr)[0]) == "." {
		path, err = os.Getwd()
		*pathPtr = filepath.Join(path, *pathPtr)
	}
	log.Info("Frontend path:", *pathPtr)

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:   *pathPtr,
		Index:  "index.html",
		Browse: true,
		HTML5:  true,
	}))

	address := ":1323"
	log.WithFields(log.Fields{
		"address": address,
	}).Info("Server started")
	e.Logger.Fatal(e.Start(address))
}
