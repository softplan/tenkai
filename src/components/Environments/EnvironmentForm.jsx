import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap';

export class EnvironmentForm extends Component {
  state = {
    formData: {
      ID: '',
      group: '',
      name: '',
      cluster_uri: '',
      ca_certificate: '',
      token: '',
      namespace: '',
      gateway: '',
      currentRelease: '',
      host: '',
      username: '',
      password: '',
      envType: 'k8s'
    }
  };

  componentDidMount() {
    if (this.props.editItem) {
      if (!this.props.editItem.envType) {
        this.props.editItem.envType = 'k8s';
      }
      this.setState(() => ({
        formData: this.props.editItem
      }));
    } else {
      this.setState(state => ({
        formData: {
          ...state.formData,
          envType: 'k8s'
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

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    this.props.saveClick(data);
  };

  renderKubernetesEnv = () => {
    return (
      <>
        <FormInputs
          ncols={['col-md-2', 'col-md-3', 'col-md-7']}
          properties={[
            {
              name: 'group',
              label: 'Group',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: 'Version',
              value: this.state.formData.group,
              onChange: this.handleChange
            },
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              bsPrefix: 'form-control',
              value: this.state.formData.name,
              onChange: this.handleChange
            },
            {
              name: 'cluster_uri',
              label: 'Cluster API URL',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: 'http://clusterInfo/',
              value: this.state.formData.cluster_uri,
              onChange: this.handleChange
            }
          ]}
        />

        <Row>
          <Col md={12}>
            <FormGroup controlId="formControlsTextarea">
              <FormLabel>CA Certificate</FormLabel>
              <FormControl
                name="ca_certificate"
                rows="5"
                as="textarea"
                bsPrefix="form-control"
                placeholder="Paste here the CA Certificate"
                value={this.state.formData.ca_certificate}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>

        <FormInputs
          ncols={['col-md-3', 'col-md-3', 'col-md-3', 'col-md-3']}
          properties={[
            {
              name: 'token',
              label: 'Token',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: 'Token',
              value: this.state.formData.token,
              onChange: this.handleChange
            },
            {
              name: 'namespace',
              label: 'Default Namespace',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: '',
              value: this.state.formData.namespace,
              onChange: this.handleChange
            },
            {
              name: 'gateway',
              label: 'Default Gateway',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: '',
              value: this.state.formData.gateway,
              onChange: this.handleChange
            },
            {
              name: 'currentRelease',
              label: 'Current Release',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: 'Current release',
              value: this.state.formData.currentRelease,
              onChange: this.handleChange
            }
          ]}
        />
      </>
    );
  };

  renderDockerEnv = () => {
    return (
      <>
        <FormInputs
          ncols={['col-md-4', 'col-md-4']}
          properties={[
            {
              name: 'group',
              label: 'Group',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: 'Version',
              value: this.state.formData.group,
              onChange: this.handleChange
            },
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              bsPrefix: 'form-control',
              value: this.state.formData.name,
              onChange: this.handleChange
            }
          ]}
        />
        <FormInputs
          ncols={['col-md-4', 'col-md-4', 'col-md-4']}
          properties={[
            {
              name: 'host',
              label: 'Host',
              type: 'text',
              bsPrefix: 'form-control',
              placeholder: 'IP Address',
              value: this.state.formData.host,
              onChange: this.handleChange
            },
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              bsPrefix: 'form-control',
              value: this.state.formData.username,
              onChange: this.handleChange
            },
            {
              name: 'password',
              label: 'Password',
              type: 'text',
              bsPrefix: 'form-control',
              value: this.state.formData.password,
              onChange: this.handleChange
            }
          ]}
        />
      </>
    );
  };

  render() {
    const { editMode } = this.props;
    const { envType } = this.state.formData;

    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit Environment' : 'New Environment'}
          content={
            <>
              <ToggleButtonGroup
                name="envType"
                type="radio"
                value={envType}
                onChange={e =>
                  this.handleChange({ target: { name: 'envType', value: e } })
                }
              >
                <ToggleButton name="radio" value="k8s">
                  Kubernetes
                </ToggleButton>
                <ToggleButton name="radio" value="docker">
                  Docker
                </ToggleButton>
              </ToggleButtonGroup>

              {envType === 'k8s' && this.renderKubernetesEnv()}
              {envType === 'docker' && this.renderDockerEnv()}

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

              <div className="clearfix" />
            </>
          }
        />
      </div>
    );
  }
}

export default EnvironmentForm;
