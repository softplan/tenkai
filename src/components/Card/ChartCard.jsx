import React, { Component } from "react";

export class ChartCard extends Component {
  render() {
    return (
      <div className="card-plain">
          <h3>{this.props.name}</h3>
      </div>
    );
  }
}

export default ChartCard;
