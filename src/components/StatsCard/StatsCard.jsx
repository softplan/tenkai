import React from "react";
import { Row, Col } from "react-bootstrap";

export const StatsCard = props => (
  <div className="card card-stats">
    <div className="content">
      <Row>
        <Col xs={5}>
          <div className="icon-big text-center icon-warning">
            {props.bigIcon}
          </div>
        </Col>
        <Col xs={7}>
          <div className="numbers">
            <p>{props.statsText}</p>
            {props.statsValue}
          </div>
        </Col>
      </Row>
      <div className="footer">
        <hr />
        <div className="stats">
          {props.statsIcon} {props.statsIconText}
        </div>
      </div>
    </div>
  </div>
);

export default StatsCard;
