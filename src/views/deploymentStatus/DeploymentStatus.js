import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormControl,
  FormGroup,
  FormLabel
} from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';
import * as selectors from 'stores/deploymentStatus/reducer';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

export class DeploymentStatus extends Component {
  state = {
    inputFilter: ''
  };

  onViewItems = item => {};

  render() {
    let columns = [];
    columns.push(col.addCol('ID', 'Request Ids', '3%'));
    columns.push(col.addCol('chart', 'Chart', '11%'));
    columns.push(col.addCol('CreatedAt', 'Created At', '7%'));
    columns.push(col.addCol('UpdatedAt', 'Updated At', '7%'));
    columns.push(col.addCol('success', 'Success', '3%'));

    let jsonData = [require('./mock-environments-status.json')][0].data;
    let data = jsonData.filter(
      d =>
        this.state.inputFilter === '' ||
        d.chart.includes(this.state.inputFilter)
    );
    
    
    return (
      <div className="content">
        
        <SimpleModal>
          
        </SimpleModal>
        
        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title="Status"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <FormLabel>Deployment Search</FormLabel>
                        <FormControl
                          value={this.state.inputFilter}
                          onChange={e =>
                            this.setState({
                              inputFilter: e.target.value
                            })
                          }
                          style={{ width: '100%' }}
                          type="text"
                          placeholder="Search using any CHART"
                          aria-label="Search using any field"
                        ></FormControl>
                      </FormGroup>
                    </div>
                    <TenkaiTable keyfield="ID" columns={columns} data={data} />
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
  deploy: selectors.getDeploymentStatus(state)
});

export default connect(mapStateToProps)(DeploymentStatus);
