import React, { Component } from 'react';
import Select from 'react-select';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { Button, Row, Col, FormLabel, Form, FormGroup } from 'react-bootstrap';

export class EditProductRelease extends Component {
  state = {
    formData: {
      ID: 0,
      version: '',
      baseRelease: 0,
      hotFix: false
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

  handleHotFix = event => {
    const { checked } = event.target;
    this.setState(state => ({
      formData: {
        ...state.formData,
        hotFix: checked
      }
    }));
  };

  render() {
    const { editMode, productReleases } = this.props;
    const { selectedBaseRelease } = this.state;
    const releases = productReleases.map(e => ({ label: e.version, value: e }));
    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit Product Release' : 'New Product Release'}
          content={
            <form>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Form.Label>Version</Form.Label>
                    <Form.Control
                      name="version"
                      label="Version"
                      type="text"
                      onChange={this.handleChange}
                      value={this.state.formData.version}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Form.Label>Hotfix Release</Form.Label>
                    <Form.Switch
                      id="hotFix"
                      inline={false}
                      checked={this.state.formData.hotFix}
                      onChange={e => this.handleHotFix(e)}
                      label=""
                    ></Form.Switch>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
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
