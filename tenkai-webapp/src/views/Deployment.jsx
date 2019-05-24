import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup, ControlLabel, Table
} from "react-bootstrap";
import Select from 'react-select';


import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';



class Deployment extends Component {

  state = {
    selectedOption: null,
    chartsResult: { charts: [] },
    environmentList: []
  }
 
  componentDidMount() {
    this.getEnvironments();
    this.getCharts()
  }

  handleEnvironmentChange = (selectedOption) => {
    this.setState({ selectedOption });
  }


  getEnvironments() {
    axios.get('http://localhost:8080/environments')
      .then(response => {


        var arr = [];
        for (var x=0; x < response.data.Envs.length; x++) {
          var element = response.data.Envs[x];
          console.log(element);
          arr.push({ value: element.name, label: element.name });
        }

        this.setState({ environmentList: arr });


      })
      .catch(error => console.log(error.message))
  }

  getCharts() {
    axios.get('http://localhost:8080/charts')
      .then(response => this.setState({ chartsResult: response.data }))
      .catch(error => console.log(error.message))
  }

  render() {


    const { selectedOption } = this.state;

    const items = this.state.chartsResult.charts.map((item, key) =>

      <tr key={key} >
        <td><input type="checkbox" className="checkbox" /></td>
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
                title="Environment"
                content={
                  <div>

                    <Row>
                      <div className="col-md-5">
                        <FormGroup>
                          <ControlLabel>Environment</ControlLabel>
                          <Select value={selectedOption}  onChange={this.handleEnvironmentChange} options={this.state.environmentList} />
                        </FormGroup>

                      </div>

                    </Row>

                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>

              <Card
                title="Helm Chart"
                content={
                  <div>

                    <div>
                      <Table bordered hover size="sm">
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



                  </div>
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
