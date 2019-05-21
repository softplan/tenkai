package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/softplan/tenkai-api/global"
)

func handleUploadError(w http.ResponseWriter, err error) bool {
	result := false
	if err != nil {
		errorMessage := fmt.Sprintf("erro ao enviar o objeto - %s", err.Error())
		http.Error(w, errorMessage, http.StatusInternalServerError)
		result = true
	}
	return result
}

func handleDownloadError(id string, w http.ResponseWriter, err error) bool {
	result := false
	if err != nil {
		errorMessage := fmt.Sprintf("erro ao recuperar o objeto com id %s - %s", id, err.Error())
		http.Error(w, errorMessage, http.StatusInternalServerError)
		result = true
	}
	return result
}

func checkFatalError(err error) {
	if err != nil {
		global.Logger.Error(global.AppFields{global.FUNCTION: "upload", "error": err}, "erro fatal")
		log.Fatal(err)
	}
}
