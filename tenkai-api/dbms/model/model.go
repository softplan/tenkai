package model

import "gopkg.in/mgo.v2/bson"

//Environment Model
type Environment struct {
	ID            bson.ObjectId `bson:"_id"`
	Group         string        `json:"group"`
	Name          string        `json:"name"`
	ClusterURI    string        `json:"cluster_uri"`
	CACertificate string        `json:"ca_certificate"`
	Token         string        `json:"token"`
	Namespace     string        `json:"namespace"`
}

//EnvResult Model
type EnvResult struct {
	Envs []Environment
}

//DataElement dataElement
type DataElement struct {
	Data Environment `json:"data"`
}
