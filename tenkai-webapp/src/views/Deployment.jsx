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
    selectedOption: {},
    chartsResult: { charts: [] },
    environmentList: [],
    charts: []
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
          arr.push({ value: element.ID, label: element.name });
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

  navigateToCheckVariables(charts, selected) {

    this.props.history.push({
        pathname: "/admin/deployment-wvars", 
        search: "?environment="+selected.value,
        state: { charts: charts, environment: selected.label }
    });

  }    

  handleCheckboxChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    let array;
    if (isChecked) {
       array = this.state.charts;
      array.push(item);   
      this.setState({charts: array})
    } else {
      array = this.state.charts; 
      var index = array.indexOf(item)
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ charts: array });
      }
    }
    
  }  

  render() {

    const { selectedOption } = this.state;

    const items = this.state.chartsResult.charts.map((item, key) =>

      <tr key={key} >
        <td><input name={item.name} type="checkbox" className="checkbox"  onChange={this.handleCheckboxChange.bind(this)} /></td>
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

                    <Button bsStyle="info" 
                      fill type="button"
                      onClick={this.navigateToCheckVariables.bind(this, this.state.charts, this.state.selectedOption)}>
                        Analyse Dependencies
                    </Button>

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
