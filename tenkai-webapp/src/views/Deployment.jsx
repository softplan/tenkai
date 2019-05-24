import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';



class Deployment extends Component {

  state = {
    chartsResult: {charts:[]}
  }    

  componentDidMount() {
    this.getCharts()
  }

  getCharts() {
    axios.get('http://localhost:8080/charts')
    .then(response => this.setState({chartsResult: response.data}))
    .catch(error => console.log(error.message))
  }

  render() {
           
    const items = this.state.chartsResult.charts.map((item, key) =>
            
    <tr key={key} >
        <td><input type="checkbox" className="checkbox"/></td>
        <td>{item.name}</td>
        <td>{item.chartVersion}</td>
        <td>{item.description}</td>
    </tr>

  );       


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
                                                      <th>Description</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                    {items}
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
