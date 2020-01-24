import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button, Row, Col, Form } from 'react-bootstrap';

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
                  <Form.Check
                    id="handleChangeCopyRelease"
                    type="switch"
                    name="handleChangeCopyRelease"
                    inline
                    checked={this.state.formData.copyLatestRelease}
                    onChange={this.handleChangeCopyRelease}
                    label="Associate services from latest version"
                  ></Form.Check>
                </Col>
              </Row>
              <Row>
                <Col md={6}> </Col>
              </Row>

              <div className="btn-toolbar">
                <div className="btn-group">
                  <Button variant="info" type="button" onClick={this.saveClick}>
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
            </form>
          }
        />
      </div>
    );
  }
}

export default EditProductRelease;
