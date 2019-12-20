import React from 'react';
import { Row, Col, ButtonToolbar } from 'react-bootstrap';
import Button from 'components/CustomButton/CustomButton.jsx';

export const ActionCard = props => (
  <div className={'card' + (props.plain ? ' card-plain' : '')}>
    <div
      className={'header' + (props.hCenter ? ' text-center' : '')}
      style={{ backgroundColor: '#FAFAFA' }}
    >
      <Row>
        <Col md={8}>
          <h4 className="title">{props.title}</h4>
        </Col>
        <Col md={4}>
          <div align="right">
            <ButtonToolbar style={{ display: 'block' }}>
              <Button
                className="btn btn-primary pull-right btn-fill"
                type="button"
                disabled={props.buttonsDisabled}
                onClick={props.directDeployOnClick}
              >
                <i className="pe-7s-album" /> Deploy
              </Button>
            </ButtonToolbar>
          </div>
        </Col>
      </Row>
    </div>
    <div
      className={
        'content' +
        (props.ctAllIcons ? ' all-icons' : '') +
        (props.ctTableFullWidth ? ' table-full-width' : '') +
        (props.ctTableResponsive ? ' table-responsive' : '') +
        (props.ctTableUpgrade ? ' table-upgrade' : '')
      }
    >
      {props.content}

      <div className="footer">
        {props.legend}
        {props.stats != null ? <hr /> : ''}
        <div className="stats">
          <i className={props.statsIcon} /> {props.stats}
        </div>
      </div>
    </div>
  </div>
);

export default ActionCard;
