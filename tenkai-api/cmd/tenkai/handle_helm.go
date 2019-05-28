package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/softplan/tenkai-api/dbms/model"
	"github.com/softplan/tenkai-api/service/helm"
)

func (appContext *appContext) listCharts(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		return
	}

	searchTerms := []string{"saj6"}

	searchResult := helmapi.SearchCharts(searchTerms)

	result := &model.ChartsResult{Charts: *searchResult}

	data, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}

func (appContext *appContext) listHelmDeployments(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		return
	}

	result := helmapi.ListHelmDeployments()

	data, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}

func (appContext *appContext) getChartVariables(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		return
	}

	vars := mux.Vars(r)

	chartRepo := vars["chartRepo"]
	chartName := vars["chartName"]

	result, _ := helmapi.GetValues(chartRepo + "/" + chartName)

	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}
