package api

import (
	"encoding/json"
	"github.com/labstack/echo/v4"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"os"
)

type PackageJson struct {
	Version string `json:"version"`
}

func Info(packageJsonPath string) echo.HandlerFunc {
	return func(c echo.Context) error {
		jsonFile, err := os.Open(packageJsonPath)
		if err != nil {
			log.Error(err)
			return err
		}
		defer jsonFile.Close()

		byteValue, _ := ioutil.ReadAll(jsonFile)

		// we initialize our Users array
		var packageJson PackageJson

		// we unmarshal our byteArray which contains our
		// jsonFile's content into 'users' which we defined above
		err = json.Unmarshal(byteValue, &packageJson)
		if err != nil {
			log.Error(err)
			return err
		}

		return c.JSON(http.StatusOK, packageJson)
	}
}
