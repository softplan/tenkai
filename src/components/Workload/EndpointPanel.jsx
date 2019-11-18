import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';

export class EndpointPanel extends Component {
  render() {
    const list = this.props.list.map((item, key) => (
      <ListGroupItem key={key} href={'http://' + item} target="_blank">
        {item}
      </ListGroupItem>
    ));
    return (
      <Row>
        <Col xs={6}>
          <ListGroup>{list}</ListGroup>
        </Col>
      </Row>
    );
  }
}

export default EndpointPanel;
