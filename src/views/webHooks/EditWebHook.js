import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import {
  Button,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl
} from 'react-bootstrap';
import Select from 'react-select';

export class EditWebHook extends Component {
  state = {
    formData: {
      ID: '',
      name: '',
      url: ''
    },
    selectedType: {},
    selectedEnvironment: {}
  };

  componentDidMount() {
    if (this.props.editItem) {
      const selectedType = this.props.webHookTypes.find(
        i => i.value === this.props.editItem.type
      );

      const selectedEnvironment = this.props.environments.find(
        i => i.value === this.props.editItem.environmentId
      );

      this.setState(() => ({
        formData: this.props.editItem,
        selectedType,
        selectedEnvironment
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

  handleSelectType = selectedType => {
    this.setState({ selectedType });
  };

  handleSelectEnv = selectedEnvironment => {
    this.setState({ selectedEnvironment });
  };

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    data.type = this.state.selectedType.value;
    data.environmentId = this.state.selectedEnvironment.value;
    this.props.saveClick(data);
  };

  render() {
    const { editMode } = this.props;
    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit WebHook' : 'New WebHook'}
          content={
            <form>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <FormLabel>Environment</FormLabel>
                    <Select
                      name="environmentId"
                      value={this.state.selectedEnvironment}
                      options={this.props.environments}
                      onChange={this.handleSelectEnv}
                    />
                  </FormGroup>
                </Col>
                <Col xs={3}>
                  <FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormControl
                      name="name"
                      type="text"
                      value={this.state.formData.name}
                      onChange={this.handleChange}
                    ></FormControl>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <FormLabel>WebHook Types</FormLabel>
                    <Select
                      name="type"
                      value={this.state.selectedType}
                      options={this.props.webHookTypes}
                      onChange={this.handleSelectType}
                    />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <FormLabel>URL</FormLabel>
                    <FormControl
                      name="url"
                      type="text"
                      value={this.state.formData.url}
                      onChange={this.handleChange}
                    ></FormControl>
                  </FormGroup>
                </Col>
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

export default EditWebHook;
