import React, { useState } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button } from "react-bootstrap";

export const RepoForm = ({ editMode, editItem, ...props }) => {
  const [formData, setFormData] = useState(
    editItem
      ? editItem
      : {
          name: "",
          url: "",
          password: "",
          username: ""
        }
  );

  const handleChange = ({ value, name }) =>
    setFormData(formData => ({ ...formData, [name]: value }));

  return (
    <div>
      <Card
        title={editMode ? "Edit Repository" : "New Repository"}
        content={
          <form>
            <FormInputs
              ncols={["col-md-2", "col-md-10"]}
              properties={[
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                  bsClass: "form-control",
                  value: formData.name,
                  onChange: e => handleChange(e)
                },
                {
                  name: "url",
                  label: "URL",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "https://artifactory/artifactory/xpto-helm",
                  value: formData.url,
                  onChange: e => handleChange(e)
                }
              ]}
            />

            <FormInputs
              ncols={["col-md-3", "col-md-3"]}
              properties={[
                {
                  name: "username",
                  label: "Username",
                  type: "text",
                  bsClass: "form-control",
                  value: formData.username,
                  onChange: e => handleChange(e)
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  bsClass: "form-control",
                  value: formData.password,
                  onChange: e => handleChange(e)
                }
              ]}
            />

            <div className="btn-toolbar">
              <div className="btn-group">
                <Button
                  bsStyle="info"
                  type="button"
                  onClick={e => {
                    e.preventDefault();
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

export default RepoForm;
