import React from 'react';
import {
  FormGroup,
  Button,
  FormLabel,
  FormControl,
  Row,
  Col,
  Form
} from 'react-bootstrap';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';

export const IstioVariable = props => {
  const hosts = Object.keys(props.hosts).map((item, index) => {
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
    <Form>
      <FormGroup>
        <Form.Check
          type="switch"
          id="inj-istio"
          inline
          checked={props.injectIstioCar}
          onChange={e => props.onInjectIstioCar(e.target.checked)}
          label="Inject IstioCar"
        ></Form.Check>

        <Form.Check
          type="switch"
          id="enab-virt-svc"
          inline
          checked={props.enableVirtualService}
          onChange={e => props.onEnableVirtualService(e.target.checked)}
          label="Enable VirtualService"
        ></Form.Check>

        <FormInputs
          ncols={['col-md-4']}
          properties={[
            {
              name: 'apiPath',
              label: 'Context Path',
              type: 'text',
              placeholder: '/xpto',
              bsPrefix: 'form-control',
              value: props.defaultApiPath,
              onChange: e => props.onApiGatewayPathChange(e.target.value)
            }
          ]}
        />
      </FormGroup>

      <Row>
        <Col md={6}>
          <FormGroup>
            <FormLabel>DOMAIN</FormLabel>
            {hosts}
          </FormGroup>

          <Button
            variant="info"
            type="button"
            onClick={() => props.onAddHost()}
          >
            Add Domain
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default IstioVariable;
