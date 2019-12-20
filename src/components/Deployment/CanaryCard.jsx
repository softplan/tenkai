import React from "react";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { Row, Col, FormGroup, Form } from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

export const CanaryCard = props => (
  <Row>
    <Col md={12}>
      <CardTenkai
        plain
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
                      bsPrefix: "form-control",
                      value: props.releaseName,
                      onChange: props.handleReleaseNameChange
                    }
                  ]}
                />
              </FormGroup>
              <Form.Check
                id="create-svc"
                type="switch"
                inline
                checked={!props.dontCreateService}
                onChange={event =>
                  props.handleDontCreateServiceChange(!event.target.checked)
                }
                label="Create a service"
              ></Form.Check>
            </form>
          </div>
        }
      />
    </Col>
  </Row>
);

export default CanaryCard;
