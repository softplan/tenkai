package main

import (
	"log"
	"net/http"

	"github.com/softplan/tenkai-api/dbms"

	"github.com/softplan/tenkai-api/configs"
	"github.com/softplan/tenkai-api/global"

	"github.com/gorilla/mux"
)

const (
	configFileName = "app"
)

type appContext struct {
	configuration *configs.Configuration
	database      dbms.Database
}

func main() {
	logFields := global.AppFields{global.FUNCTION: "main"}

	global.Logger.Info(logFields, "carregando configurações")
	config, error := configs.ReadConfig(configFileName)
	checkFatalError(error)

	appContext := &appContext{configuration: config}

	//Conecta no postgres
	appContext.database.Connect()
	defer appContext.database.Db.Close()

	global.Logger.Info(logFields, "iniciando o servidor http")
	startHTTPServer(appContext)
}

func startHTTPServer(appContext *appContext) {

	port := appContext.configuration.Server.Port
	global.Logger.Info(global.AppFields{global.FUNCTION: "startHTTPServer", "port": port}, "online - listen and server")

	r := mux.NewRouter()

	r.HandleFunc("/listHelmDeployments", appContext.listHelmDeployments)
	r.HandleFunc("/charts", appContext.listCharts)
	r.HandleFunc("/variables", appContext.variables)
	r.HandleFunc("/variables/{envId}", appContext.variables)
	r.HandleFunc("/environments", appContext.environments)
	r.HandleFunc("/", appContext.rootHandler)

	log.Fatal(http.ListenAndServe(":"+port, r))

}
