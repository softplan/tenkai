import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <nav className="pull-left"></nav>
          <p className="copyright pull-right">
            &copy; 2019-2021
            <a href="https://github.com/softplan/tenkai">
              https://github.com/softplan/tenkai
            </a>
          </p>
        </Container>
      </footer>
    );
  }
}

export default Footer;
