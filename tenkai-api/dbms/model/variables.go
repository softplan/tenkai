package model

import "github.com/jinzhu/gorm"

//VariablesValues Model
type VariablesValues struct {
	gorm.Model
	EnvironmentID int    `json:"environmentId"`
	ChartName     string `json:"chartName"`
	VariableName  string `json:"variableName"`
	Value         string `json:"value"`
}

//VariableData Struct
type VariableData struct {
	Data []VariablesValues
}
