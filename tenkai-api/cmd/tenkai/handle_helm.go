package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	"strings"

	"github.com/gorilla/mux"
	"github.com/softplan/tenkai-api/dbms/model"
	"github.com/softplan/tenkai-api/service/helm"
)

func (appContext *appContext) listCharts(w http.ResponseWriter, r *http.Request) {

	searchTerms := []string{"saj6"}
	searchResult := helmapi.SearchCharts(searchTerms)
	result := &model.ChartsResult{Charts: *searchResult}

	data, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}

func (appContext *appContext) listHelmDeployments(w http.ResponseWriter, r *http.Request) {

	result := helmapi.ListHelmDeployments()

	data, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}

func (appContext *appContext) getChartVariables(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	chartRepo := vars["chartRepo"]
	chartName := vars["chartName"]

	result, _ := helmapi.GetValues(chartRepo + "/" + chartName)

	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}

func (appContext *appContext) install(w http.ResponseWriter, r *http.Request) {

	var payload model.InstallPayload
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		log.Fatalln("Error on body", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err := r.Body.Close(); err != nil {
		log.Fatalln("Error - body closed", err)
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		log.Fatalln("Error unmarshalling data", err)
		w.WriteHeader(422)
		if err := json.NewEncoder(w).Encode(err); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}

	//Locate Environment
	environment, err := appContext.database.GetByID(payload.EnvironmentID)

	var args []string

	for _, item := range payload.Arguments {
		if len(item.Name) > 0 {
			args = append(args, item.Name+"="+replace(item.Value, *environment))
		}
	}

	//Add Default Gateway
	if len(environment.Gateway) > 0 {
		args = append(args, "istio.virtualservices.gateways[0]="+environment.Gateway)
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		kubeconfig := "./" + environment.Group + "_" + environment.Name
		helmapi.Upgrade(kubeconfig, payload.Name, payload.Chart, args)
	}

}

func replace(value string, environment model.Environment) string {
	return strings.Replace(value, "${NAMESPACE}", environment.Namespace, -1)
}
