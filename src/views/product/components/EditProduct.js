import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button } from 'react-bootstrap';

export class EditProduct extends Component {
  state = {
    formData: {
      ID: '',
      team: '',
      name: ''
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
