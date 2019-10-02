import React from "react";
import { Card } from "components/Card/Card.jsx";
import { Row, Col, FormGroup, Checkbox } from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

export const CanaryCard = props => (
  <Row>
    <Col md={12}>
      <Card
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
                      bsClass: "form-control",
                      value: props.releaseName,
                      onChange: props.handleReleaseNameChange
                    }
                  ]}
                />
              </FormGroup>
              <Checkbox
                inline
                checked={props.dontCreateService}
                onChange={event =>
                  props.handleDontCreateServiceChange(event.target.checked)
                }
              >
                Don't create a service
              </Checkbox>
            </form>
          </div>
        }
      />
    </Col>
  </Row>
);

export default CanaryCard;
