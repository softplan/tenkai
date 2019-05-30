package main

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/softplan/tenkai-api/dbms/model"
)

func (appContext *appContext) environments(w http.ResponseWriter, r *http.Request) {

	var data model.DataElement

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
			w.WriteHeader(422)
			if err := json.NewEncoder(w).Encode(err); err != nil {
				log.Fatalln("Error unmarshalling data", err)
				w.WriteHeader(http.StatusInternalServerError)
			}
			return
		}
		env := data.Data

		createEnvironmentFile(env.Name, env.Token, env.Group+"_"+env.Name,
			env.CACertificate, env.ClusterURI, env.Namespace)

		if err := appContext.database.CreateEnvironment(env); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)

	} else {

		envResult := &model.EnvResult{}
		var err error

		if envResult.Envs, err = appContext.database.GetAllEnvironments(); err == nil {
			data, _ := json.Marshal(envResult)
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

func createEnvironmentFile(clusterName string, clusterUserToken string,
	fileName string, ca string, server string, namespace string) {

	file, err := os.Create("/home/denny/.kube/" + fileName)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	ca = strings.TrimSuffix(ca, "\n")
	caBase64 := base64.StdEncoding.EncodeToString([]byte(ca))

	startIndex := strings.Index(clusterUserToken, "kubeconfig-") + 11
	endIndex := strings.Index(clusterUserToken, ":")

	clusterUser := clusterUserToken[startIndex:endIndex]

	file.WriteString("apiVersion: v1\n")
	file.WriteString("clusters:\n")
	file.WriteString("- cluster:\n")
	file.WriteString("    certificate-authority-data: " + caBase64 + "\n")
	file.WriteString("    server: " + server + "\n")
	file.WriteString("  name: " + clusterName + "\n")
	file.WriteString("contexts:\n")
	file.WriteString("- context:\n")
	file.WriteString("    cluster: " + clusterName + "\n")
	file.WriteString("    namespace: " + namespace + "\n")
	file.WriteString("    user: " + clusterUser + "\n")
	file.WriteString("  name: " + clusterName + "\n")
	file.WriteString("current-context: " + clusterName + "\n")
	file.WriteString("kind: Config\n")
	file.WriteString("preferences: {}\n")
	file.WriteString("users:\n")
	file.WriteString("- name: " + clusterUser + "\n")
	file.WriteString("  user:\n")
	file.WriteString("    token: " + clusterUserToken + "\n")

}
