package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/softplan/tenkai-api/dbms/model"
)

func (appContext *appContext) saveVariableValues(w http.ResponseWriter, r *http.Request) {

	var data model.VariableData

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		log.Fatalln("Error on body", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err := r.Body.Close(); err != nil {
		log.Fatalln("Error - body closed", err)
	}

	if err := json.Unmarshal(body, &data); err != nil {
		log.Fatalln("Error unmarshalling data", err)
		w.WriteHeader(422)
		if err := json.NewEncoder(w).Encode(err); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}

	for _, item := range data.Data {
		if err := appContext.database.CreateVariable(item); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusCreated)
}

func (appContext *appContext) getVariablesByEnvironmentAndScope(w http.ResponseWriter, r *http.Request) {

	type Payload struct {
		EnvironmentID int    `json:"environmentId"`
		Scope         string `json:"scope"`
	}

	var payload Payload

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

	variableResult := &model.VariablesResult{}

	if variableResult.Variables, err = appContext.database.GetAllVariablesByEnvironmentAndScope(payload.EnvironmentID, payload.Scope); err == nil {
		data, _ := json.Marshal(variableResult)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	} else {
		if err := json.NewEncoder(w).Encode(err); err != nil {
			log.Fatalln("Error unmarshalling data", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
	return

}
