package main

import (
	"log"
	"net/http"

	"github.com/softplan/tenkai-api/dbms"

	"github.com/softplan/tenkai-api/configs"
	"github.com/softplan/tenkai-api/global"
)

const (
	configFileName = "app"
)

type appContext struct {
	configuration *configs.Configuration
	dbms          dbms.Dbms
}

func main() {
	logFields := global.AppFields{global.FUNCTION: "main"}

	global.Logger.Info(logFields, "carregando configurações")
	config, error := configs.ReadConfig(configFileName)
	checkFatalError(error)

	appContext := &appContext{configuration: config}
	session := appContext.dbms.Connect()
	defer session.Close()

	global.Logger.Info(logFields, "iniciando o servidor http")
	startHTTPServer(appContext)
}

func startHTTPServer(appContext *appContext) {

	http.HandleFunc("/environments", appContext.environments)
	http.HandleFunc("/hello", use(appContext.hello))
	http.HandleFunc("/", appContext.rootHandler)

	port := appContext.configuration.Server.Port

	global.Logger.Info(global.AppFields{global.FUNCTION: "startHTTPServer", "port": port}, "online - listen and server")
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
