package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/softplan/tenkai-api/service"
)

func (appContext *appContext) listCharts(w http.ResponseWriter, r *http.Request) {

	helmapi.TestX()

	data := map[string]string{
		"service": "TENKAI",
		"status":  "ready",
	}

	json, err := json.Marshal(data)
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(json)

}
