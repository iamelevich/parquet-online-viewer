package api

import (
	"fmt"
	"github.com/labstack/echo/v4"
	log "github.com/sirupsen/logrus"
	source "github.com/xitongsys/parquet-go-source/http"
	"github.com/xitongsys/parquet-go/reader"
	"net/http"
	"runtime"
)

func Parquet() echo.HandlerFunc {
	return func(c echo.Context) error {
		fileHeader, err := c.FormFile("file")
		if err != nil {
			log.Error(err)
			return err
		}

		file, err := fileHeader.Open()
		if err != nil {
			log.Error(err)
			return err
		}
		defer file.Close()

		fr := source.NewMultipartFileWrapper(fileHeader, file)
		pr, err := reader.NewParquetReader(fr, nil, int64(runtime.NumCPU()))
		if err != nil {
			log.Error(err)
			return fmt.Errorf("Invalid parquet file.")
		}
		defer pr.ReadStop()

		num := int(pr.GetNumRows())
		res, err := pr.ReadByNumber(num)
		if err != nil {
			log.Error(err)
			return fmt.Errorf("Reading file error.")
		}

		return c.JSON(http.StatusOK, res)
	}
}