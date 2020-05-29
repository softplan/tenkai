import React, { Component } from 'react';
import Select from 'react-select';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button, Row, Col, FormLabel } from 'react-bootstrap';

export class EditProductRelease extends Component {
  state = {
    formData: {
      ID: 0,
      version: '',
      baseRelease: 0
    },
    selectedBaseRelease: {}
  };

  componentDidMount() {
    if (this.props.editMode) {
      this.setState(() => ({
        formData: {
          ...this.props.editItem
        }
      }));
    }
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      formData: {
        ...state.formData,
        [name]: value
      }
    }));
  };

  handleBaseReleaseChange = selectedBaseRelease => {
    this.setState(state => ({
      formData: {
        ...state.formData,
        baseRelease: selectedBaseRelease.value.ID
      },
      selectedBaseRelease
    }));
  };

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    this.props.saveClick(data);
  };

  render() {
    const { editMode, productReleases } = this.props;
    const { selectedBaseRelease } = this.state;
    const releases = productReleases.map(e => ({ label: e.version, value: e }));

    console.log(`State: ${JSON.stringify(this.state, null, 2)}`);
    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit Product Release' : 'New Product Release'}
          content={
            <form>
              <Row>
                <Col md={12}>
                  <FormInputs
                    ncols={['col-md-3']}
                    properties={[
                      {
                        name: 'version',
                        label: 'Version',
                        type: 'text',
                        bsPrefix: 'form-control',
                        value: this.state.formData.version,
                        onChange: this.handleChange
                      }
                    ]}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormLabel>Associate services from version</FormLabel>
                  <Select
                    value={selectedBaseRelease}
                    onChange={this.handleBaseReleaseChange}
                    options={releases}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div style={{ paddingTop: '15px' }} className="btn-toolbar">
                    <div className="btn-group">
                      <Button
                        variant="info"
                        type="button"
                        onClick={this.saveClick}
                      >
                        Save
                      </Button>
                    </div>
                    <div className="btn-group">
                      <Button
                        variant="info"
                        type="button"
                        onClick={this.props.cancelClick}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </form>
          }
        />
      </div>
    );
  }
}

export default EditProductRelease;
