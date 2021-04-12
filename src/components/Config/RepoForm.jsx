import React, { useState } from "react";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button } from "react-bootstrap";

export const RepoForm = ({ editMode, editItem, ...props }) => {
  const [formData, setFormData] = useState(
    editItem ? editItem : { name: "", url: "", password: "", username: "" }
  );

  const handleChange = ({ target: { value, name } }) =>
    setFormData({ ...formData, [name]: value });

  return (
    <div>
      <CardTenkai
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
                  bsPrefix: "form-control",
                  value: formData.name,
                  onChange: e => handleChange(e)
                },
                {
                  name: "url",
                  label: "URL",
                  type: "text",
                  bsPrefix: "form-control",
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
                  bsPrefix: "form-control",
                  value: formData.username,
                  onChange: e => handleChange(e)
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  bsPrefix: "form-control",
                  value: formData.password,
                  onChange: e => handleChange(e)
                }
              ]}
            />

            <div className="btn-toolbar">
              <div className="btn-group">
                <Button
                  variant="info"
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
                  variant="info"
                  type="button"
                  onClick={props.cancelClick}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        }
      />
    </div>
  );
};

export default RepoForm;
