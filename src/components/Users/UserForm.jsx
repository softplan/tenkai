import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
    Button, FormGroup, Checkbox
} from "react-bootstrap";
import { getAllEnvironments } from 'client-api/apicall.jsx';

export class UserForm extends Component {

    state = {
        formData: {
            checkedEnvs: [],
            email: '',
        },
        envs: [],
    }

    componentDidMount() {
        if (this.props.editItem) {

            let envs = this.props.editItem.Environments;

            let checkedEnvs = [];
            for (let x = 0; x < envs.length; x++) {
                checkedEnvs.push(""+envs[x].ID);
            }
            this.props.editItem.checkedEnvs = checkedEnvs;

            this.setState({
                formData: this.props.editItem
            }, () => {
                
            });


        } else {
            this.setState(() => ({
                formData: {}
            }));
        }
        getAllEnvironments(this);
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState(state => ({
            formData: {
                ...state.formData,
                [name]: value
            }
        }));
    }

    saveClick = event => {
        event.preventDefault();
        const data = this.state.formData;
        this.props.saveClick(data);
    }


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
        this.setState({ formData: { ...this.state.formData, checkedEnvs: checkedEnvs }}, () => {
            
        });

    }

    render() {
        const { editMode } = this.props;

        const items = this.state.envs.map((item, key) =>
            
            <Checkbox name={item.ID} key={key} inline 
                checked={this.state.formData.checkedEnvs.indexOf(""+item.ID) !== -1} 
                onChange={this.handleEnvironmentCheckedChange.bind(this)}>{item.name}</Checkbox> 
        );

        return (
            <div>
                <Card title={editMode ? "Edit User" : "New User"}
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-6"]}
                                properties={[
                                    {
                                        name: "email",
                                        label: "Email",
                                        type: "text",
                                        bsClass: "form-control",
                                        value: this.state.formData.email,
                                        onChange: this.handleChange

                                    }
                                ]}
                            />

                            <h5>Environments</h5>

                            <FormGroup>
                                {items}
                            </FormGroup>

                            <div className="btn-toolbar">
                                <div className="btn-group">
                                    <Button bsStyle="info" type="button" onClick={this.saveClick}>
                                        Save
                                    </Button>
                                </div>
                                <div className="btn-group">
                                    <Button bsStyle="info" type="button" onClick={this.props.cancelClick}>
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
    }

}

export default UserForm;
