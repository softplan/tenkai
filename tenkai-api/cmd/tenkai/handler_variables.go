package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/softplan/tenkai-api/dbms/model"
)

func (appContext *appContext) variables(w http.ResponseWriter, r *http.Request) {

	var data model.DataVariableElement

	if r.Method == "POST" {

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

		if err := appContext.database.CreateVariable(data.Data); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)

	} else {

		vars := mux.Vars(r)

		sl := vars["envId"]
		id, _ := strconv.Atoi(sl)

		variableResult := &model.VariablesResult{}
		var err error

		if variableResult.Variables, err = appContext.database.GetAllVariablesByEnvironment(id); err == nil {
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

}
