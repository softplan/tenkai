import React, { Component } from "react";
import {
    Tab
} from "react-bootstrap";
//import HelmVariables from "components/Deployment/HelmVariables.jsx";

export class TabChart extends Component {

    state = {
        eventkey: 1,
        chartName: "xxx",
        chartVersion: "",
        environmentId: 0, 
    }

    componentDidMount() {

      const chartName=this.props.nodeValue.substring(0, this.props.nodeValue.indexOf(":"));
      const chartVersion="";

      this.setState({eventKey: this.props.eventKey, 
                    chartName: chartName, 
                    chartVersion: chartVersion, 
                    environmentId: this.props.environmentId});
    }

    render() {
         return (
            <Tab eventKey={this.state.eventKey} title={this.state.chartName}>
                {this.state.chartName}
            </Tab>            
         );
    }

}

export default TabChart;
