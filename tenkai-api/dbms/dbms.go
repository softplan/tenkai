package dbms

import (
	"fmt"

	"gopkg.in/mgo.v2"
)

//Repository Structure
type Dbms struct {
	db *mgo.Database
}

const (
	server = "172.21.25.13:27017"
	dbname = "tenkai"
)

//Connect Method
func (m *Dbms) Connect() *mgo.Session {
	session, err := mgo.Dial(server)
	if err != nil {
		fmt.Println("Failed to establish connection to Mongo server:", err)
	}
	m.db = session.DB(dbname)
	return session
}
