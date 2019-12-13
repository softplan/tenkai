import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

const Dashboard = () => (
  <div className="content">
    <Container fluid>
      <Row>
        <Col lg={3} sm={6}>
          <StatsCard
            bigIcon={<i className="pe-7s-server text-warning" />}
            statsText="Capacity"
            statsValue="105GB"
            statsIcon={<i className="fa fa-refresh" />}
            statsIconText="Updated now"
          />
        </Col>
        <Col lg={3} sm={6}>
          <StatsCard
            bigIcon={<i className="pe-7s-graph1 text-danger" />}
            statsText="Errors"
            statsValue="23"
            statsIcon={<i className="fa fa-clock-o" />}
            statsIconText="In the last hour"
          />
        </Col>
        <Col lg={3} sm={6}>
          <StatsCard
            bigIcon={<i className="fa fa-twitter text-info" />}
            statsText="Active Clusters"
            statsValue="33"
            statsIcon={<i className="fa fa-refresh" />}
            statsIconText="Updated now"
          />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Dashboard;
