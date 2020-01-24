import React, { Component } from "react";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
    Row,
    Col,
    FormGroup,
    FormControl, 
    FormLabel,
    Button
} from "react-bootstrap";

export class EnvironmentForm extends Component {

    state = {
        formData: {
            ID: '',
            group: '',
            name: '',
            cluster_uri: '',
            ca_certificate: '',
            token: '',
            namespace: '',
            gateway:'',
            currentRelease: ''
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
                <CardTenkai title={editMode ? "Edit Environment" : "New Environment"}
                    content={
                        <form>
                            <FormInputs
                                ncols={["col-md-2", "col-md-3", "col-md-7"]}
                                properties={[
                                    {
                                        name: "group",
                                        label: "Group",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        placeholder: "Version",
                                        value: this.state.formData.group,
                                        onChange: this.handleChange
                                    },
                                    {
                                        name: "name",
                                        label: "Name",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        value: this.state.formData.name,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "cluster_uri",
                                        label: "Cluster API URL",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        placeholder: "http://clusterInfo/",
                                        value: this.state.formData.cluster_uri,
                                        onChange: this.handleChange
                                    }
                                ]}
                            />

                            <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsTextarea">
                                <FormLabel>CA Certificate</FormLabel>
                                <FormControl
                                    name="ca_certificate"
                                    rows="5"
                                    as="textarea"
                                    bsPrefix="form-control"
                                    placeholder="Paste here the CA Certificate"
                                    value={this.state.formData.ca_certificate}
                                    onChange={this.handleChange}
                                />
                                </FormGroup>
                            </Col>
                            </Row>               

                            <FormInputs
                                ncols={["col-md-3", "col-md-3", "col-md-3", "col-md-3"]}
                                properties={[
                                    {
                                        name: "token",
                                        label: "Token",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        placeholder: "Token",
                                        value: this.state.formData.token,
                                        onChange: this.handleChange

                                        
                                    },
                                    {
                                        name: "namespace",
                                        label: "Default Namespace",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        placeholder: "",
                                        value: this.state.formData.namespace,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "gateway",
                                        label: "Default Gateway",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        placeholder: "",
                                        value: this.state.formData.gateway,
                                        onChange: this.handleChange

                                    },
                                    {
                                        name: "currentRelease",
                                        label: "Current Release",
                                        type: "text",
                                        bsPrefix: "form-control",
                                        placeholder: "Current release",
                                        value: this.state.formData.currentRelease,
                                        onChange: this.handleChange
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

                            <div className="clearfix" />

                        </form>
                    }
                />
            </div>
        );
    }

}

export default EnvironmentForm;
