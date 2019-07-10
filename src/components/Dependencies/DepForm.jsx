import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button} from "react-bootstrap";


export class DepForm extends Component {

    state = {
        formData: {
            ID: '',
            chartName: '', 
            version: '',
        }
    }    

    componentDidMount() {
        if(this.props.editItem) {
            this.setState(() => ({
                formData: this.props.editItem
            }));
        } else {
            this.setState(() => ({
                formData: {}
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

    saveClick = event => {
        event.preventDefault();
        const data = this.state.formData;
        this.props.saveClick(data);
    }    

    render() {
        const { editMode } = this.props;
        return (
            <div>
                <Card title={editMode ? "Edit Dependency" : "New Dependency"}
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-4", "col-md-2" ]}
                                properties={[
                                    {
                                        name: "chartName",
                                        label: "Release",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Version",
                                        value: this.state.formData.chartName,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "version",
                                        label: "Version",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Version",
                                        value: this.state.formData.version,
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

export default DepForm;
