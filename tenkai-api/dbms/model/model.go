package model

import "github.com/jinzhu/gorm"

//Environment Model
type Environment struct {
	gorm.Model
	Group         string `json:"group"`
	Name          string `json:"name"`
	ClusterURI    string `json:"cluster_uri"`
	CACertificate string `json:"ca_certificate"`
	Token         string `json:"token"`
	Namespace     string `json:"namespace"`
}

//EnvResult Model
type EnvResult struct {
	Envs []Environment
}

//DataElement dataElement
type DataElement struct {
	Data Environment `json:"data"`
}

//VariablesResult Model
type VariablesResult struct {
	Variables []Variable
}

//Variable Structure
type Variable struct {
	gorm.Model
	Scope         string `json:"scope"`
	Name          string `json:"name"`
	Value         string `json:"value"`
	Description   string `json:"description"`
	EnvironmentID int    `json:"environmentId"`
}
