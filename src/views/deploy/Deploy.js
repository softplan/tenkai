import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

import CardButton from 'components/CardButton/CardButton';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import TenkaiTable from 'components/Table/TenkaiTable';

import * as col from 'components/Table/TenkaiColumn';
import * as actions from 'stores/deploy/actions';
import * as selectors from 'stores/deploy/reducer';

export class Deploy extends Component {
  onDeploy() {
    let payload = this.createDeployPayload();
    this.props.dispatch(actions.deploy(payload));
  }

  createDeployPayload() {
    return {
      productVersionId: this.props.deploy.productVersionId,
      environmentId: this.props.selectedEnvironment.value,
      deployables: this.props.deploy.chartsToDeploy.map(c => ({
        environmentId: this.props.selectedEnvironment.value,
        chart: c.chartName,
        chartVersion: c.chartVersion,
        name: this.getChartName(c.chartName)
      }))
    };
  }

  getChartName(name) {
    let splited = name.split('/');
    if (splited.length > 0) {
      return splited[1];
    }
    return name;
  }

  render() {
    let columns = [];
    columns.push(col.addCol('chartName', 'Chart Name'));
    columns.push(col.addCol('chartVersion', 'Chart Version'));
    columns.push(col.addCol('dockerTag', 'Docker Tag'));

    let data = [];
    if (
      this.props.deploy !== undefined &&
      this.props.deploy.chartsToDeploy !== undefined
    ) {
      data = this.props.deploy.chartsToDeploy;
    }

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <CardButton
                buttonName="Deploy"
                handleClick={this.onDeploy.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <CardTenkai
                title="Charts to Deploy"
                content={
                  <form>
                    <TenkaiTable
                      keyfield="chartName"
                      columns={columns}
                      data={data}
                    />
                  </form>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deploy: selectors.getDeploy(state)
});

export default connect(mapStateToProps)(Deploy);
