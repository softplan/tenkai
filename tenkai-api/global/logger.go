package global

import (
	"os"
	"sync"

	"github.com/sirupsen/logrus"
)

//Logger - Log Geral
var Logger = &AppLogger{}

//AppFields - Campos a serem logados
type AppFields map[string]interface{}

//AppLogger - Logs das aplicação
type AppLogger struct {
	logger  *logrus.Logger
	initLog sync.Once
}

func initLogger(appLogger *AppLogger) {
	appLogger.logger = logrus.New()
	appLogger.logger.Out = os.Stdout
	appLogger.logger.SetLevel(logrus.InfoLevel)
	formatter := &logrus.TextFormatter{
		FullTimestamp: true,
	}
	appLogger.logger.Formatter = formatter
}

//Info - Efetua o log
func (appLogger *AppLogger) Info(fields map[string]interface{}, text string) {
	appLogger.initLog.Do(func() {
		initLogger(appLogger)
	})
	appLogger.logger.WithFields(fields).Info(text)
}

//Error - Efetua o log
func (appLogger *AppLogger) Error(fields map[string]interface{}, text string) {
	appLogger.initLog.Do(func() {
		initLogger(appLogger)
	})
	appLogger.logger.WithFields(fields).Error(text)
}
