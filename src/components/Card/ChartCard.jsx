import React from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import Button from 'components/CustomButton/CustomButton.jsx';

export const ChartCard = props => (
  <div className="card chart">
    <div className="header">
      <ButtonToolbar>
        <Button
          // className="btn-fill"
          variant="primary"
          size="sm"
          onClick={() =>
            props.deploy(props.item.name + '@' + props.item.chartVersion)
          }
          disabled={props.disabled}
        >
          <i className="pe-7s-album" /> Deploy
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            props.addToDeployList(
              `${props.item.name}@${props.item.chartVersion}`
            )
          }
        >
          <i className="pe-7s-angle-right-circle" /> Multiple deploy
        </Button>
      </ButtonToolbar>
    </div>

    <div className="header">
      <h4 className="title">
        <b>{props.item.name}</b>
      </h4>
      <p className="category">{props.item.chartVersion}</p>
    </div>
    <div className="content">
      <p>
        <i>App Version: </i>
        {props.item.appVersion}
      </p>
      <p>
        <i>Description: </i>
        {props.item.description}
      </p>
    </div>
  </div>
);

export default ChartCard;
