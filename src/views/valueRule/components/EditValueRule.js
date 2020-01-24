import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { FormGroup, FormLabel, Button, Col } from 'react-bootstrap';
import Select from 'react-select';

export class EditRule extends Component {
  state = {
    formData: {
      ID: '',
      type: '',
      value: ''
    },
    ruleTypes: [],
    selectedRuleType: {}
  };

  componentDidMount() {
    if (this.props.editItem) {
      const selected = this.props.ruleTypes.filter(
        e => e.value === this.props.editItem.type
      );

      this.setState(() => ({
        formData: this.props.editItem,
        ruleTypes: this.props.ruleTypes,
        selectedRuleType: selected
      }));
    } else {
      this.setState(() => ({
        formData: {},
        ruleTypes: this.props.ruleTypes
      }));
    }
  }

  handleRuleTypeChange = selectedRuleType => {
    this.setState(state => ({
      selectedRuleType: selectedRuleType,
      formData: {
        ...state.formData,
        type: selectedRuleType.value
      }
    }));
  };

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
    // event.preventDefault();
    const data = this.state.formData;
    this.props.saveClick(data);
  };

  render() {
    const { editMode } = this.props;

    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit Rule' : 'New Rule'}
          content={
            <form>
              <Col md={3}>
                <FormGroup>
                  <FormLabel>Rule Type</FormLabel>
                  <Select
                    value={this.state.selectedRuleType}
                    onChange={this.handleRuleTypeChange}
                    options={this.state.ruleTypes}
                  />
                </FormGroup>
              </Col>
              <FormInputs
                ncols={['col-md-6']}
                properties={[
                  {
                    name: 'value',
                    label: 'Value',
                    type: 'text',
                    bsPrefix: 'form-control',
                    value: this.state.formData.value,
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

export default EditRule;
