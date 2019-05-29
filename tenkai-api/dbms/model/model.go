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

//DataVariableElement dataElement
type DataVariableElement struct {
	Data Variable `json:"data"`
}

//VariablesResult Model
type VariablesResult struct {
	Variables []Variable
}

//SearchResult result
type SearchResult struct {
	Name         string `json:"name"`
	ChartVersion string `json:"chartVersion"`
	AppVersion   string `json:"appVersion"`
	Description  string `json:"description"`
}

//ChartsResult Model
type ChartsResult struct {
	Charts []SearchResult `json:"charts"`
}

//Variable Structure
type Variable struct {
	gorm.Model
	Scope         string `json:"scope" gorm:"index:var_scope"`
	Name          string `json:"name" gorm:"index:var_name"`
	Value         string `json:"value"`
	Description   string `json:"description"`
	EnvironmentID int    `json:"environmentId"`
}

//VariableData Struct
type VariableData struct {
	Data []Variable `json:"data"`
}
