import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CardTenkai } from "components/Card/CardTenkai.jsx";

const Management = () => (
  <div className="content">
    <Container fluid>
      <Row>
        <Col md={12}>
          <CardTenkai
            title=""
            content={
              <form>
                <Row>
                  <div className="col-md-5"></div>
                </Row>
              </form>
            }
          />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Management;
