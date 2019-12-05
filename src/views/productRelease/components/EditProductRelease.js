import React, { Component } from 'react';
import { Card } from 'components/Card/Card.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button, Row, Col, Checkbox } from 'react-bootstrap';

export class EditProductRelease extends Component {
  state = {
    formData: {
      ID: '',
      version: '',
      copyLatestRelease: false
    }
  };

  componentDidMount() {
    if (this.props.editMode) {
      this.setState(() => ({
        formData: {
          ...this.props.editItem,
          copyLatestRelease: false
        }
      }));
    } else {
      this.setState(() => ({
        formData: {
          copyLatestRelease: true
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

  handleChangeCopyRelease = event => {
    const { checked } = event.target;
    this.setState(state => ({
      formData: {
        ...state.formData,
        copyLatestRelease: checked
      }
    }));
  };

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    this.props.saveClick(data);
  };

  render() {
    const { editMode } = this.props;

    return (
      <div>
        <Card
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
                        bsClass: 'form-control',
                        value: this.state.formData.version,
                        onChange: this.handleChange
                      }
                    ]}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Checkbox
                    name="handleChangeCopyRelease"
                    inline
                    checked={this.state.formData.copyLatestRelease}
                    onChange={this.handleChangeCopyRelease}
                  >
                    Associate services from latest version
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col md={6}> </Col>
              </Row>

              <div className="btn-toolbar">
                <div className="btn-group">
                  <Button bsStyle="info" type="button" onClick={this.saveClick}>
                    Save
                  </Button>
                </div>
                <div className="btn-group">
                  <Button
                    bsStyle="info"
                    type="button"
                    onClick={this.props.cancelClick}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="clearfix" />
            </form>
          }
        />
      </div>
    );
  }
}

export default EditProductRelease;
