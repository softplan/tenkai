import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
    Button
} from "react-bootstrap";

export class VariablesForm extends Component {

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
                                        label: "Scope",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Scope",
                                        
                                    },
                                    {
                                        label: "Variable Name",
                                        type: "text",
                                        bsClass: "form-control"
                                    },
                                    {
                                        label: "Variable Value",
                                        type: "text",
                                        bsClass: "form-control"
                                    }
                                ]}
                            />

                            <FormInputs
                                ncols={["col-md-8"]}
                                properties={[
                                    {
                                        label: "Description",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Scope",
                                        
                                    }
                                ]}
                            />
                                                     
                         
                            <div class="btn-toolbar">
                                <div class="btn-group">
                                    <Button bsStyle="info" pullRight fill type="button">
                                        Save
                                    </Button>
                                </div>
                                <div class="btn-group">
                                    <Button bsStyle="info" pullRight fill type="button" onClick={this.props.cancelClick}>
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
