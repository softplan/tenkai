import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button, FormGroup, Form } from 'react-bootstrap';

export class EditProduct extends Component {
  state = {
    formData: {
      ID: '',
      team: '',
      name: '',
      validateReleases: true
    }
  };

  componentDidMount() {
    if (this.props.editItem) {
      this.setState(() => ({
        formData: this.props.editItem
      }));
    } else {
      this.setState(() => ({
        formData: {}
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

  handleValidateReleases = event => {
    const { checked } = event.target;
    console.log(checked)
    this.setState(state => ({
      formData: {
        ...state.formData,
        validateReleases: checked
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
          title={editMode ? 'Edit Product' : 'New Product'}
          content={
            <form>
              <FormInputs
                ncols={['col-md-6']}
                properties={[
                  {
                    name: 'name',
                    label: 'Product Name',
                    type: 'text',
                    bsPrefix: 'form-control',
                    value: this.state.formData.name,
                    onChange: this.handleChange
                  }
                ]}
              />

              <FormGroup>
                <Form.Check
                  id="validateReleases"
                  type="switch"
                  inline
                  checked={this.state.formData.validateReleases}
                  onChange={this.handleValidateReleases}
                  label="Enable release version validation"
                ></Form.Check>
              </FormGroup>

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

export default EditProduct;
