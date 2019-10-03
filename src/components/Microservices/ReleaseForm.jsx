import React, { useState, useEffect } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button } from "react-bootstrap";

export const ReleaseForm = props => {
  const [formData, setFormData] = useState({
    ID: "",
    chartName: "",
    release: ""
  });

  useEffect(() => {
    if (props.editItem) {
      setFormData(props.editItem);
    }
  }, []);

  return (
    <div>
      <Card
        title={props.editMode ? "Edit Release" : "New Release"}
        content={
          <form>
            <FormInputs
              ncols={["col-md-2"]}
              properties={[
                {
                  name: "release",
                  label: "Release Number",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "Version",
                  value: formData.release,
                  onChange: event => {
                    const { value, name } = event.target;
                    setFormData(formData => ({
                      ...formData,
                      [name]: value
                    }));
                  }
                }
              ]}
            />
            <div className="btn-toolbar">
              <div className="btn-group">
                <Button
                  bsStyle="info"
                  type="button"
                  onClick={event => {
                    event.preventDefault();
                    props.saveClick(formData);
                  }}
                >
                  Save
                </Button>
              </div>
              <div className="btn-group">
                <Button
                  bsStyle="info"
                  type="button"
                  onClick={props.cancelClick}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="clearfix" />
          </form>
        }
      />
    </div>
  );
};

export default ReleaseForm;
