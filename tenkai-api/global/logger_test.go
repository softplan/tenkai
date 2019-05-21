package global

import (
	"testing"
)

func TestLogger(t *testing.T) {
	//Only coverage
	Logger.Info(AppFields{"a": "a", "b": "b"}, "test")
	Logger.Error(AppFields{"a": "a", "b": "b"}, "test")
}
