package dbms

import (
	"github.com/jinzhu/gorm"
	"github.com/softplan/tenkai-api/dbms/model"
)

//CreateVariable - Create a new environment
func (database *Database) CreateVariable(variable model.Variable) error {

	var variableEntity model.Variable

	//Verify if update
	if err := database.Db.Where(&model.Variable{EnvironmentID: variable.EnvironmentID,
		Scope: variable.Scope,
		Name:  variable.Name}).First(&variableEntity).Error; err == nil {

		variableEntity.Value = variable.Value

		if err := database.Db.Save(variableEntity).Error; err != nil {
			return err
		}

	} else {

		if err := database.Db.Create(&variable).Error; err != nil {
			return err
		}

	}

	return nil
}

//GetAllVariablesByEnvironment - Retrieve all variables
func (database *Database) GetAllVariablesByEnvironment(envID int) ([]model.Variable, error) {
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
