import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button} from "react-bootstrap";


export class ReleaseForm extends Component {
    render() {
        return (
            <div>
                <Card title="New Release"
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-2", "col-md-2"]}
                                properties={[
                                    {
                                        label: "Release Number",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Version"
                                    },
                                    {
                                        label: "Release Date",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "dd/MM/yyyy"
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

export default ReleaseForm;
