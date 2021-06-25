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

var pathPtr *string
var disablePathPtr *bool
var packageJsonPathPtr *string

func init() {
	log.SetFormatter(&log.TextFormatter{})
	log.SetOutput(os.Stdout)
	path, err := os.Executable()
	if err != nil {
		panic(err)
	}

	pathPtr = flag.String("frontend", filepath.Join(path, "../../frontend/build"), "Path to frontend build folder")
	disablePathPtr = flag.Bool("disable-frontend", false, "Should disable fronted?")
	packageJsonPathPtr = flag.String("package", filepath.Join(path, "../../package.json"), "package.json path")
	flag.Parse()
}

func fixRelativePath(path *string) {
	if string((*path)[0]) == "." {
		if wd, err := os.Getwd(); err != nil {
			*path = filepath.Join(wd, *path)
		}
	}
}

func main() {

	e := echo.New()
	e.HideBanner = true

	logger.Logger = log.New()
	e.Logger = logger.GetEchoLogger()
	e.Use(logger.Hook())

	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	g := e.Group("/v1")
	g.POST("/parquet", api.Parquet())
	fixRelativePath(packageJsonPathPtr)
	g.GET("/info", api.Info(*packageJsonPathPtr))

	if (*disablePathPtr) != true {
		fixRelativePath(pathPtr)
		log.Debug("Frontend path:", *pathPtr)
		e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
			Root:   *pathPtr,
			Index:  "index.html",
			Browse: true,
			HTML5:  true,
		}))
	} else {
		log.Info("Frontend disabled")
	}

	address := ":1323"
	log.WithFields(log.Fields{
		"address": address,
	}).Info("Server started")
	e.Logger.Fatal(e.Start(address))
}
