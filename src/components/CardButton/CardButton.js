import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import CButton from 'components/CustomButton/CustomButton.jsx';
import { Container, ButtonToolbar } from 'react-bootstrap';

export default class CardButton extends Component {
  render() {
    return (
      <CardTenkai
        title=""
        content={
          <Container fluid>
            <h4>{this.props.header}</h4>
            <div align="right">
              <ButtonToolbar style={{ display: 'block' }}>
                <CButton
                  className="pull-right"
                  variant="primary"
                  onClick={this.props.handleClick.bind(this)}
                >
                  {this.props.buttonName}
                </CButton>
              </ButtonToolbar>
            </div>
          </Container>
        }
      />
    );
  }
}
