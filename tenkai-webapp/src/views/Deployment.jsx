import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";


class Deployment extends Component {

  render() {

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  

                            <Row>
                                <Col md={12}>

                                  <Card
                                      title="Deployment"
                                      content={
                                          <form>
                                              
                                              <div>
                                              <Table  bordered hover size="sm">
                                                  <thead>
                                                      <tr>
                                                      <th>#</th>
                                                      <th>Helm Chart</th>
                                                      <th>Version</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      <tr >
                                                      <td><input type="checkbox" className="checkbox"/></td>
                                                      <td>GDX-SAJ</td>
                                                      <td>0.1.0</td>
                                                      </tr>
                                                      <tr >
                                                      <td><input type="checkbox" className="checkbox"/></td>
                                                      <td>PD-API</td>
                                                      <td>0.1.0</td>
                                                      </tr>
                                                      <tr >
                                                      <td><input type="checkbox" className="checkbox"/></td>
                                                      <td>TJ-REPORTS</td>
                                                      <td>0.1.0</td>
                                                      </tr>
                                                  </tbody>
                                                  </Table>
              
                                              </div>

                                              <Button bsStyle="info" fill type="button">Analyse Dependencies</Button>               

                                            
                                              
                                          </form>
                                      }
                                  />
                              </Col>
                          </Row>                    

                }
              />
            </Col>
          </Row>


        </Grid>
      </div>
    );
  }
}

export default Deployment;
