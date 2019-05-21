package dbms

import (
	"github.com/softplan/tenkai-api/dbms/model"
	"gopkg.in/mgo.v2/bson"
)

const (
	collection = "environments"
)

//CreateEnvironment - Create a new environment
func (dbms *Dbms) CreateEnvironment(env model.Environment) error {
	env.ID = bson.NewObjectId()
	err := dbms.db.C(collection).Insert(&env)
	return err
}

//GetAllEnvironments - Retrieve all environments
func (dbms *Dbms) GetAllEnvironments() ([]model.Environment, error) {
	var environments []model.Environment
	err := dbms.db.C(collection).Find(bson.M{}).All(&environments)
	return environments, err
}
