import React, { Component } from 'react';
import { Card } from 'components/Card/Card.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button } from 'react-bootstrap';

export class EditRule extends Component {
  state = {
    formData: {
      ID: '',
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
        <Card
          title={editMode ? 'Edit Variable Rule' : 'New Variable Rule'}
          content={
            <form>
              <FormInputs
                ncols={['col-md-6']}
                properties={[
                  {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    bsClass: 'form-control',
                    value: this.state.formData.name,
                    onChange: this.handleChange
                  }
                ]}
              />

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

export default EditRule;
