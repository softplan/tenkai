import React from "react";
import { Tab } from "react-bootstrap";

export const TabChart = props => {
  const chartName = props.nodeValue.substring(0, props.nodeValue.indexOf(":"));

  return (
    <Tab eventKey={props.eventKey} title={chartName}>
      {chartName}
    </Tab>
  );
};

export default TabChart;
