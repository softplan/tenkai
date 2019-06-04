package dbms

import (
	"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/sqlite"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/softplan/tenkai-api/dbms/model"
)

//Database Structure
type Database struct {
	Db *gorm.DB
}

//Connect to a database
func (database *Database) Connect() {
	var err error
	//database.Db, err = gorm.Open("sqlite3", "/tmp/test.db")
	database.Db, err = gorm.Open("postgres", "host=172.21.25.22 port=5432 user=postgres dbname=tenkai sslmode=disable password=docker")

	if err != nil {
		panic("failed to connect database")
	}

	database.Db.AutoMigrate(&model.Environment{})
	database.Db.AutoMigrate(&model.Variable{})

}
