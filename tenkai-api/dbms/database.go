package dbms

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/softplan/tenkai-api/dbms/model"
)

//Database Structure
type Database struct {
	Db *gorm.DB
}

//Connect to a database
func (database *Database) Connect() {
	var err error
	database.Db, err = gorm.Open("sqlite3", "test.db")

	if err != nil {
		panic("failed to connect database")
	}

	database.Db.AutoMigrate(&model.Environment{})
	database.Db.AutoMigrate(&model.Variable{})

}
