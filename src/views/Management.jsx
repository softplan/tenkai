import React, { Component } from "react";
import {
  Grid,
  Row,
  Col
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";

class Management extends Component {

  render() {

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>

                    <Row>
                      <div className="col-md-5">

                      </div>
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
  }
}

export default Management;
