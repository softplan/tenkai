import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table
} from "react-bootstrap";
import { thDependenciesArray, tdDependenciesArray } from "variables/Variables.jsx";

import { Card } from "components/Card/Card.jsx";

class Dependencies extends Component {

  render() {

    return (
      <div className="content">
        <Grid fluid>

          <Row>


            <Col md={8}>
              <Card
                title="GDX-SAJ - 1.0.1"
                category="Microservice"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thDependenciesArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdDependenciesArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>


          </Row>


        </Grid>
      </div>
    );
  }
}

export default Dependencies;
