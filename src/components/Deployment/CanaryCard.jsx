import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import {
    Row,
    Col,
    FormGroup, Checkbox
} from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

export class CanaryCard extends Component {

    handleDontCreateServiceChange = event => {
        const value = event.target.checked;        
        this.props.handleDontCreateServiceChange(value);
    }

   render() {

        return (
            <Row>
                <Col md={12}>
                    <Card plain
                        title="Advanced Options"
                        category="Make sure you know what you're doing"
                        content={
                            <div>
                                <form>
                                        <FormGroup>
                                            <FormInputs
                                                ncols={["col-md-6"]}
                                                properties={[
                                                    {
                                                        name: "releaseName",
                                                        label: "Release Name",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        value: this.props.releaseName,
                                                        onChange: this.props.handleReleaseNameChange
                                                    },
                                                ]}
                                            />
                                        </FormGroup>
                                        <Checkbox inline checked={this.props.dontCreateService} onChange={this.handleDontCreateServiceChange.bind(this)} >Don't create a service</Checkbox>{' '}
                                       

                                    </form>                                
                            </div>
                        }
                    />
                </Col>
            </Row>
        );

    }
}

export default CanaryCard;
