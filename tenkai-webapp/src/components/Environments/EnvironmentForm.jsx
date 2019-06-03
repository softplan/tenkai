import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
    Row,
    Col,
    FormGroup,
    FormControl, 
    ControlLabel,
    Button
} from "react-bootstrap";

export class EnvironmentForm extends Component {

    state = {
        formData: {
            group: '',
            name: '',
            cluster_uri: '',
            ca_certificate: '',
            token: '',
            namespace: '',
            gateway:''
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
                <Card title="New Environment"
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-2", "col-md-3", "col-md-7"]}
                                properties={[
                                    {
                                        name: "group",
                                        label: "Group",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Version",
                                        value: this.state.formData.group,
                                        onChange: this.handleChange
                                    },
                                    {
                                        name: "name",
                                        label: "Name",
                                        type: "text",
                                        bsClass: "form-control",
                                        value: this.state.formData.name,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "cluster_uri",
                                        label: "Cluster API URL",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "http://clusterInfo/",
                                        value: this.state.formData.cluster,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />

                            <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>CA Certificate</ControlLabel>
                                <FormControl
                                     name="ca_certificate"
                                    rows="5"
                                    componentClass="textarea"
                                    bsClass="form-control"
                                    placeholder="Paste here the CA Certificate"
                                    value={this.state.formData.certificate}
                                    onChange={this.handleChange}
                                />
                                </FormGroup>
                            </Col>
                            </Row>               

                            <FormInputs
                                ncols={["col-md-2", "col-md-3", "col-md-3"]}
                                properties={[
                                    {
                                        name: "token",
                                        label: "Token",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Token",
                                        value: this.state.formData.token,
                                        onChange: this.handleChange

                                        
                                    },
                                    {
                                        name: "namespace",
                                        label: "Default Namespace",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "",
                                        value: this.state.formData.namespace,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "gateway",
                                        label: "Default Gateway",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "",
                                        value: this.state.formData.gateway,
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

export default EnvironmentForm;
