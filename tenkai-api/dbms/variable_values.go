package dbms

import (
	"github.com/jinzhu/gorm"
	"github.com/softplan/tenkai-api/dbms/model"
)

//SaveVariableValue - Create a new environment
func (database *Database) SaveVariableValue(value model.VariablesValues) error {
	if err := database.Db.Create(&value).Error; err != nil {
		return err
	}
	return nil
}

//GetAllVariablesByEnvironmentAndChartName - Retrieve all variables
func (database *Database) GetAllVariablesByEnvironmentAndChartName(envID int) ([]model.Variable, error) {
	variables := make([]model.Variable, 0)
	var env model.Environment

	if err := database.Db.First(&env, envID).Error; err == nil {
		if err := database.Db.Model(&env).Related(&variables).Error; err != nil {
			if gorm.IsRecordNotFoundError(err) {
				return nil, err
			} else {
				return nil, err
			}
		}
	} else {
		return nil, err
	}
	return variables, nil
}
