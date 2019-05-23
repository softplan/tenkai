import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
    Button
} from "react-bootstrap";

export class VariablesForm extends Component {

    state = {
        formData: {
            scope: '',
            name: '',
            value: '',
            description: '',
            environmentId: -1,
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

    saveClick = event => {
        event.preventDefault();
        const data = this.state.formData;
        this.props.saveClick(data);
    }       


    render() {
        return (
            <div>
                <Card title="New Variable"
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-2", "col-md-3", "col-md-7"]}
                                properties={[
                                    {
                                        name: "scope",
                                        label: "Scope",
                                        type: "text",
                                        bsClass: "form-control",
                                        value: this.state.formData.scope,
                                        onChange: this.handleChange

                                        
                                    },
                                    {
                                        name: "name",
                                        label: "Variable Name",
                                        type: "text",
                                        bsClass: "form-control",
                                        value: this.state.formData.name,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "value",
                                        label: "Variable Value",
                                        type: "text",
                                        bsClass: "form-control",
                                        value: this.state.formData.value,
                                        onChange: this.handleChange

                                    }
                                ]}
                            />

                            <FormInputs
                                ncols={["col-md-8"]}
                                properties={[
                                    {
                                        name: "description",
                                        label: "Description",
                                        type: "text",
                                        bsClass: "form-control",
                                        value: this.state.formData.description,
                                        onChange: this.handleChange

                                        
                                    }
                                ]}
                            />
                                                     
                         
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

export default VariablesForm;
