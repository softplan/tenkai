import React, { Component } from "react";
import {
    FormGroup, Button, Checkbox, ControlLabel, FormControl, Row, Col
} from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

export class IstioVariable extends Component {

    addHost = () => {
        this.props.onAddHost();
    }

    handleApiGatewayPathChange = event => {
        const value = event.target.value;        
        this.props.onApiGatewayPathChange(value);
    }

    handleOnInjectIstioCar = event => {
        const value = event.target.checked;        
        this.props.onInjectIstioCar(value);
    }

    handleEnableVirtualService = event => {
        const value = event.target.checked;        
        this.props.onEnableVirtualService(value);
    }

    handleOnHostChange = event => {
        const {name, value} = event.target;        
        console.log(name + " =>" + value);
        this.props.onHostChange(name, value);
    }


    render() {

         const hosts =  Object.keys(this.props.hosts).map((item, index) => {
            //let name="istio.virtualservices.hosts[" + index + "]";
            //console.log('alfa: ' + name);
            //console.log('beta: ' + item);
            return(
                <FormControl key={index}
                    name={item}
                    type="text"
                    placeholder="Add URL"
                    value={this.props.hosts[item]}
                    onChange={this.handleOnHostChange}
                />
            );
        });         

         return (

            <form>

            <FormGroup>
                <Checkbox inline checked={this.props.injectIstioCar} onChange={this.handleOnInjectIstioCar}>Inject IstioCar</Checkbox>{' '}
                <Checkbox inline checked={this.props.enableVirtualService} onChange={this.handleEnableVirtualService}>Enable VirtualService</Checkbox>

                <FormInputs
                ncols={["col-md-4"]}
                properties={[
                    {
                        name: "apiPath",
                        label: "Context Path",
                        type: "text",
                        placeholder: "/xpto",
                        bsClass: "form-control",
                        value: this.props.defaultApiPath,
                        onChange: this.handleApiGatewayPathChange
                    }
                ]}                                        
                />
            </FormGroup>

            <Row>
                <Col md={6}>
                    <FormGroup>
                            <ControlLabel>DOMAIN</ControlLabel>
                            {hosts}
                    </FormGroup>                

                    <Button bsStyle="info" type="button" onClick={this.addHost.bind(this)}>
                        Add Domain
                    </Button>
                </Col>
            </Row>            


        </form>            

         );
    }

}

export default IstioVariable;
