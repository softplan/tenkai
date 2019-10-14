import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

const Management = () => (
  <div className="content">
    <Grid fluid>
      <Row>
        <Col md={12}>
          <Card
            title=""
            content={
              <form>
                <Row>
                  <div className="col-md-5"></div>
                </Row>

                <div className="clearfix" />
              </form>
            }
          />
        </Col>
      </Row>
    </Grid>
  </div>
);

export default Management;
