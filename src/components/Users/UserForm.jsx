import React, { Component } from "react";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button, FormGroup, Form } from "react-bootstrap";
import { getAllEnvironments } from 'client-api/apicall.jsx';

export class UserForm extends Component {
  state = {
    formData: { checkedEnvs: [], email: "" },
    envs: []
  };

  componentDidMount() {
    if (this.props.editMode) {
      let envs = this.props.editItem.Environments;

      let checkedEnvs = [];
      for (let x = 0; x < envs.length; x++) {
        checkedEnvs.push("" + envs[x].ID);
      }
      this.props.editItem.checkedEnvs = checkedEnvs;

      this.setState({ formData: this.props.editItem }, () => {});
    } else {
      this.setState(() => ({
        formData: { checkedEnvs: [], email: "" }
      }));
    }
    getAllEnvironments(this, envs => {
      let environments = [];
      envs.forEach(e => {
        environments.push({ ID: e.ID, name: e.name })
      });
      this.setState({ envs: environments });
    });
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      formData: { ...state.formData, [name]: value }
    }));
  };

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    this.props.saveClick(data);
  };

  handleEnvironmentCheckedChange = event => {
    const item = event.target.name;
    let checkedEnvs = this.state.formData.checkedEnvs;
    if (checkedEnvs === undefined) {
      checkedEnvs = [];
    }
    let index = checkedEnvs.indexOf(item);
    if (index !== -1) {
      checkedEnvs.splice(index, 1);
    } else {
      checkedEnvs.push(item);
    }
    this.setState(
      { formData: { ...this.state.formData, checkedEnvs: checkedEnvs } },
      () => {}
    );
  };

  render() {
    const { editMode } = this.props;

    const items = this.state.envs.map((item, key) => (
      <Form.Check
        name={item.ID}
        key={key}
        id={item.ID}
        type="switch"
        inline
        checked={this.state.formData.checkedEnvs.indexOf('' + item.ID) !== -1}
        onChange={this.handleEnvironmentCheckedChange.bind(this)}
        label={item.name}
      ></Form.Check>
    ));

    return (
      <div>
        <CardTenkai
          title={editMode ? "Edit User" : "New User"}
          content={
            <form>
              <FormInputs
                ncols={["col-md-6"]}
                properties={[
                  {
                    name: "email",
                    label: "Email",
                    type: "text",
                    bsPrefix: "form-control",
                    value: this.state.formData.email,
                    onChange: this.handleChange
                  }
                ]}
              />

              <h5>Environments</h5>

              <FormGroup>{items}</FormGroup>

              <div className="btn-toolbar">
                <div className="btn-group">
                  <Button variant="info" type="button" onClick={this.saveClick}>
                    Save
                  </Button>
                </div>
                <div className="btn-group">
                  <Button
                    variant="info"
                    type="button"
                    onClick={this.props.cancelClick}
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
  }
}

export default UserForm;
