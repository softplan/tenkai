import React, { Component } from "react";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
    Button
} from "react-bootstrap";

export class VariablesForm extends Component {

    state = {
        formData: {
            secret: false,
            scope: '',
            name: '',
            value: '',
            description: '',
            environmentId: -1,
        }
    }    

    componentDidMount() {
        if(this.props.editItem) {
            this.setState(() => ({
                formData: this.props.editItem
            }));
        } else {
            this.setState(() => ({
                formData: {
                    secret: false,
                    scope: '',
                    name: '',
                    value: '',
                    description: '',
                    environmentId: -1,
                }
            }));
        }
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

    handleBoolChange = event => {
        const { name, checked } = event.target;
        this.setState(state => ({
            formData: {
                ...state.formData,
                [name]: checked
            }
        }));
    }

    saveClick = event => {
        event.preventDefault();
        const data = this.state.formData;
        this.props.saveClick(data);
    }       


    render() {

        const { editMode } = this.props;

        return (
            <div>
                <CardTenkai title={editMode ? "Edit Variable" : "New Variable"}
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-2", "col-md-3", "col-md-7"]}
                                properties={[
                                    {
                                        name: "scope",
                                        label: "Scope",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        value: this.state.formData.scope,
                                        onChange: this.handleChange

                                        
                                    },
                                    {
                                        name: "name",
                                        label: "Variable Name",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        value: this.state.formData.name,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "value",
                                        label: "Variable Value",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        value: this.state.formData.value,
                                        onChange: this.handleChange

                                    }
                                ]}
                            />

                            <FormInputs
                                ncols={["col-md-8", "col-md-2" ]}
                                properties={[
                                    {
                                        name: "description",
                                        label: "Description",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        value: this.state.formData.description,
                                        onChange: this.handleChange

                                        
                                    },
                                    {
                                        name: "secret",
                                        label: "Secret",
                                        type: "checkbox",
                                        bsPrefix: "form-control",
                                        checked: this.state.formData.secret,
                                        onChange: this.handleBoolChange

                                        
                                    }

                                ]}
                            />
                                                     
                         
                            <div className="btn-toolbar">
                                <div className="btn-group">
                                    <Button variant="info" type="button" onClick={this.saveClick}>
                                        Save
                                    </Button>
                                </div>
                                <div className="btn-group">
                                    <Button variant="info" type="button" onClick={this.props.cancelClick}>
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

export default VariablesForm;
