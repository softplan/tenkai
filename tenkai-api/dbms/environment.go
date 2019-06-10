package dbms

import (
	"github.com/jinzhu/gorm"
	"github.com/softplan/tenkai-api/dbms/model"
)

//CreateEnvironment - Create a new environment
func (database *Database) CreateEnvironment(env model.Environment) error {
	if err := database.Db.Create(&env).Error; err != nil {
		return err
	}
	return nil
}

// EditEnvironment - Updates an existing environment
func (database *Database) EditEnvironment(env model.Environment) error {
	if err := database.Db.Save(&env).Error; err != nil {
		return err
	}
	return nil
}

// DeleteEnvironment - Deletes an environment
func (database *Database) DeleteEnvironment(env model.Environment) error {
	if err := database.Db.Delete(&env).Error; err != nil {
		return err
	}
	return nil
}

//GetAllEnvironments - Retrieve all environments
func (database *Database) GetAllEnvironments() ([]model.Environment, error) {
	envs := make([]model.Environment, 0)
	if err := database.Db.Find(&envs).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, err
		} else {
			return nil, err
		}
	}
	return envs, nil
}

//GetByID - Get Environment By Id
func (database *Database) GetByID(envID int) (*model.Environment, error) {
	var result model.Environment
	if err := database.Db.First(&result, envID).Error; err != nil {
		return nil, err
	}
	return &result, nil
}
