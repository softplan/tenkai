package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func (appContext *appContext) rootHandler(w http.ResponseWriter, r *http.Request) {
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
