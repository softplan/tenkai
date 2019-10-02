import React, { Component } from "react";
import {
  FormGroup,
  Button,
  Checkbox,
  ControlLabel,
  FormControl,
  Row,
  Col
} from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

export const IstioVariable = props => {
  const hosts = Object.keys(props.hosts).map((item, index) => {
    //let name="istio.virtualservices.hosts[" + index + "]";
    //console.log('alfa: ' + name);
    //console.log('beta: ' + item);
    return (
      <FormControl
        key={index}
        name={item}
        type="text"
        placeholder="Add URL"
        value={props.hosts[item]}
        onChange={e => props.onHostChange(e.target.name, e.target.value)}
      />
    );
  });

  return (
    <form>
      <FormGroup>
        <Checkbox
          inline
          checked={props.injectIstioCar}
          onChange={e => props.onInjectIstioCar(e.target.checked)}
        >
          Inject IstioCar
        </Checkbox>{" "}
        <Checkbox
          inline
          checked={props.enableVirtualService}
          onChange={e => props.onEnableVirtualService(e.target.checked)}
        >
          Enable VirtualService
        </Checkbox>
        <FormInputs
          ncols={["col-md-4"]}
          properties={[
            {
              name: "apiPath",
              label: "Context Path",
              type: "text",
              placeholder: "/xpto",
              bsClass: "form-control",
              value: props.defaultApiPath,
              onChange: e => props.onApiGatewayPathChange(e.target.value)
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

          <Button
            bsStyle="info"
            type="button"
            onClick={() => props.onAddHost()}
          >
            Add Domain
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default IstioVariable;
